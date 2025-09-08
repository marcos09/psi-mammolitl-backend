const { execSync } = require('child_process');
const { Client } = require('pg');
require('dotenv').config();

async function testMigrations() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: 'psi_mammoliti_new',
  });

  try {
    console.log('🔍 Testing database connection...');
    await client.connect();
    console.log('✅ Connected to psi_mammoliti_new database');

    // Check if migrations table exists
    console.log('🔍 Checking migrations table...');
    const migrationsTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
      );
    `);
    
    if (migrationsTable.rows[0].exists) {
      console.log('✅ Migrations table exists');
      
      // Check what migrations have been run
      const migrations = await client.query('SELECT * FROM migrations ORDER BY timestamp');
      console.log('📋 Applied migrations:');
      migrations.rows.forEach(row => {
        console.log(`  - ${row.timestamp}: ${row.name}`);
      });
    } else {
      console.log('❌ Migrations table does not exist - no migrations have been run');
    }

    // Check if specializations table exists
    console.log('🔍 Checking specializations table...');
    const specializationsTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'specializations'
      );
    `);
    
    if (specializationsTable.rows[0].exists) {
      console.log('✅ Specializations table exists');
      
      // Check table structure
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'specializations' 
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Specializations table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      
      // Check if there's data
      const count = await client.query('SELECT COUNT(*) FROM specializations');
      console.log(`📊 Specializations table has ${count.rows[0].count} records`);
      
    } else {
      console.log('❌ Specializations table does not exist');
    }

    // List all tables
    console.log('🔍 All tables in database:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length > 0) {
      tables.rows.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('  No tables found');
    }

  } catch (error) {
    console.error('❌ Error testing database:', error.message);
  } finally {
    await client.end();
  }
}

testMigrations();
