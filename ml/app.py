from flask import Flask, request, render_template, redirect ,jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os
from model_loader import load_model_safely, test_model_prediction, get_model_info

# Create the Flask application instance
app = Flask(__name__)
CORS(app)

# Load the saved model (update MODEL_PATH as needed)
# Use environment variable or default path
MODEL_PATH = os.environ.get("MODEL_PATH", "./BestSavedModel.keras")

# Load model using the robust loader
print("Loading model...")
model = load_model_safely(MODEL_PATH)

if model is not None:
    # Test the model
    print("Testing model...")
    test_success = test_model_prediction(model)
    if test_success:
        print("✓ Model is ready for predictions!")
        print("Note: Using fallback model due to original model compatibility issues")
    else:
        print("⚠ Model loaded but prediction test failed")
    
    # Print model information
    model_info = get_model_info(model)
    print("Model Information:", model_info)
else:
    print("✗ Failed to load model")

class_names = ["Battery", "Keyboard", "Microwave", "Mobile", "Mouse", "PCB", "Player", "Printer", "Television", "Washing Machine"]

def preprocess_image(image, target_size=(224, 224)):
    """
    Resize the image to the target size, convert it to a numpy array,
    and preprocess using MobileNetV2's preprocess_input function.
    """
    image = image.resize(target_size)
    image = np.array(image)
    # Convert image pixels to the range [-1, 1] as expected by MobileNetV2
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

def further_processing(predicted_category):
    """
    Further processing based on the predicted category.
    For example, look up additional details in a component database.
    """
    component_database = {
        "Battery": {
            "Components": ["Lithium-Ion Battery", "PCB", "Casing"],
            "Estimated_Value": "₹150 - ₹300",
            "Notes": "Battery can be refurbished; PCB contains recoverable precious metals."
        },
        "Keyboard": {
            "Components": ["Keycaps", "Circuit Board"],
            "Estimated_Value": "₹100 - ₹200",
            "Notes": "Components are recyclable with potential for reuse."
        },
        "Microwave": {
            "Components": ["Magnetron", "Circuit Board", "Casing"],
            "Estimated_Value": "₹500 - ₹1000",
            "Notes": "High potential for material recovery."
        },
        "Mobile": {
            "Components": ["Screen", "Battery", "PCB", "Casing"],
            "Estimated_Value": "₹200 - ₹500",
            "Notes": "Valuable components for refurbishment and recycling."
        },
        "Mouse": {
            "Components": ["Optical Sensor", "PCB", "Casing"],
            "Estimated_Value": "₹50 - ₹100",
            "Notes": "Small but recyclable components."
        },
        "PCB": {
            "Components": ["Copper", "Gold", "Silver", "Plastic"],
            "Estimated_Value": "₹100 - ₹300",
            "Notes": "High value for precious metal recovery."
        },
        "Player": {
            "Components": ["Optical Drive", "PCB", "Casing"],
            "Estimated_Value": "₹150 - ₹300",
            "Notes": "Components can be reused or recycled."
        },
        "Printer": {
            "Components": ["Print Head", "PCB", "Motor", "Casing"],
            "Estimated_Value": "₹300 - ₹600",
            "Notes": "Multiple valuable components for recycling."
        },
        "Television": {
            "Components": ["Screen", "PCB", "Speakers", "Casing"],
            "Estimated_Value": "₹800 - ₹1500",
            "Notes": "High value components, especially the screen."
        },
        "Washing Machine": {
            "Components": ["Motor", "PCB", "Drum", "Casing"],
            "Estimated_Value": "₹1000 - ₹2000",
            "Notes": "Large components with high recycling value."
        }
    }
    return component_database.get(predicted_category, {"Components": [], "Estimated_Value": "N/A", "Notes": "No details available."})

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Check if model is loaded
        if model is None:
            return jsonify({"error": "Model not loaded properly"}), 500

        # Process the image using PIL
        image = Image.open(file.stream).convert("RGB")
        processed_image = preprocess_image(image)

        # Make a prediction using the loaded model
        predictions = model.predict(processed_image, verbose=0)
        predicted_index = np.argmax(predictions[0])
        confidence = predictions[0][predicted_index]
        predicted_class = class_names[predicted_index]

        # Use the predicted category for further processing
        additional_details = further_processing(predicted_class)

        return jsonify({
            "prediction": predicted_class,
            "confidence": float(confidence),
            "details": additional_details,
            "model_status": "fallback" if "fallback" in str(type(model)) else "original"
        })
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": "Failed to process the image"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify the service is running."""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "model_info": get_model_info(model) if model else None
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)