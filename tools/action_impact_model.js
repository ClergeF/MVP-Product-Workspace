/**
 * Action Impact Model Tool
 * Analyzes text to determine the potential impact of described actions using the Impact Rating API
 */

export const toolMetadata = {
  name: 'action_impact_model',
  description: 'Analyzes text to determine the potential impact of described actions using the Impact Rating API',
  version: '1.0.0',
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
  
  // Additional input validation (server already validates via JSON schema)
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Invalid input: text must be a non-empty string');
  }
  
  try {
    // Call the Impact Rating API
    const response = await fetch(IMPACT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const apiResult = await response.json();
    
    // Validate API response structure
    const requiredFields = ['difficulty', 'lasting_effect', 'reach', 'effort_vs_outcome', 'impact_level'];
    for (const field of requiredFields) {
      if (typeof apiResult[field] !== 'number') {
        throw new Error(`Invalid API response: missing or invalid field '${field}'`);
      }
    }
    
    // Return the API response in the expected format
    return {
      result: {
        difficulty: apiResult.difficulty,
        lasting_effect: apiResult.lasting_effect,
        reach: apiResult.reach,
        effort_vs_outcome: apiResult.effort_vs_outcome,
        impact_level: apiResult.impact_level
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
