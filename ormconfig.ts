import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'psi_mammoliti_new',
  // Don't load entities for migrations - they're not needed
  entities: [],
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  synchronize: false, // Disable automatic synchronization - use migrations only
  logging: process.env.DB_LOGGING === 'true' || true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export default dataSource;
