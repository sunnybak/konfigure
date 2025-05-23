#!/usr/bin/env python3
"""
Template rendering example for confiture.

This example demonstrates loading templates from YAML and rendering them with variables.
"""

import os
import sys
import datetime
from pathlib import Path

# Add the parent directory to the path so we can import confiture
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

import confiture

def main():
    # Get the path to the templates file
    templates_path = os.path.join(os.path.dirname(__file__), "templates.yaml")
    
    print(f"Loading templates from {templates_path}")
    
    # Load the templates
    templates = confiture.load(templates_path)
    
    # Prepare variables for rendering
    variables = {
        "assistant_name": "ConfigBot",
        "domain": "configuration management",
        "current_date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "user_name": "Alice",
        "topic": "YAML configuration",
        "error_reason": "the service is temporarily unavailable",
        "source": "the documentation",
        "answer": "YAML is a human-friendly data serialization standard",
        "additional_info": [
            "YAML stands for 'YAML Ain't Markup Language'",
            "It's commonly used for configuration files",
            "It's a superset of JSON"
        ]
    }
    
    # Render the system prompt
    print("\nRendered system prompt:")
    print(templates.system_prompt.render(**variables))
    
    # Render user prompt templates
    print("\nRendered user prompt templates:")
    print(f"Greeting: {templates.user_prompt_templates.greeting.render(**variables)}")
    print(f"Summary: {templates.user_prompt_templates.summary.render(**variables)}")
    print(f"Error: {templates.user_prompt_templates.error.render(**variables)}")
    
    # Render response templates
    print("\nRendered response templates:")
    for template in templates.response_templates:
        print(f"\n{template.name}:")
        print(template.template.render(**variables))
    
    # Modify a template
    print("\nModifying templates...")
    templates.user_prompt_templates.greeting = "Hi {{ user_name }}! How may I assist you with {{ domain }} today?"
    
    # Add a new template
    templates.response_templates.append({
        "name": "bullet_list",
        "template": "{% for item in additional_info %}\n• {{ item }}\n{% endfor %}"
    })
    
    # Render the modified template
    print("\nRendered modified greeting template:")
    print(templates.user_prompt_templates.greeting.render(**variables))
    
    # Render the new template
    print("\nRendered new bullet list template:")
    print(templates.response_templates[2].template.render(**variables))
    
    # Save the changes to a new file
    new_templates_path = os.path.join(os.path.dirname(__file__), "modified_templates.yaml")
    confiture.dump(templates, new_templates_path)
    print(f"\nSaved modified templates to {new_templates_path}")

if __name__ == "__main__":
    main()
