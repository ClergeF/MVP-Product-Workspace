/**
 * Action Impact Model Tool
 * Analyzes text to determine the impact score (0.0–1.0) using your Impact Rating API
 */

export const toolMetadata = {
  name: 'action_impact_model',
  description: 'Returns a single impact score (0.0–1.0) based on the input text.',
  version: '1.1.0',
  inputSchema: 'tool-input.schema.json',
  outputSchema: 'tool-output.schema.json'
};

const IMPACT_API_ENDPOINT = 'https://ClergeF-Impact-Rating-API.hf.space/rate';

/**
 * Process the input text and analyze action impact
 * @param {Object} input - The input object
 * @param {string} input.text - The text to analyze
 * @returns {Promise<Object>} The analysis result
 */
export async function execute(input) {
  const { text } = input;

  // Basic validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Invalid input: text must be a non-empty string');
  }

  try {
    // Call your Impact API
    const response = await fetch(IMPACT_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const apiResult = await response.json();

    // Validate new simplified response
    if (typeof apiResult.impact !== 'number') {
      throw new Error("Invalid API response: missing field 'impact'");
    }

    // Return in an MCP-friendly format
    return {
      result: {
        impact: apiResult.impact
      },
      metadata: {
        timestamp: new Date().toISOString(),
        tool: toolMetadata.name
      }
    };

  } catch (error) {
    throw new Error(`Failed to call Impact Rating API: ${error.message}`);
  }
}

export default { toolMetadata, execute };
