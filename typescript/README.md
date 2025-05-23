# Konfigure TypeScript

A TypeScript implementation of the Konfigure library for YAML-based configuration management with dot notation access and template rendering capabilities.

## Overview

Konfigure is designed for managing configuration data stored in YAML files, with a primary focus on separating code from prompts in Large Language Model (LLM) applications. The library serves developers who need to:

- **Manage complex configuration hierarchies** without hardcoding values in their applications
- **Dynamically generate configuration content** using Handlebars templating
- **Easily access and modify nested configuration data** through intuitive dot notation
- **Separate LLM prompts from application code** for better maintainability and experimentation

## Installation

```bash
npm install konfigure
```

## Usage

### Basic Usage

```typescript
import { load, dump, Config } from 'konfigure';

// Load configuration from a YAML file
const config = load('./config.yaml');

// Access values using dot notation
console.log(config.database.host);
console.log(config.database.port);

// Modify values
config.database.port = 5433;
config.environment = 'production';

// Save changes back to the file
dump(config);
```

### Template Rendering

```typescript
import { Config } from 'konfigure';

const templates = new Config({
  greeting: 'Hello {{ name }}!',
  message: 'Welcome to {{ app_name }}. Today is {{ date }}.'
});

// Render templates with variables
const rendered = templates.greeting.render({ name: 'World' });
console.log(rendered); // Outputs: Hello World!

const messageRendered = templates.message.render({
  app_name: 'Konfigure',
  date: new Date().toLocaleDateString()
});
console.log(messageRendered);
```

## API Reference

### `load(filePath: string): Config`

Loads a YAML file into a Config object.

- **filePath**: Path to the YAML file to load
- **Returns**: Config object with the loaded data

### `dump(config: Config, filePath?: string): boolean`

Saves a Config object to a YAML file.

- **config**: Config object to save
- **filePath**: Path to save the YAML file to. If undefined, uses the path the Config was loaded from.
- **Returns**: True if successful, False otherwise

### `Config`

Enhanced object with dot notation access.

- **Methods**:
  - `_toSerializable()`: Convert the Config to a serializable object

### `StringTemplate`

String class with template rendering capabilities.

- **Methods**:
  - `render(variables: Record<string, any>)`: Render the template with the provided variables
  - `toString()`: Convert to string
  - `valueOf()`: Get the raw string value

## License

MIT
