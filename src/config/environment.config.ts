export const environmentConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'psi_mammoliti',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || true,
    logging: process.env.DB_LOGGING === 'true' || false,
    ssl: process.env.DB_SSL === 'true' || false,
  },
  application: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};
