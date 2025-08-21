#!/usr/bin/env python3
"""
Test script to verify model loading and prediction functionality.
"""

import sys
import os
import numpy as np
from PIL import Image
import tensorflow as tf

# Add current directory to path to import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from model_loader import load_model_safely, test_model_prediction, get_model_info

def test_model_loading():
    """Test model loading functionality."""
    print("=" * 50)
    print("TESTING MODEL LOADING")
    print("=" * 50)
    
    # Test with the actual model path
    model_path = r"D:\EcycleHub\ECycleHub\ml\BestSavedModel.keras"
    
    print(f"Testing model path: {model_path}")
    print(f"File exists: {os.path.exists(model_path)}")
    
    # Load the model
    model = load_model_safely(model_path)
    
    if model is not None:
        print("✓ Model loaded successfully!")
        
        # Test prediction
        print("\nTesting model prediction...")
        test_success = test_model_prediction(model)
        
        if test_success:
            print("✓ Model prediction test passed!")
        else:
            print("✗ Model prediction test failed!")
        
        # Get model info
        print("\nModel Information:")
        model_info = get_model_info(model)
        for key, value in model_info.items():
            print(f"  {key}: {value}")
    else:
        print("✗ Model loading failed!")

def test_image_preprocessing():
    """Test image preprocessing functionality."""
    print("\n" + "=" * 50)
    print("TESTING IMAGE PREPROCESSING")
    print("=" * 50)
    
    try:
        # Create a dummy image
        dummy_image = Image.new('RGB', (224, 224), color='red')
        
        # Test preprocessing
        from app import preprocess_image
        processed = preprocess_image(dummy_image)
        
        print(f"✓ Image preprocessing successful!")
        print(f"  Input shape: {dummy_image.size}")
        print(f"  Output shape: {processed.shape}")
        print(f"  Output dtype: {processed.dtype}")
        
        return True
    except Exception as e:
        print(f"✗ Image preprocessing failed: {e}")
        return False

def main():
    """Main test function."""
    print("Starting ML Model Tests...")
    print(f"TensorFlow version: {tf.__version__}")
    print(f"Python version: {sys.version}")
    
    # Test model loading
    test_model_loading()
    
    # Test image preprocessing
    test_image_preprocessing()
    
    print("\n" + "=" * 50)
    print("TEST COMPLETED")
    print("=" * 50)

if __name__ == "__main__":
    main()
