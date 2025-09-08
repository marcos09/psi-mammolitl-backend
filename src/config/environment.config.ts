export const environmentConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'psi_mammoliti_new',
    synchronize: false, // Disable automatic synchronization - use migrations only
    logging: process.env.DB_LOGGING === 'true' || process.env.DB_LOGGING === undefined,
    ssl: process.env.DB_SSL === 'true',
  },
  application: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};

// Alternative configuration using ConfigService (recommended for larger apps)
export const getEnvironmentConfig = () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'psi_mammoliti_new',
    synchronize: false, // Disable automatic synchronization - use migrations only
    logging: process.env.DB_LOGGING === 'true' || process.env.DB_LOGGING === undefined,
    ssl: process.env.DB_SSL === 'true',
  },
  application: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
});
