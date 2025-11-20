export const serverConfig = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  toolsPath: './tools',
  schemasPath: './schemas',
  
  // CORS settings
  cors: {
    enabled: true,
    origin: process.env.CORS_ORIGIN || '*'
  },
  
  // Rate limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true',
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export default serverConfig;
