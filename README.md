# konfigure
A YAML based configuration management tool for separating code from prompts in LLMs

## Features

- **Dot notation access**: Access nested configuration values using simple dot notation
- **Jinja2 template rendering**: Embed dynamic templates in your configuration values
- **Safe attribute access**: Returns `None` for missing attributes instead of raising errors
- **Type preservation**: Maintains proper types while adding enhanced functionality
- **YAML compatibility**: Full support for YAML features including anchors, aliases, and multiline strings

## Installation

### Development Installation

1. Clone the repository and navigate to the Python package directory:
```bash
cd konfigure/python
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install the package in development mode with dependencies:
```bash
pip install -e ".[dev]"
```

## Quick Start

```python
import konfigure

# Load a YAML configuration file
config = konfigure.load('config.yaml')

# Access values using dot notation
print(config.database.host)
print(config.server.port)

# Safe attribute access - returns None instead of raising errors
print(config.nonexistent.attribute)  # Returns None

# Modify values
config.database.password = "new_password"
config.new_setting = "value"

# Save changes
konfigure.dump(config)  # Saves to original file
# or
konfigure.dump(config, 'new_config.yaml')  # Saves to new file

# Template rendering with Jinja2
config.message = "Hello {{ name }}!"
rendered = config.message.render(name="World")
print(rendered)  # "Hello World!"
```

## Testing

### Prerequisites

Make sure you have installed the package with development dependencies:
```bash
pip install -e ".[dev]"
```

### Running All Tests

To run the complete test suite (23 tests total):
```bash
pytest
```

For verbose output showing each test:
```bash
pytest -v
```

### Running Individual Test Suites

#### Core Tests (15 tests)
Tests basic functionality including Config class, StringTemplate, load/dump operations:
```bash
pytest konfigure/tests/test_core.py -v
```

#### Advanced Feature Tests (8 tests)
Tests complex scenarios including nested structures, YAML features, and template rendering:
```bash
pytest konfigure/tests/test_advanced_features.py -v
```

### Running Specific Test Classes

```bash
# Test only StringTemplate functionality
pytest konfigure/tests/test_core.py::TestStringTemplate -v

# Test only Config class functionality
pytest konfigure/tests/test_core.py::TestConfig -v

# Test only nested structures
pytest konfigure/tests/test_advanced_features.py::TestNestedStructures -v

# Test only template rendering
pytest konfigure/tests/test_advanced_features.py::TestTemplateRendering -v
```

### Running Specific Test Methods

```bash
# Test specific method
pytest konfigure/tests/test_core.py::TestConfig::test_getattr -v

# Test template rendering with control structures
pytest konfigure/tests/test_advanced_features.py::TestTemplateRendering::test_template_control_structures -v
```

### Test Coverage Information

The test suite covers:
- **Core functionality**: Basic Config operations, attribute access, serialization
- **String templates**: Jinja2 template rendering and safe attribute access
- **Load/dump operations**: YAML file I/O with proper error handling
- **Advanced features**: Nested structures, lists, complex data types
- **YAML features**: Anchors, aliases, multiline strings
- **Safe attribute access**: Error-free access to missing attributes on all types

### Expected Test Results

When all tests pass, you should see:
```
============================================ 23 passed in 0.04s =============================================
```

If any tests fail, the output will show detailed information about the failures to help with debugging.

## Examples

The `examples/` directory contains practical usage examples:

- `examples/basic_usage/` - Simple configuration loading and modification
- `examples/nested_config/` - Working with complex nested configurations  
- `examples/template_rendering/` - Advanced Jinja2 template usage

To run an example:
```bash
python examples/basic_usage/basic_example.py
```

## Dependencies

- **Runtime**: `pyyaml>=6.0`, `jinja2>=3.0.0`
- **Development**: `pytest>=7.0.0`, `black>=23.0.0`, `isort>=5.0.0`

## License

MIT
