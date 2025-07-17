const nodemailer = require('nodemailer');

async function testEmailConfig() {
    console.log('Testing email configuration...\n');

    // Check environment variables
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ Missing environment variables:');
        missingVars.forEach(varName => console.error(`   - ${varName}`));
        console.log('\nPlease add these to your .env file\n');
        return;
    }

    console.log('✅ All required environment variables are set');
    console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`🔌 SMTP Port: ${process.env.SMTP_PORT}`);
    console.log(`👤 SMTP User: ${process.env.SMTP_USER}`);
    console.log(`📤 SMTP From: ${process.env.SMTP_FROM || process.env.SMTP_USER}\n`);

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // Verify connection
        console.log('🔍 Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!\n');

        // Send test email
        console.log('📨 Sending test email...');
        const info = await transporter.sendMail({
            from: `"NexaCMS Test" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'NexaCMS Email Test',
            text: 'This is a test email from NexaCMS. If you receive this, your email configuration is working correctly!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4CAF50;">✅ Email Configuration Test Successful!</h2>
                    <p>Congratulations! Your NexaCMS email configuration is working correctly.</p>
                    <p><strong>Configuration Details:</strong></p>
                    <ul>
                        <li>SMTP Host: ${process.env.SMTP_HOST}</li>
                        <li>SMTP Port: ${process.env.SMTP_PORT}</li>
                        <li>SMTP User: ${process.env.SMTP_USER}</li>
                    </ul>
                    <p>You can now send user invitations from your NexaCMS admin panel.</p>
                </div>
            `
        });

        console.log('✅ Test email sent successfully!');
        console.log(`📧 Message ID: ${info.messageId}`);
        console.log('\n🎉 Email configuration is working correctly!');

    } catch (error) {
        console.error('❌ Email configuration test failed:');
        console.error(error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Please check:');
            console.log('   - Your email address and password are correct');
            console.log('   - For Gmail: Use an App Password, not your regular password');
            console.log('   - For other providers: Check if you need to enable "Less secure apps"');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n💡 Connection failed. Please check:');
            console.log('   - SMTP host and port are correct');
            console.log('   - Your internet connection is working');
            console.log('   - Firewall is not blocking the connection');
        }
    }
}

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
testEmailConfig().catch(console.error);