import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, FRONTEND_URL } from '../config/config';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Ashish Jaiswal Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Ashish Jaiswal Portfolio!</h2>
          <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Verify Email
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated email from Ashish Jaiswal Portfolio.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Ashish Jaiswal Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated email from Ashish Jaiswal Portfolio.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordChangedEmail(email: string): Promise<void> {
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Password Changed - Ashish Jaiswal Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Changed Successfully</h2>
          <p>Your account password has been changed successfully.</p>
          <p>If you didn't make this change, please contact support immediately.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated email from Ashish Jaiswal Portfolio.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password changed notification sent to ${email}`);
    } catch (error) {
      console.error('Error sending password changed email:', error);
      // Don't throw error for notification emails
    }
  }
}

export default new EmailService(); 