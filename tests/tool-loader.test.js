import { test } from 'node:test';
import assert from 'node:assert';
import ToolLoader from '../server/tool-loader.js';

test('ToolLoader - load tools', async () => {
  const toolLoader = new ToolLoader('./tools');
  await toolLoader.loadTools();
  
  assert.ok(toolLoader.tools.size > 0, 'Should load at least one tool');
});

test('ToolLoader - get tool by name', async () => {
  const toolLoader = new ToolLoader('./tools');
  await toolLoader.loadTools();
  
  const tool = toolLoader.getTool('action_impact_model');
  assert.ok(tool, 'Should find action_impact_model tool');
  assert.strictEqual(tool.metadata.name, 'action_impact_model');
});

test('ToolLoader - get all tools', async () => {
  const toolLoader = new ToolLoader('./tools');
  await toolLoader.loadTools();
  
  const tools = toolLoader.getAllTools();
  assert.ok(Array.isArray(tools), 'Should return an array');
  assert.ok(tools.length >= 2, 'Should have at least 2 tools');
});

test('ToolLoader - has tool', async () => {
  const toolLoader = new ToolLoader('./tools');
  await toolLoader.loadTools();
  
  assert.ok(toolLoader.hasTool('action_impact_model'), 'Should have action_impact_model');
  assert.ok(toolLoader.hasTool('category_level_model'), 'Should have category_level_model');
  assert.strictEqual(toolLoader.hasTool('nonexistent_tool'), false, 'Should not have nonexistent tool');
});
