/**
 * Category Level Model Tool
 * Returns 12 category confidence scores (0.0–1.0) for the given text
 */

export const toolMetadata = {
  name: 'category_level_model',
  description: 'Predicts 12 category confidence levels for input text using the Category API.',
  version: '2.0.0',
  inputSchema: 'tool-input.schema.json',
  outputSchema: 'tool-output.schema.json'
};

const CATEGORY_API_ENDPOINT = 'https://ClergeF-Catagorys-API.hf.space/predict';

/**
 * Process the input text and categorize it
 * @param {Object} input
 * @param {string} input.text - The text to analyze
 * @returns {Promise<Object>} The categorization result
 */
export async function execute(input) {
  const { text } = input;

  // Validate input
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Invalid input: text must be a non-empty string');
  }

  try {
    // Call Category API
    const response = await fetch(CATEGORY_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const apiResult = await response.json();

    // These 12 fields MUST exist in the API response
    const requiredFields = [
      'family',
      'community',
      'education',
      'health',
      'environment',
      'business',
      'finance',
      'history',
      'spirituality',
      'innovation'
    ];

    for (const field of requiredFields) {
      if (typeof apiResult[field] !== 'number') {
        throw new Error(`Invalid API response: missing or invalid field '${field}'`);
      }
    }

    // Return the category values
    return {
      result: {
        family: apiResult.family,
        community: apiResult.community,
        education: apiResult.education,
        health: apiResult.health,
        environment: apiResult.environment,
        business: apiResult.business,
        finance: apiResult.finance,
        history: apiResult.history,
        spirituality: apiResult.spirituality,
        innovation: apiResult.innovation
      },
      metadata: {
        timestamp: new Date().toISOString(),
        tool: toolMetadata.name
      }
    };

  } catch (error) {
    throw new Error(`Failed to call Category API: ${error.message}`);
  }
}

export default { toolMetadata, execute };
