#!/usr/bin/env python3
"""
Basic usage example for konfigure.

This example demonstrates loading a YAML file, accessing values with dot notation,
modifying values, and saving the changes back to the file.
"""

import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import konfigure
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

import konfigure

def main():
    # Get the path to the config file
    config_path = os.path.join(os.path.dirname(__file__), "config.yaml")
    
    print(f"Loading configuration from {config_path}")
    
    # Load the configuration
    config = konfigure.load(config_path)
    
    # Access values using dot notation
    print(f"App name: {config.app_name}")
    print(f"Debug mode: {config.debug}")
    print(f"Database host: {config.database.host}")
    
    # Modify values
    print("\nModifying configuration...")
    config.debug = False
    config.database.port = 5433
    config.database.username = "user"
    
    # Add new values
    config.environment = "production"
    
    # Print the modified configuration
    print(f"Modified app name: {config.app_name}")
    print(f"Modified debug mode: {config.debug}")
    print(f"Modified database host: {config.database.host}")
    print(f"Modified database port: {config.database.port}")
    print(f"Modified database username: {config.database.username}")
    print(f"New environment setting: {config.environment}")
    
    # Save the changes to a new file
    new_config_path = os.path.join(os.path.dirname(__file__), "modified_config.yaml")
    konfigure.dump(config, new_config_path)
    print(f"\nSaved modified configuration to {new_config_path}")

if __name__ == "__main__":
    main()
