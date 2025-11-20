/**
 * Category Level Model Tool
 * Categorizes text into hierarchical levels and identifies categories
 */

export const toolMetadata = {
  name: 'category_level_model',
  description: 'Categorizes text into hierarchical levels and identifies primary categories',
  version: '1.0.0',
  inputSchema: 'tool-input.schema.json',
  outputSchema: 'tool-output.schema.json'
};

/**
 * Process the input text and categorize it
 * @param {Object} input - The input object
 * @param {string} input.text - The text to categorize
 * @returns {Promise<Object>} The categorization result
 */
export async function execute(input) {
  const { text } = input;
  
  // NOTE: This is a simplified example tool for demonstration purposes.
  // In a production implementation, replace this with actual ML model inference.
  
  // Simple keyword-based categorization
  const categories = {
    technology: ['software', 'hardware', 'computer', 'code', 'program', 'api', 'data'],
    business: ['company', 'market', 'customer', 'sales', 'revenue', 'strategy'],
    science: ['research', 'study', 'experiment', 'theory', 'hypothesis', 'analysis'],
    education: ['learn', 'teach', 'student', 'school', 'university', 'course'],
    health: ['medical', 'health', 'patient', 'doctor', 'treatment', 'disease']
  };
  
  const textLower = text.toLowerCase();
  const detectedCategories = [];
  const categoryScores = {};
  
  // Detect categories based on keywords
  for (const [category, keywords] of Object.entries(categories)) {
    const matches = keywords.filter(keyword => textLower.includes(keyword));
    if (matches.length > 0) {
      const score = matches.length / keywords.length;
      categoryScores[category] = parseFloat(score.toFixed(2));
      detectedCategories.push(category);
    }
  }
  
  // Determine primary category based on highest score
  const primaryCategory = Object.keys(categoryScores).length > 0
    ? Object.keys(categoryScores).reduce((a, b) => 
        categoryScores[a] > categoryScores[b] ? a : b
      )
    : 'general';
  
  const level = detectedCategories.length >= 3 ? 'multi-domain' :
                detectedCategories.length === 2 ? 'cross-domain' :
                detectedCategories.length === 1 ? 'single-domain' : 'uncategorized';
  
  return {
    result: {
      primaryCategory,
      level,
      categories: detectedCategories,
      categoryScores,
      confidence: detectedCategories.length > 0 ? 0.75 : 0.25
    },
    metadata: {
      timestamp: new Date().toISOString(),
      tool: toolMetadata.name
    }
  };
}

export default { toolMetadata, execute };
