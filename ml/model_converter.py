#!/usr/bin/env python3
"""
Model converter script to handle model format compatibility issues.
"""

import tensorflow as tf
import os
import numpy as np

def convert_model_format(input_path, output_path, target_format='keras'):
    """
    Convert model between different formats to resolve compatibility issues.
    
    Args:
        input_path: Path to the input model
        output_path: Path to save the converted model
        target_format: Target format ('keras', 'saved_model', 'h5')
    """
    try:
        print(f"Converting model from {input_path} to {output_path}")
        print(f"Target format: {target_format}")
        
        # Load the original model
        print("Loading original model...")
        model = tf.keras.models.load_model(input_path, compile=False)
        
        # Save in the target format
        if target_format == 'keras':
            model.save(output_path, save_format='keras')
        elif target_format == 'saved_model':
            model.save(output_path, save_format='tf')
        elif target_format == 'h5':
            model.save(output_path, save_format='h5')
        else:
            raise ValueError(f"Unsupported target format: {target_format}")
        
        print(f"✓ Model converted successfully to {output_path}")
        return True
        
    except Exception as e:
        print(f"✗ Model conversion failed: {e}")
        return False

def create_compatible_model(input_path, output_path):
    """
    Create a compatible model by rebuilding the architecture.
    """
    try:
        print("Creating compatible model...")
        
        # Load the original model to get architecture
        original_model = tf.keras.models.load_model(input_path, compile=False)
        
        # Create a new model with the same architecture
        new_model = tf.keras.models.clone_model(original_model)
        
        # Compile the new model
        new_model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Save the new model
        new_model.save(output_path, save_format='keras')
        
        print(f"✓ Compatible model created at {output_path}")
        return True
        
    except Exception as e:
        print(f"✗ Failed to create compatible model: {e}")
        return False

def main():
    """Main function to convert the model."""
    input_path = r"D:\EcycleHub\ECycleHub\ml\BestSavedModel.keras"
    
    # Try different conversion strategies
    strategies = [
        ('keras', 'BestSavedModel_converted.keras'),
        ('saved_model', 'BestSavedModel_savedmodel'),
        ('h5', 'BestSavedModel.h5')
    ]
    
    print("=" * 50)
    print("MODEL CONVERSION UTILITY")
    print("=" * 50)
    
    for format_type, output_name in strategies:
        output_path = os.path.join(os.path.dirname(input_path), output_name)
        
        print(f"\nTrying conversion to {format_type}...")
        success = convert_model_format(input_path, output_path, format_type)
        
        if success:
            print(f"✓ Successfully converted to {format_type}")
            break
        else:
            print(f"✗ Failed to convert to {format_type}")
    
    # If all conversions fail, try creating a compatible model
    print("\nTrying to create compatible model...")
    compatible_path = os.path.join(os.path.dirname(input_path), 'BestSavedModel_compatible.keras')
    create_compatible_model(input_path, compatible_path)

if __name__ == "__main__":
    main()
