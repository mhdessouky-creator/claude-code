import fs from 'fs/promises';
import path from 'path';

/**
 * Simple build script for the AI Agent
 */
async function build() {
  console.log('🔨 Building AI Agent...\n');

  try {
    // Create necessary directories
    const dirs = ['data', 'logs', 'backups'];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      } catch (error) {
        console.log(`ℹ️  Directory already exists: ${dir}`);
      }
    }

    // Check for .env file
    try {
      await fs.access('.env');
      console.log('✅ .env file exists');
    } catch {
      console.log('⚠️  .env file not found - copying from .env.example');
      try {
        await fs.copyFile('.env.example', '.env');
        console.log('✅ Created .env from template');
      } catch (error) {
        console.log('❌ Failed to create .env file');
      }
    }

    // Validate package.json
    const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
    console.log(`✅ Package validated: ${packageJson.name}@${packageJson.version}`);

    console.log('\n✨ Build completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Configure your .env file with API keys');
    console.log('2. Run: npm start (for example mode)');
    console.log('3. Run: npm run cli chat (for interactive mode)\n');

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
