from flask import Flask, request, render_template, redirect ,jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os

# Create the Flask application instance
app = Flask(__name__)
CORS(app)
# Load the saved model (update MODEL_PATH as needed)
MODEL_PATH = "C:/Users/Aman/OneDrive/Documents/E-cycleHub/E-waste Marketplace/BestSavedModel.keras"
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

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
        # Add more category entries as needed.
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
        # Process the image using PIL
        image = Image.open(file.stream).convert("RGB")
        processed_image = preprocess_image(image)

        # Make a prediction using the loaded model
        predictions = model.predict(processed_image)
        predicted_index = np.argmax(predictions[0])
        confidence = predictions[0][predicted_index]
        predicted_class = class_names[predicted_index]

        # Use the predicted category for further processing
        additional_details = further_processing(predicted_class)

        return jsonify({
            "prediction": predicted_class,
            "confidence": float(confidence),
            "details": additional_details
        })
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": "Failed to process the image"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Run on port 5001