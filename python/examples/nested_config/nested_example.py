#!/usr/bin/env python3
"""
Nested configuration example for konfigure.

This example demonstrates working with deeply nested configurations and lists.
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
    
    # Access nested values
    print(f"Server host: {config.server.host}")
    print(f"Server port: {config.server.port}")
    
    # Access list items
    print("\nDatabase connections:")
    for i, connection in enumerate(config.database.connections):
        print(f"  Connection {i+1}:")
        print(f"    Name: {connection.name}")
        print(f"    Host: {connection.host}")
        print(f"    Username: {connection.credentials.username}")
    
    # Modify nested values
    print("\nModifying configuration...")
    
    # Add a new allowed origin
    config.server.allowed_origins.append("https://dev.example.com")
    
    # Add a new database connection
    new_connection = konfigure.Config({
        "name": "analytics",
        "driver": "mysql",
        "host": "analytics.example.com",
        "port": 3306,
        "credentials": {
            "username": "analyst",
            "password": "analytics123"
        }
    })
    config.database.connections.append(new_connection)
    
    # Print the modified configuration
    print("\nModified allowed origins:")
    for origin in config.server.allowed_origins:
        print(f"  {origin}")
    
    print("\nModified database connections:")
    for i, connection in enumerate(config.database.connections):
        print(f"  Connection {i+1}:")
        print(f"    Name: {connection.name}")
        print(f"    Driver: {connection.driver}")
        print(f"    Host: {connection.host}")
    
    # Save the changes to a new file
    new_config_path = os.path.join(os.path.dirname(__file__), "modified_config.yaml")
    konfigure.dump(config, new_config_path)
    print(f"\nSaved modified configuration to {new_config_path}")

if __name__ == "__main__":
    main()
