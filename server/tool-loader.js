import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ToolLoader {
  constructor(toolsPath) {
    this.toolsPath = toolsPath;
    this.tools = new Map();
  }

  /**
   * Load all tools from the tools directory
   * @returns {Promise<void>}
   */
  async loadTools() {
    try {
      const toolsDir = join(__dirname, '..', this.toolsPath);
      const files = readdirSync(toolsDir);
      
      for (const file of files) {
        if (file.endsWith('.js')) {
          await this.loadTool(file);
        }
      }
      
      console.log(`Loaded ${this.tools.size} tools`);
    } catch (error) {
      console.error('Error loading tools:', error);
      throw error;
    }
  }

  /**
   * Load a single tool
   * @param {string} filename - Name of the tool file
   * @returns {Promise<void>}
   */
  async loadTool(filename) {
    try {
      const toolPath = join(__dirname, '..', this.toolsPath, filename);
      const toolModule = await import(toolPath);
      
      if (!toolModule.toolMetadata || !toolModule.execute) {
        console.warn(`Tool ${filename} is missing required exports (toolMetadata, execute)`);
        return;
      }

      const { toolMetadata, execute } = toolModule;
      
      this.tools.set(toolMetadata.name, {
        metadata: toolMetadata,
        execute
      });
      
      console.log(`Loaded tool: ${toolMetadata.name}`);
    } catch (error) {
      console.error(`Failed to load tool ${filename}:`, error);
    }
  }

  /**
   * Get a tool by name
   * @param {string} toolName - Name of the tool
   * @returns {Object|null} The tool object or null if not found
   */
  getTool(toolName) {
    return this.tools.get(toolName) || null;
  }

  /**
   * Get all loaded tools
   * @returns {Array} Array of tool metadata
   */
  getAllTools() {
    return Array.from(this.tools.values()).map(tool => tool.metadata);
  }

  /**
   * Check if a tool exists
   * @param {string} toolName - Name of the tool
   * @returns {boolean} True if tool exists
   */
  hasTool(toolName) {
    return this.tools.has(toolName);
  }
}

export default ToolLoader;
