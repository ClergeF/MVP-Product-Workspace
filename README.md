# MCP AI Tools Server

A Model Context Protocol (MCP) server that hosts multiple AI tools with routing, tool loading, and JSON schema validation. This server provides a flexible framework for deploying and managing AI-powered tools through a RESTful API.

## 🌟 Features

- **Dynamic Tool Loading**: Automatically loads and registers tools from the `/tools` directory
- **JSON Schema Validation**: Validates both input and output using JSON schemas
- **RESTful API**: Simple and intuitive REST API for tool discovery and execution
- **Extensible Architecture**: Easy to add new tools by following a simple pattern
- **Production Ready**: Includes health checks, error handling, and graceful shutdown
- **Deployment Ready**: Configured for deployment on Vercel, Render, or any Node.js hosting

## 📁 Project Structure

```
.
├── server/              # Server implementation
│   ├── index.js         # Main server with routing
│   ├── tool-loader.js   # Dynamic tool loading
│   └── schema-validator.js  # JSON schema validation
├── tools/               # AI tool implementations
│   ├── action_impact_model.js
│   └── category_level_model.js
├── schemas/             # JSON schemas for validation
│   ├── tool-input.schema.json
│   └── tool-output.schema.json
├── config/              # Configuration files
│   └── server.config.js
├── tests/               # Test suite
│   ├── tool-loader.test.js
│   ├── schema-validator.test.js
│   └── tools.test.js
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MVP-Product-Workspace
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## 🛠️ Development

### Running in Development Mode

Use Node.js watch mode for automatic restarts on file changes:

```bash
npm run dev
```

### Running Tests

Execute the test suite:

```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. API Information
```
GET /
```
Returns server information and available endpoints.

**Response:**
```json
{
  "name": "MCP AI Tools Server",
  "version": "1.0.0",
  "description": "Model Context Protocol server hosting multiple AI tools",
  "endpoints": {
    "health": "GET /health",
    "listTools": "GET /tools",
    "toolInfo": "GET /tools/:toolName",
    "executeTool": "POST /tools/:toolName/execute"
  }
}
```

#### 2. Health Check
```
GET /health
```
Check server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

#### 3. List All Tools
```
GET /tools
```
Get a list of all available tools.

**Response:**
```json
{
  "count": 2,
  "tools": [
    {
      "name": "action_impact_model",
      "description": "Analyzes text to determine the potential impact of described actions",
      "version": "1.0.0"
    },
    {
      "name": "category_level_model",
      "description": "Categorizes text into hierarchical levels and identifies primary categories",
      "version": "1.0.0"
    }
  ]
}
```

#### 4. Get Tool Information
```
GET /tools/:toolName
```
Get detailed information about a specific tool.

**Example:**
```
GET /tools/action_impact_model
```

**Response:**
```json
{
  "metadata": {
    "name": "action_impact_model",
    "description": "Analyzes text to determine the potential impact of described actions",
    "version": "1.0.0",
    "inputSchema": "tool-input.schema.json",
    "outputSchema": "tool-output.schema.json"
  }
}
```

#### 5. Execute Tool
```
POST /tools/:toolName/execute
```
Execute a tool with provided input.

**Request Body:**
```json
{
  "text": "This is a critical task that needs urgent attention"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/tools/action_impact_model/execute \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a critical task"}'
```

**Response (action_impact_model):**
```json
{
  "result": {
    "impactLevel": "high",
    "score": 0.92,
    "analysis": "The text indicates a high impact action.",
    "textLength": 45
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "tool": "action_impact_model"
  }
}
```

**Response (category_level_model):**
```json
{
  "result": {
    "primaryCategory": "technology",
    "level": "single-domain",
    "categories": ["technology"],
    "categoryScores": {
      "technology": 0.43
    },
    "confidence": 0.75
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "tool": "category_level_model"
  }
}
```

## 🔧 Available Tools

### 1. Action Impact Model
**Name:** `action_impact_model`

Analyzes text to determine the potential impact of described actions.

**Input:**
```json
{
  "text": "Your text here"
}
```

**Output:**
- `impactLevel`: "high", "medium", or "low"
- `score`: Numeric score (0-1)
- `analysis`: Text description of the impact
- `textLength`: Length of input text

### 2. Category Level Model
**Name:** `category_level_model`

Categorizes text into hierarchical levels and identifies primary categories.

**Input:**
```json
{
  "text": "Your text here"
}
```

**Output:**
- `primaryCategory`: Main detected category
- `level`: "multi-domain", "cross-domain", "single-domain", or "uncategorized"
- `categories`: Array of detected categories
- `categoryScores`: Score for each category
- `confidence`: Overall confidence score (0-1)

**Categories:**
- technology
- business
- science
- education
- health

## ➕ Adding New Tools

To add a new tool to the server:

1. Create a new file in the `/tools` directory (e.g., `my_tool.js`)
2. Implement the required exports:

```javascript
/**
 * Tool metadata
 */
export const toolMetadata = {
  name: 'my_tool',
  description: 'Description of what your tool does',
  version: '1.0.0',
  inputSchema: 'tool-input.schema.json',
  outputSchema: 'tool-output.schema.json'
};

/**
 * Tool execution function
 * @param {Object} input - The input object with 'text' property
 * @returns {Promise<Object>} The result object
 */
export async function execute(input) {
  const { text } = input;
  
  // Your tool logic here
  
  return {
    result: {
      // Your result data
    },
    metadata: {
      timestamp: new Date().toISOString(),
      tool: toolMetadata.name
    }
  };
}

export default { toolMetadata, execute };
```

3. Restart the server - your tool will be automatically loaded!

### Tool Requirements

- Must export `toolMetadata` object with `name`, `description`, and `version`
- Must export `execute` async function that accepts input and returns a result
- Input must conform to `tool-input.schema.json` (requires `text` property)
- Output must conform to `tool-output.schema.json` (requires `result` object)

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment variables in Vercel dashboard if needed:
   - `PORT` (Vercel sets this automatically)
   - `NODE_ENV=production`

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`

### Deploy to Other Platforms

The server is compatible with any Node.js hosting platform. Ensure:
- Node.js 18+ is available
- The `PORT` environment variable is set (or use default 3000)
- Dependencies are installed with `npm install`
- Server starts with `npm start`

## ⚙️ Configuration

Configuration is managed in `/config/server.config.js`. You can customize:

- **Port**: Server port (default: 3000)
- **Host**: Server host (default: 0.0.0.0)
- **CORS**: Cross-Origin Resource Sharing settings
- **Rate Limiting**: API rate limiting configuration
- **Logging**: Log level settings

Environment variables:
- `PORT`: Server port
- `HOST`: Server host
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: CORS origin setting
- `RATE_LIMIT_ENABLED`: Enable rate limiting (true/false)
- `LOG_LEVEL`: Logging level (info/debug/error)

## 🧪 Testing

The project includes comprehensive tests for:
- Tool loading functionality
- Schema validation
- Individual tool execution

Run tests with:
```bash
npm test
```

## 🔒 Security

- Input validation using JSON schemas
- Error handling for all endpoints
- Graceful shutdown on SIGTERM
- CORS configuration for cross-origin requests

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Write tests for new functionality
5. Submit a pull request

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.