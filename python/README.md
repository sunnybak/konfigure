# Konfigure

A YAML-based configuration management tool for separating code from prompts in LLMs.

## Installation

```bash
# Install from PyPI
pip install konfigure

# Install from source
pip install git+https://github.com/sunnybak/confiture.git#subdirectory=python
```

## Usage

```python
import konfigure

# Load a YAML file
config = konfigure.load('config.yaml')

# Access values using dot notation
print(config.a.b)  # Prints the value of b in the a section

# Set values
config.a.b = 'new value'
config.new_section = {'key': 'value'}

# Render Jinja2 templates
template_value = config.a.b.render(variable='value')

# Save changes back to the file
konfigure.dump(config, 'config.yaml')
```

## Features

- Load YAML configuration files into memory
- Access configuration values using dot notation
- Modify configuration values in memory
- Render string values as Jinja2 templates
- Save configuration back to YAML files

## Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/sunnybak/confiture.git
cd confiture/python

# Install in development mode
pip install -e .

# Install development dependencies
pip install -e ".[dev]"
```

### Running Tests

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=confiture

# Run a specific test file
pytest confiture/tests/test_core.py
```

### Building the Package

```bash
# Build the package
python -m build

# Install the built package
pip install dist/confiture-0.1.0-py3-none-any.whl
```

## License

MIT
