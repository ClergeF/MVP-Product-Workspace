/**
 * Category Level Model Tool
 * Categorizes text using the Category Prediction API
 */

export const toolMetadata = {
  name: 'category_level_model',
  description: 'Categorizes text using the Category Prediction API to return category confidence scores',
  version: '1.0.0',
  inputSchema: 'tool-input.schema.json',
  outputSchema: 'tool-output.schema.json'
};

const CATEGORY_API_ENDPOINT = 'https://ClergeF-Catagorys-API.hf.space/predict';

/**
 * Process the input text and categorize it
 * @param {Object} input - The input object
 * @param {string} input.text - The text to categorize
 * @returns {Promise<Object>} The categorization result
 */
export async function execute(input) {
  const { text } = input;
  
  // Additional input validation (server already validates via JSON schema)
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Invalid input: text must be a non-empty string');
  }
  
  try {
    // Call the Category Prediction API
    const response = await fetch(CATEGORY_API_ENDPOINT, {
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
    const requiredFields = ['education', 'innovation', 'faith_spirituality', 'business', 'family_history', 'community', 'health'];
    for (const field of requiredFields) {
      if (typeof apiResult[field] !== 'number') {
        throw new Error(`Invalid API response: missing or invalid field '${field}'`);
      }
    }
    
    // Return the API response in the expected format
    return {
      result: {
        education: apiResult.education,
        innovation: apiResult.innovation,
        faith_spirituality: apiResult.faith_spirituality,
        business: apiResult.business,
        family_history: apiResult.family_history,
        community: apiResult.community,
        health: apiResult.health
      },
      metadata: {
        timestamp: new Date().toISOString(),
        tool: toolMetadata.name
      }
    };
  } catch (error) {
    throw new Error(`Failed to call Category Prediction API: ${error.message}`);
  }
}

export default { toolMetadata, execute };
