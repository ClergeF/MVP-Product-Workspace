import { test } from 'node:test';
import assert from 'node:assert';
import { execute as executeActionImpact } from '../tools/action_impact_model.js';
import { execute as executeCategoryLevel } from '../tools/category_level_model.js';

// Note: These tests require network access to the external APIs
// They will be skipped in environments without internet access

test('action_impact_model - execute with text', async (t) => {
  const input = { text: 'This is a critical task that needs urgent attention' };
  
  try {
    const result = await executeActionImpact(input);
    
    assert.ok(result.result, 'Should have result');
    assert.ok(typeof result.result.difficulty === 'number', 'Should have numeric difficulty');
    assert.ok(typeof result.result.lasting_effect === 'number', 'Should have numeric lasting_effect');
    assert.ok(typeof result.result.reach === 'number', 'Should have numeric reach');
    assert.ok(typeof result.result.effort_vs_outcome === 'number', 'Should have numeric effort_vs_outcome');
    assert.ok(typeof result.result.impact_level === 'number', 'Should have numeric impact_level');
    assert.ok(result.metadata, 'Should have metadata');
    assert.strictEqual(result.metadata.tool, 'action_impact_model');
  } catch (error) {
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      t.skip('Skipping test - API not accessible (network restricted environment)');
    } else {
      throw error;
    }
  }
});

test('action_impact_model - returns valid numeric metrics', async (t) => {
  const input = { text: 'This is a critical and urgent matter' };
  
  try {
    const result = await executeActionImpact(input);
    
    // Verify all expected fields are present and numeric
    assert.ok(result.result.difficulty !== undefined, 'Should have difficulty metric');
    assert.ok(result.result.lasting_effect !== undefined, 'Should have lasting_effect metric');
    assert.ok(result.result.reach !== undefined, 'Should have reach metric');
    assert.ok(result.result.effort_vs_outcome !== undefined, 'Should have effort_vs_outcome metric');
    assert.ok(result.result.impact_level !== undefined, 'Should have impact_level metric');
  } catch (error) {
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      t.skip('Skipping test - API not accessible (network restricted environment)');
    } else {
      throw error;
    }
  }
});

test('category_level_model - execute with text', async (t) => {
  const input = { text: 'This software program uses advanced data processing' };
  
  try {
    const result = await executeCategoryLevel(input);
    
    assert.ok(result.result, 'Should have result');
    assert.ok(typeof result.result.education === 'number', 'Should have numeric education score');
    assert.ok(typeof result.result.innovation === 'number', 'Should have numeric innovation score');
    assert.ok(typeof result.result.faith_spirituality === 'number', 'Should have numeric faith_spirituality score');
    assert.ok(typeof result.result.business === 'number', 'Should have numeric business score');
    assert.ok(typeof result.result.family_history === 'number', 'Should have numeric family_history score');
    assert.ok(typeof result.result.community === 'number', 'Should have numeric community score');
    assert.ok(typeof result.result.health === 'number', 'Should have numeric health score');
    assert.ok(result.metadata, 'Should have metadata');
    assert.strictEqual(result.metadata.tool, 'category_level_model');
  } catch (error) {
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      t.skip('Skipping test - API not accessible (network restricted environment)');
    } else {
      throw error;
    }
  }
});

test('category_level_model - returns all category scores', async (t) => {
  const input = { text: 'Building software with code and API' };
  
  try {
    const result = await executeCategoryLevel(input);
    
    // Verify all expected category fields are present
    assert.ok(result.result.education !== undefined, 'Should have education score');
    assert.ok(result.result.innovation !== undefined, 'Should have innovation score');
    assert.ok(result.result.faith_spirituality !== undefined, 'Should have faith_spirituality score');
    assert.ok(result.result.business !== undefined, 'Should have business score');
    assert.ok(result.result.family_history !== undefined, 'Should have family_history score');
    assert.ok(result.result.community !== undefined, 'Should have community score');
    assert.ok(result.result.health !== undefined, 'Should have health score');
  } catch (error) {
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      t.skip('Skipping test - API not accessible (network restricted environment)');
    } else {
      throw error;
    }
  }
});
