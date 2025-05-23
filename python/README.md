# Confiture

A YAML-based configuration management tool for separating code from prompts in LLMs.

## Installation

```bash
pip install confiture
```

## Usage

```python
import confiture

# Load a YAML file
config = confiture.load('config.yaml')

# Access values using dot notation
print(config.a.b)  # Prints the value of b in the a section

# Set values
config.a.b = 'new value'
config.new_section = {'key': 'value'}

# Render Jinja2 templates
template_value = config.a.b.render(variable='value')

# Save changes back to the file
confiture.dump(config, 'config.yaml')
```

## Features

- Load YAML configuration files into memory
- Access configuration values using dot notation
- Modify configuration values in memory
- Render string values as Jinja2 templates
- Save configuration back to YAML files

## License

MIT
