/**
 * Basic usage example for konfigure.
 *
 * This example demonstrates loading a YAML file, accessing values with dot notation,
 * modifying values, and saving the changes back to the file.
 */

import * as path from 'path';
import { load, dump } from '../../src';

const configPath = path.join(__dirname, "config.yaml");

console.log(`Loading configuration from ${configPath}`);

const config = load(configPath);

console.log(`App name: ${config.app_name}`);
console.log(`Debug mode: ${config.debug}`);
console.log(`Database host: ${config.database.host}`);

console.log("\nModifying configuration...");
config.debug = false;
config.database.port = 5433;
config.database.username = "user";

config.environment = "production";

console.log(`Modified app name: ${config.app_name}`);
console.log(`Modified debug mode: ${config.debug}`);
console.log(`Modified database host: ${config.database.host}`);
console.log(`Modified database port: ${config.database.port}`);
console.log(`Modified database username: ${config.database.username}`);
console.log(`New environment setting: ${config.environment}`);

const newConfigPath = path.join(__dirname, "modified_config.yaml");
dump(config, newConfigPath);
console.log(`\nSaved modified configuration to ${newConfigPath}`);
