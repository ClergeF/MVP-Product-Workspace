import express from 'express';
import { serverConfig } from '../config/server.config.js';
import ToolLoader from './tool-loader.js';
import SchemaValidator from './schema-validator.js';

const app = express();

// Middleware
app.use(express.json());

// CORS middleware
if (serverConfig.cors.enabled) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', serverConfig.cors.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
}

// Initialize tool loader and schema validator
const toolLoader = new ToolLoader(serverConfig.toolsPath);
const schemaValidator = new SchemaValidator(serverConfig.schemasPath);

// Load tools on startup
await toolLoader.loadTools();

// Load schemas
schemaValidator.loadSchema('tool-input.schema.json');
schemaValidator.loadSchema('tool-output.schema.json');

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * List all available tools
 */
app.get('/tools', (req, res) => {
  const tools = toolLoader.getAllTools();
  res.json({
    count: tools.length,
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      version: tool.version
    }))
  });
});

/**
 * Get specific tool information
 */
app.get('/tools/:toolName', (req, res) => {
  const { toolName } = req.params;
  const tool = toolLoader.getTool(toolName);
  
  if (!tool) {
    return res.status(404).json({
      error: 'Tool not found',
      toolName
    });
  }
  
  res.json({
    metadata: tool.metadata
  });
});

/**
 * Execute a tool
 */
app.post('/tools/:toolName/execute', async (req, res) => {
  const { toolName } = req.params;
  const input = req.body;
  
  // Check if tool exists
  const tool = toolLoader.getTool(toolName);
  if (!tool) {
    return res.status(404).json({
      error: 'Tool not found',
      toolName
    });
  }
  
  // Validate input
  const inputValidation = schemaValidator.validate('tool-input.schema.json', input);
  if (!inputValidation.valid) {
    return res.status(400).json({
      error: 'Invalid input',
      details: schemaValidator.getErrorMessage(inputValidation.errors)
    });
  }
  
  try {
    // Execute tool
    const result = await tool.execute(input);
    
    // Validate output
    const outputValidation = schemaValidator.validate('tool-output.schema.json', result);
    if (!outputValidation.valid) {
      console.error('Tool output validation failed:', outputValidation.errors);
      return res.status(500).json({
        error: 'Tool produced invalid output',
        details: schemaValidator.getErrorMessage(outputValidation.errors)
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);
    res.status(500).json({
      error: 'Tool execution failed',
      message: error.message
    });
  }
});

/**
 * Root endpoint - API information
 */
app.get('/', (req, res) => {
  res.json({
    name: 'MCP AI Tools Server',
    version: '1.0.0',
    description: 'Model Context Protocol server hosting multiple AI tools',
    endpoints: {
      health: 'GET /health',
      listTools: 'GET /tools',
      toolInfo: 'GET /tools/:toolName',
      executeTool: 'POST /tools/:toolName/execute'
    },
    documentation: 'See README.md for full documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
const server = app.listen(serverConfig.port, serverConfig.host, () => {
  console.log(`MCP AI Tools Server listening on ${serverConfig.host}:${serverConfig.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
