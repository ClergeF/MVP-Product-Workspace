import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SchemaValidator {
  constructor(schemasPath) {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    this.schemasPath = schemasPath;
    this.schemas = {};
  }

  /**
   * Load a JSON schema from file
   * @param {string} schemaName - Name of the schema file
   * @returns {Object} The loaded schema
   */
  loadSchema(schemaName) {
    if (this.schemas[schemaName]) {
      return this.schemas[schemaName];
    }

    try {
      const schemaPath = join(__dirname, '..', this.schemasPath, schemaName);
      const schemaContent = readFileSync(schemaPath, 'utf-8');
      const schema = JSON.parse(schemaContent);
      
      this.ajv.addSchema(schema, schemaName);
      this.schemas[schemaName] = schema;
      
      return schema;
    } catch (error) {
      throw new Error(`Failed to load schema ${schemaName}: ${error.message}`);
    }
  }

  /**
   * Validate data against a schema
   * @param {string} schemaName - Name of the schema to validate against
   * @param {*} data - Data to validate
   * @returns {Object} Validation result with success flag and errors
   */
  validate(schemaName, data) {
    if (!this.schemas[schemaName]) {
      this.loadSchema(schemaName);
    }

    const validate = this.ajv.getSchema(schemaName);
    const valid = validate(data);

    return {
      valid,
      errors: validate.errors || []
    };
  }

  /**
   * Get formatted error message from validation errors
   * @param {Array} errors - Array of validation errors
   * @returns {string} Formatted error message
   */
  getErrorMessage(errors) {
    if (!errors || errors.length === 0) {
      return '';
    }

    return errors
      .map(err => `${err.instancePath || 'root'} ${err.message}`)
      .join(', ');
  }
}

export default SchemaValidator;
