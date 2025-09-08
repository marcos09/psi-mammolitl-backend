const { execSync } = require('child_process');
const { Client } = require('pg');
require('dotenv').config();

async function runMigrations() {
  console.log('🚀 Starting migration process...\n');

  try {
    // Step 1: Build the project
    console.log('📦 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Project built successfully\n');

    // Step 2: Check migration status
    console.log('🔍 Checking current migration status...');
    try {
      execSync('npm run typeorm -- migration:show -d ormconfig.ts', { stdio: 'inherit' });
    } catch (error) {
      console.log('ℹ️  No migrations have been run yet\n');
    }

    // Step 3: Run migrations
    console.log('🔄 Running migrations...');
    execSync('npm run migration:run', { stdio: 'inherit' });
    console.log('✅ Migrations completed successfully\n');

    // Step 4: Verify results
    console.log('🔍 Verifying migration results...');
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: 'psi_mammoliti_new',
    });

    await client.connect();

    // Check if specializations table exists and has data
    const specializationsCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'specializations'
    `);

    if (specializationsCheck.rows[0].count > 0) {
      const dataCount = await client.query('SELECT COUNT(*) FROM specializations');
      console.log(`✅ Specializations table exists with ${dataCount.rows[0].count} records`);
    } else {
      console.log('❌ Specializations table was not created');
    }

    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 All tables created:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    await client.end();
    console.log('\n🎉 Migration process completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
