import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { load, dump, Config, StringTemplate } from '../core';

describe('StringTemplate', () => {
  test('initialization', () => {
    const st = new StringTemplate('Hello {{ name }}');
    expect(st.rawString).toBe('Hello {{ name }}');
  });

  test('rendering templates', () => {
    const st = new StringTemplate('Hello {{ name }}');
    expect(st.render({ name: 'World' })).toBe('Hello World');
  });

  test('string conversion', () => {
    const st = new StringTemplate('Hello {{ name }}');
    expect(String(st)).toBe('Hello {{ name }}');
  });

  test('equality', () => {
    const st1 = new StringTemplate('Hello {{ name }}');
    const st2 = new StringTemplate('Hello {{ name }}');
    const st3 = new StringTemplate('Goodbye {{ name }}');
    
    expect(st1.rawString).toBe(st2.rawString);
    expect(st1.rawString).not.toBe(st3.rawString);
    expect(st1.rawString).toBe('Hello {{ name }}');
  });
});

describe('Config', () => {
  test('initialization', () => {
    const config = new Config({ a: { b: 'c' }, d: 'e' });
    expect(config.a.b.toString()).toBe('c');
    expect(config.d.toString()).toBe('e');
  });

  test('attribute access', () => {
    const config = new Config({ a: { b: 'c' }, d: 'e' });
    expect(config.a.b.toString()).toBe('c');
    expect(config.d.toString()).toBe('e');
    expect(config.f).toBeUndefined();
  });

  test('setting attributes', () => {
    const config = new Config();
    config.a = { b: 'c' };
    config.d = 'e';
    
    expect(config.a.b.toString()).toBe('c');
    expect(config.d.toString()).toBe('e');
    
    config.a.b = 'f';
    expect(config.a.b.toString()).toBe('f');
  });

  test('string template conversion', () => {
    const config = new Config({ a: 'Hello {{ name }}' });
    expect(config.a).toBeInstanceOf(StringTemplate);
    expect(config.a.render({ name: 'World' })).toBe('Hello World');
  });

  test('conversion to serializable format', () => {
    const config = new Config({ a: { b: 'c' }, d: 'e' });
    const serialized = config._toSerializable();
    expect(serialized).toEqual({ a: { b: 'c' }, d: 'e' });
  });
});

describe('Load and Dump', () => {
  let tempDir: string;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'konfigure-test-'));
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  test('loading a non-existent file', () => {
    const tempPath = path.join(tempDir, 'nonexistent.yaml');
    const config = load(tempPath);
    
    expect(config).toBeInstanceOf(Config);
    expect(Object.keys(config).filter(k => !k.startsWith('_'))).toHaveLength(0);
    expect(config._yamlPath).toBe(path.resolve(tempPath));
  });
  
  test('loading and dumping a file', () => {
    const tempPath = path.join(tempDir, 'config.yaml');
    fs.writeFileSync(tempPath, `
a:
  b: c
d: e
`);
    
    const config = load(tempPath);
    expect(config.a.b.toString()).toBe('c');
    expect(config.d.toString()).toBe('e');
    
    config.a.b = 'f';
    config.g = 'h';
    
    const newTempPath = path.join(tempDir, 'config.new.yaml');
    dump(config, newTempPath);
    
    const newConfig = load(newTempPath);
    expect(newConfig.a.b.toString()).toBe('f');
    expect(newConfig.d.toString()).toBe('e');
    expect(newConfig.g.toString()).toBe('h');
  });
  
  test('dumping to the original path', () => {
    const tempPath = path.join(tempDir, 'config.yaml');
    fs.writeFileSync(tempPath, `
a:
  b: c
d: e
`);
    
    const config = load(tempPath);
    config.a.b = 'f';
    dump(config); // No path provided, should use the original
    
    const newConfig = load(tempPath);
    expect(newConfig.a.b.toString()).toBe('f');
  });
});

describe('Usage Examples', () => {
  let tempDir: string;
  
  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'konfigure-test-'));
  });
  
  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  
  test('basic example', () => {
    const tempPath = path.join(tempDir, 'config.yaml');
    fs.writeFileSync(tempPath, `
a:
  b: c
c: d
`);
    
    const config = load(tempPath);
    expect(config.a.b.toString()).toBe('c');
    
    config.a.b = 'g';
    expect(config.a.b.toString()).toBe('g');
    
    config.a = true;
    expect(config.a).toBe(true);
    
    dump(config);
    
    const newConfig = load(tempPath);
    expect(newConfig.a).toBe(true);
  });
  
  test('render example', () => {
    const config = new Config({
      a: {
        b: 'Hello {{ name }}'
      }
    });
    
    expect(config.a.b.render({ name: 'World' })).toBe('Hello World');
  });
});
