import { test } from 'node:test';
import assert from 'node:assert';
import SchemaValidator from '../server/schema-validator.js';

test('SchemaValidator - load schema', () => {
  const validator = new SchemaValidator('./schemas');
  const schema = validator.loadSchema('tool-input.schema.json');
  
  assert.ok(schema, 'Should load schema');
  assert.strictEqual(schema.type, 'object');
});

test('SchemaValidator - validate valid input', () => {
  const validator = new SchemaValidator('./schemas');
  validator.loadSchema('tool-input.schema.json');
  
  const result = validator.validate('tool-input.schema.json', { text: 'Hello world' });
  
  assert.strictEqual(result.valid, true, 'Should validate valid input');
  assert.strictEqual(result.errors.length, 0);
});

test('SchemaValidator - validate invalid input (missing text)', () => {
  const validator = new SchemaValidator('./schemas');
  validator.loadSchema('tool-input.schema.json');
  
  const result = validator.validate('tool-input.schema.json', {});
  
  assert.strictEqual(result.valid, false, 'Should not validate input without text');
  assert.ok(result.errors.length > 0);
});

test('SchemaValidator - validate invalid input (empty text)', () => {
  const validator = new SchemaValidator('./schemas');
  validator.loadSchema('tool-input.schema.json');
  
  const result = validator.validate('tool-input.schema.json', { text: '' });
  
  assert.strictEqual(result.valid, false, 'Should not validate empty text');
});

test('SchemaValidator - validate invalid input (wrong type)', () => {
  const validator = new SchemaValidator('./schemas');
  validator.loadSchema('tool-input.schema.json');
  
  const result = validator.validate('tool-input.schema.json', { text: 123 });
  
  assert.strictEqual(result.valid, false, 'Should not validate non-string text');
});

test('SchemaValidator - get error message', () => {
  const validator = new SchemaValidator('./schemas');
  validator.loadSchema('tool-input.schema.json');
  
  const result = validator.validate('tool-input.schema.json', {});
  const message = validator.getErrorMessage(result.errors);
  
  assert.ok(message.length > 0, 'Should generate error message');
});
