const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'postgres', // Connect to default postgres database first
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Check if the database exists
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'psi_mammoliti_new'"
    );

    if (dbCheck.rows.length === 0) {
      console.log('Creating database psi_mammoliti_new...');
      await client.query('CREATE DATABASE psi_mammoliti_new');
      console.log('Database created successfully');
    } else {
      console.log('Database psi_mammoliti_new already exists');
    }

    // Test connection to the new database
    await client.end();
    
    const testClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: 'psi_mammoliti_new',
    });

    await testClient.connect();
    console.log('Successfully connected to psi_mammoliti_new database');
    await testClient.end();

  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
