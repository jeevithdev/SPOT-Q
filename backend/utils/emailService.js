const nodemailer = require('nodemailer');

// Lazy-created transporter (supports Ethereal in dev if no creds provided)
let transporterPromise = null;

const getEmailTransporter = async () => {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    const hasCreds = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    const isProduction = process.env.NODE_ENV === 'production';

    if (hasCreds) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    }

    // No creds: use Ethereal for dev/testing
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  })();

  return transporterPromise;
};

// Email templates
const emailTemplates = {
  otpVerification: (name, otp) => ({
    subject: 'Verify Your Account - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Account Verification</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to our platform!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for registering with us. To complete your account setup, please verify your email address using the OTP code below:
          </p>
          
          <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h3 style="color: #667eea; margin: 0; font-size: 32px; letter-spacing: 5px; font-family: monospace;">${otp}</h3>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            <strong>Important:</strong>
          </p>
          <ul style="color: #666; line-height: 1.6;">
            <li>This OTP is valid for <strong>10 minutes</strong></li>
            <li>Do not share this code with anyone</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              If you're having trouble, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      Account Verification - OTP Code
      
      Hello ${name}!
      
      Thank you for registering with us. To complete your account setup, please verify your email address using the OTP code below:
      
      OTP Code: ${otp}
      
      Important:
      - This OTP is valid for 10 minutes
      - Do not share this code with anyone
      - If you didn't request this, please ignore this email
      
      If you're having trouble, please contact our support team.
    `
  }),

  passwordReset: (name, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            You requested a password reset for your account. Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            <strong>Important:</strong>
          </p>
          <ul style="color: #666; line-height: 1.6;">
            <li>This link is valid for <strong>1 hour</strong></li>
            <li>If you didn't request this, please ignore this email</li>
            <li>For security, this link will expire after use</li>
          </ul>
        </div>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hello ${name}!
      
      You requested a password reset for your account. Use the following link to reset your password:
      
      Reset Link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}
      
      Important:
      - This link is valid for 1 hour
      - If you didn't request this, please ignore this email
      - For security, this link will expire after use
    `
  })
};

// Send OTP verification email
const sendOtpEmail = async (email, name, otp) => {
  try {
    const transporter = await getEmailTransporter();
    const template = emailTemplates.otpVerification(name, otp);
    
    const mailOptions = {
      from: `"Secure Login System" <${process.env.EMAIL_USER || 'noreply@example.com'}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}:`, result.messageId);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(result)) {
      console.log('🧪 Preview URL:', nodemailer.getTestMessageUrl(result));
    }
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = await getEmailTransporter();
    const template = emailTemplates.passwordReset(name, resetToken);
    
    const mailOptions = {
      from: `"Secure Login System" <${process.env.EMAIL_USER || 'noreply@example.com'}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}:`, result.messageId);
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(result)) {
      console.log('🧪 Preview URL:', nodemailer.getTestMessageUrl(result));
    }
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConnection = async () => {
  try {
    const transporter = await getEmailTransporter();
    if (transporter.verify) {
      await transporter.verify();
    }
    console.log('✅ Email service is ready (dev transport if no creds)');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  testEmailConnection
};
