/**
 * Core functionality for the konfigure package.
 *
 * This module provides the main classes and functions for working with YAML configuration files.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as Handlebars from 'handlebars';
import { get, set, has } from 'lodash';

/**
 * StringTemplate class for template rendering
 * Equivalent to Python's StringTemplate class
 */
export class StringTemplate {
  rawString: string;

  constructor(content: string) {
    this.rawString = content;
  }

  /**
   * Render the template with the provided variables
   * @param variables Variables to use in template rendering
   * @returns Rendered string
   */
  render(variables: Record<string, any> = {}): string {
    Handlebars.registerHelper('render_template', function(templateStr: string, context: any) {
      const template = Handlebars.compile(templateStr);
      return template(context);
    });

    const template = Handlebars.compile(this.rawString);
    let result = template(variables);

    if (result.includes('{{')) {
      const secondTemplate = Handlebars.compile(result);
      result = secondTemplate(variables);

      if (result.includes('{{')) {
        const thirdTemplate = Handlebars.compile(result);
        result = thirdTemplate(variables);
      }
    }

    return result;
  }

  toString(): string {
    return this.rawString;
  }

  valueOf(): string {
    return this.rawString;
  }
}

/**
 * Config class for enhanced object with dot notation access
 * Equivalent to Python's Config class
 */
export class Config {
  [key: string]: any;
  _yamlPath?: string;
  _parent?: Config;
  _parentKey?: string;

  /**
   * Create a new Config instance
   * @param dictValue Initial object to convert to Config
   * @param yamlPath Path to the YAML file this config is associated with
   * @param parent Parent Config object if this is a nested config
   * @param parentKey Key in the parent that this config is stored under
   */
  constructor(
    dictValue: Record<string, any> = {}, 
    yamlPath?: string, 
    parent?: Config, 
    parentKey?: string
  ) {
    this._yamlPath = yamlPath;
    this._parent = parent;
    this._parentKey = parentKey;

    this._convertToConfig(dictValue);
  }

  /**
   * Convert a dictionary to Config format recursively
   * @param dict Dictionary to convert
   */
  private _convertToConfig(dict: Record<string, any>): void {
    for (const [key, value] of Object.entries(dict)) {
      if (key.startsWith('_')) {
        continue; // Skip private properties
      }
      this[key] = this._convertValue(value, key);
    }
  }

  /**
   * Convert a value to its appropriate type
   * @param value Value to convert
   * @param key Key associated with the value
   * @returns Converted value
   */
  private _convertValue(value: any, key?: string): any {
    if (value === null || value === undefined) {
      return null;
    } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Config)) {
      return new Config(value, undefined, this, key);
    } else if (Array.isArray(value)) {
      return value.map(item => this._convertValue(item));
    } else if (typeof value === 'string') {
      const template = new StringTemplate(value);
      Object.defineProperty(template, 'toString', {
        value: function() { return this.rawString; },
        enumerable: false
      });
      Object.defineProperty(template, Symbol.toPrimitive, {
        value: function(hint: string) {
          return this.rawString;
        },
        enumerable: false
      });
      return template;
    } else if (value instanceof Config) {
      value._parent = this;
      value._parentKey = key;
      return value;
    } else {
      return value;
    }
  }

  /**
   * Convert the Config to a serializable object
   * @returns Plain JavaScript object
   */
  _toSerializable(): Record<string, any> {
    const serialize = (v: any): any => {
      if (v instanceof Config) {
        return v._toSerializable();
      } else if (v instanceof StringTemplate) {
        return v.rawString;
      } else if (Array.isArray(v)) {
        return v.map(item => serialize(item));
      } else if (v !== null && typeof v === 'object') {
        const result: Record<string, any> = {};
        for (const [k, val] of Object.entries(v)) {
          if (!k.startsWith('_')) {
            result[k] = serialize(val);
          }
        }
        return result;
      } else {
        return v;
      }
    };

    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(this)) {
      if (!k.startsWith('_')) {
        result[k] = serialize(v);
      }
    }
    return result;
  }
}

/**
 * Load a YAML file into a Config object
 * @param filePath Path to the YAML file to load
 * @returns Config object with the loaded data
 */
export function load(filePath: string): Config {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    const config = new Config({});
    config._yamlPath = fullPath;
    return config;
  }
  
  try {
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const data = yaml.load(fileContent) as Record<string, any> || {};
    const config = new Config(data);
    config._yamlPath = fullPath;
    return config;
  } catch (e) {
    console.warn(`Warning: Failed to load config from ${filePath}: ${e}`);
    const config = new Config({});
    config._yamlPath = fullPath;
    return config;
  }
}

/**
 * Save a Config object to a YAML file
 * @param config Config object to save
 * @param filePath Path to save the YAML file to. If undefined, uses the path the Config was loaded from.
 * @returns True if successful, False otherwise
 */
export function dump(config: Config, filePath?: string): boolean {
  if (!(config instanceof Config)) {
    throw new TypeError("Can only dump Config objects");
  }
  
  const yamlPath = filePath || config._yamlPath;
  if (!yamlPath) {
    throw new Error("No file path provided and Config has no associated file path");
  }
  
  const fullPath = path.resolve(yamlPath);
  
  try {
    const directory = path.dirname(fullPath);
    if (directory && !fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    
    const serializableData = config._toSerializable();
    
    fs.writeFileSync(
      fullPath,
      yaml.dump(serializableData, {
        indent: 2,
        lineWidth: 100,
        noRefs: true,
      })
    );
    return true;
  } catch (e) {
    console.warn(`Warning: Failed to save config to ${fullPath}: ${e}`);
    return false;
  }
}
