import { test } from 'node:test';
import assert from 'node:assert';
import { execute as executeActionImpact } from '../tools/action_impact_model.js';
import { execute as executeCategoryLevel } from '../tools/category_level_model.js';

test('action_impact_model - execute with text', async () => {
  const input = { text: 'This is a critical task that needs urgent attention' };
  const result = await executeActionImpact(input);
  
  assert.ok(result.result, 'Should have result');
  assert.ok(result.result.impactLevel, 'Should have impactLevel');
  assert.ok(typeof result.result.score === 'number', 'Should have numeric score');
  assert.ok(result.metadata, 'Should have metadata');
  assert.strictEqual(result.metadata.tool, 'action_impact_model');
});

test('action_impact_model - high impact detection', async () => {
  const input = { text: 'This is a critical and urgent matter' };
  const result = await executeActionImpact(input);
  
  assert.strictEqual(result.result.impactLevel, 'high', 'Should detect high impact');
  assert.ok(result.result.score >= 0.8, 'High impact should have score >= 0.8');
});

test('action_impact_model - low impact detection', async () => {
  const input = { text: 'This is a simple routine task' };
  const result = await executeActionImpact(input);
  
  assert.strictEqual(result.result.impactLevel, 'low', 'Should detect low impact');
});

test('category_level_model - execute with text', async () => {
  const input = { text: 'This software program uses advanced data processing' };
  const result = await executeCategoryLevel(input);
  
  assert.ok(result.result, 'Should have result');
  assert.ok(result.result.primaryCategory, 'Should have primaryCategory');
  assert.ok(result.result.level, 'Should have level');
  assert.ok(Array.isArray(result.result.categories), 'Should have categories array');
  assert.ok(result.metadata, 'Should have metadata');
  assert.strictEqual(result.metadata.tool, 'category_level_model');
});

test('category_level_model - technology categorization', async () => {
  const input = { text: 'Building software with code and API' };
  const result = await executeCategoryLevel(input);
  
  assert.ok(result.result.categories.includes('technology'), 'Should detect technology category');
});

test('category_level_model - uncategorized text', async () => {
  const input = { text: 'The quick brown fox jumps over the lazy dog' };
  const result = await executeCategoryLevel(input);
  
  assert.strictEqual(result.result.level, 'uncategorized', 'Should be uncategorized');
});
