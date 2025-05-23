/**
 * Template rendering example for konfigure.
 *
 * This example demonstrates loading templates from YAML and rendering them with variables.
 */

import * as path from 'path';
import { load, dump, Config } from '../../src';

const templatesPath = path.join(__dirname, "templates.yaml");

console.log(`Loading templates from ${templatesPath}`);

const templates = load(templatesPath);

const variables = {
  assistant_name: "ConfigBot",
  domain: "configuration management",
  current_date: new Date().toISOString().split('T')[0],
  user_name: "Alice",
  topic: "YAML configuration",
  error_reason: "the service is temporarily unavailable",
  source: "the documentation",
  answer: "YAML is a human-friendly data serialization standard",
  additional_info: [
    "YAML stands for 'YAML Ain't Markup Language'",
    "It's commonly used for configuration files",
    "It's a superset of JSON"
  ]
};

console.log("\nRendered system prompt:");
console.log(templates.system_prompt.render(variables));

console.log("\nRendered user prompt templates:");
console.log(`Greeting: ${templates.user_prompt_templates.greeting.render(variables)}`);
console.log(`Summary: ${templates.user_prompt_templates.summary.render(variables)}`);
console.log(`Error: ${templates.user_prompt_templates.error.render(variables)}`);

console.log("\nRendered response templates:");
for (const template of templates.response_templates) {
  console.log(`\n${template.name}:`);
  console.log(template.template.render(variables));
}

console.log("\nModifying templates...");
templates.user_prompt_templates.greeting = "Hi {{ user_name }}! How may I assist you with {{ domain }} today?";

const newTemplate = new Config({
  name: "bullet_list",
  template: "{{#each additional_info}}\n• {{this}}\n{{/each}}"
});
templates.response_templates.push(newTemplate);

console.log("\nRendered modified greeting template:");
console.log(templates.user_prompt_templates.greeting.render(variables));

console.log("\nRendered new bullet list template:");
console.log(templates.response_templates[2].template.render(variables));

const newTemplatesPath = path.join(__dirname, "modified_templates.yaml");
dump(templates, newTemplatesPath);
console.log(`\nSaved modified templates to ${newTemplatesPath}`);
