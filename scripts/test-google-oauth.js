const { OAuth2Client } = require('google-auth-library');

// Load environment variables from .env file manually
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');

        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (error) {
        console.log('No .env file found or error reading it');
    }
}

loadEnvFile();

async function testGoogleOAuth() {
    console.log('🔍 Testing Google OAuth Configuration...\n');

    // Check environment variables
    const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing environment variables:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        return;
    }

    console.log('✅ All required environment variables are set');
    console.log(`🔑 Client ID: ${process.env.GOOGLE_CLIENT_ID}`);
    console.log(`🔐 Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '***configured***' : 'NOT SET'}`);
    console.log(`🔗 Redirect URI: ${process.env.GOOGLE_REDIRECT_URI}\n`);

    try {
        // Create OAuth2 client
        const client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        // Generate auth URL
        const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ],
            include_granted_scopes: true
        });

        console.log('✅ Google OAuth URL generated successfully!');
        console.log('🔗 Auth URL:', authUrl);
        console.log('\n📋 Next steps:');
        console.log('1. Make sure this redirect URI is added to your Google Cloud Console:');
        console.log(`   ${process.env.GOOGLE_REDIRECT_URI}`);
        console.log('2. Test the login by visiting: http://localhost:3000/login');

    } catch (error) {
        console.error('❌ Google OAuth configuration test failed:');
        console.error(error.message);

        if (error.message.includes('redirect_uri')) {
            console.log('\n💡 Redirect URI issue. Please check:');
            console.log('   - The redirect URI in your Google Cloud Console matches exactly');
            console.log('   - No trailing slashes or extra characters');
            console.log('   - The URI is properly saved in Google Cloud Console');
        }
    }
}

testGoogleOAuth().catch(console.error);