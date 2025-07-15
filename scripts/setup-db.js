const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up NexaCMS Database...\n');

// Check if .env exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from .env.example...');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created');
    } else {
        console.log('❌ .env.example not found');
        process.exit(1);
    }
}

// Read current .env
const envContent = fs.readFileSync(envPath, 'utf8');

// Check if DATABASE_URL is still the default
if (envContent.includes('postgresql://postgres:password@localhost:5432/nexacms')) {
    console.log('\n⚠️  Database URL needs to be configured!');
    console.log('\nOptions:');
    console.log('1. Use Docker PostgreSQL (recommended for development):');
    console.log('   docker run --name nexacms-postgres \\');
    console.log('     -e POSTGRES_DB=nexacms \\');
    console.log('     -e POSTGRES_USER=postgres \\');
    console.log('     -e POSTGRES_PASSWORD=password \\');
    console.log('     -p 5432:5432 -d postgres:15');
    console.log('\n   Then update .env with:');
    console.log('   DATABASE_URL="postgresql://nexacms_user:secure_password@localhost:5432/nexacms"');
    console.log('\n2. Use a cloud database service like Supabase, Railway, or Neon');
    console.log('\n3. Install PostgreSQL locally');
    console.log('\nAfter setting up the database, run: npm run db:setup');
    process.exit(0);
}

try {
    console.log('🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    console.log('\n🔄 Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    console.log('\n✅ Database setup complete!');
    console.log('\n🎉 You can now run: npm run dev');

} catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.log('\nPlease check your DATABASE_URL in .env file');
    process.exit(1);
}