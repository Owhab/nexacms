import nodemailer from 'nodemailer'

// Validate SMTP configuration
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP credentials not configured. Email functionality will not work.')
    console.warn('   Please set SMTP_USER and SMTP_PASS in your .env file')
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    // Add debugging for development
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
})

export interface InvitationEmailData {
    email: string
    inviterName: string
    inviterEmail: string
    role: string
    invitationToken: string
    expiresAt: Date
}

export async function sendInvitationEmail(data: InvitationEmailData): Promise<boolean> {
    try {
        // Debug environment variables
        console.log('🔍 Email service debug info:');
        console.log('SMTP_HOST:', process.env.SMTP_HOST);
        console.log('SMTP_PORT:', process.env.SMTP_PORT);
        console.log('SMTP_USER:', process.env.SMTP_USER);
        console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***configured***' : 'NOT SET');
        console.log('SMTP_FROM:', process.env.SMTP_FROM);

        // Check if credentials are available
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error('❌ SMTP credentials missing in sendInvitationEmail');
            return false;
        }

        const invitationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/invite/${data.invitationToken}`

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>You're invited to join NexaCMS</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .role-badge { background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 You're Invited!</h1>
                    <p>Join our NexaCMS team</p>
                </div>
                <div class="content">
                    <p>Hi there!</p>
                    
                    <p><strong>${data.inviterName}</strong> (${data.inviterEmail}) has invited you to join the NexaCMS team as a <span class="role-badge">${data.role}</span>.</p>
                    
                    <p>NexaCMS is a powerful content management system that makes it easy to create and manage websites. You'll have access to:</p>
                    
                    <ul>
                        <li>📝 Page and content management</li>
                        <li>🎨 Design and layout tools</li>
                        <li>📱 Media library and uploads</li>
                        <li>⚙️ Site configuration options</li>
                        ${data.role === 'ADMIN' ? '<li>👥 User management (Admin access)</li>' : ''}
                    </ul>
                    
                    <p>To accept this invitation and set up your account, click the button below:</p>
                    
                    <div style="text-align: center;">
                        <a href="${invitationUrl}" class="button">Accept Invitation</a>
                    </div>
                    
                    <p><small>This invitation will expire on ${data.expiresAt.toLocaleDateString()} at ${data.expiresAt.toLocaleTimeString()}.</small></p>
                    
                    <p>If you can't click the button, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace;">${invitationUrl}</p>
                </div>
                <div class="footer">
                    <p>This invitation was sent by ${data.inviterName} from NexaCMS</p>
                    <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        `

        const textContent = `
        You're invited to join NexaCMS!
        
        ${data.inviterName} (${data.inviterEmail}) has invited you to join the NexaCMS team as a ${data.role}.
        
        To accept this invitation, visit: ${invitationUrl}
        
        This invitation expires on ${data.expiresAt.toLocaleDateString()} at ${data.expiresAt.toLocaleTimeString()}.
        
        If you didn't expect this invitation, you can safely ignore this email.
        `

        await transporter.sendMail({
            from: `"NexaCMS" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: data.email,
            subject: `You're invited to join NexaCMS as ${data.role}`,
            text: textContent,
            html: htmlContent
        })

        return true
    } catch (error) {
        console.error('Failed to send invitation email:', error)
        return false
    }
}

export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to NexaCMS</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to NexaCMS!</h1>
                    <p>Your account is now active</p>
                </div>
                <div class="content">
                    <p>Hi ${userName}!</p>
                    
                    <p>Welcome to NexaCMS! Your account has been successfully created and you now have access to our content management system.</p>
                    
                    <p>You can now:</p>
                    <ul>
                        <li>📝 Create and manage pages</li>
                        <li>🎨 Customize your site design</li>
                        <li>📱 Upload and manage media</li>
                        <li>⚙️ Configure site settings</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login" class="button">Login to NexaCMS</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Thank you for joining NexaCMS!</p>
                </div>
            </div>
        </body>
        </html>
        `

        await transporter.sendMail({
            from: `"NexaCMS" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: userEmail,
            subject: 'Welcome to NexaCMS!',
            html: htmlContent
        })

        return true
    } catch (error) {
        console.error('Failed to send welcome email:', error)
        return false
    }
}