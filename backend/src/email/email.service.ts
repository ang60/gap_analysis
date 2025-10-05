import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, message: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        html: message,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully to ${to}: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  async sendGapAssessmentNotification(
    to: string,
    gapAssessment: any,
    branchName: string
  ): Promise<boolean> {
    const subject = `New Gap Assessment - ${branchName}`;
    const message = `
      <h2>New Gap Assessment Identified</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Requirement:</strong> ${gapAssessment.requirement.clause}</p>
      <p><strong>Status:</strong> ${this.getStatusText(gapAssessment.status)}</p>
      <p><strong>Description:</strong> ${gapAssessment.description}</p>
      <p><strong>Risk Score:</strong> ${gapAssessment.riskScore}/3</p>
      <p><strong>Created:</strong> ${new Date(gapAssessment.createdAt).toLocaleDateString()}</p>
      <hr>
      <p>Please review and take appropriate action.</p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendActionPlanNotification(
    to: string,
    actionPlan: any,
    branchName: string
  ): Promise<boolean> {
    const subject = `New Action Plan Assigned - ${branchName}`;
    const message = `
      <h2>New Action Plan Assigned</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Action:</strong> ${actionPlan.actionText}</p>
      <p><strong>Priority:</strong> ${actionPlan.priority}</p>
      <p><strong>Deadline:</strong> ${actionPlan.deadline ? new Date(actionPlan.deadline).toLocaleDateString() : 'No deadline set'}</p>
      <p><strong>Gap Assessment:</strong> ${actionPlan.gap.requirement.clause}</p>
      <hr>
      <p>Please complete this action plan by the specified deadline.</p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendScheduleReminder(
    to: string,
    schedule: any,
    branchName: string,
    daysUntilDue: number
  ): Promise<boolean> {
    const subject = `Schedule Reminder - ${schedule.title}`;
    const message = `
      <h2>Schedule Reminder</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Schedule:</strong> ${schedule.title}</p>
      <p><strong>Description:</strong> ${schedule.description}</p>
      <p><strong>Due Date:</strong> ${new Date(schedule.dueDate).toLocaleDateString()}</p>
      <p><strong>Days Until Due:</strong> ${daysUntilDue}</p>
      <p><strong>Priority:</strong> ${schedule.priority}</p>
      <hr>
      <p>Please ensure this schedule is completed on time.</p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendOverdueNotification(
    to: string,
    item: any,
    itemType: string,
    branchName: string
  ): Promise<boolean> {
    const subject = `Overdue ${itemType} - ${branchName}`;
    const message = `
      <h2>Overdue ${itemType}</h2>
      <p><strong>Branch:</strong> ${branchName}</p>
      <p><strong>Item:</strong> ${item.title || item.actionText || item.description}</p>
      <p><strong>Due Date:</strong> ${new Date(item.deadline || item.dueDate).toLocaleDateString()}</p>
      <p><strong>Priority:</strong> ${item.priority}</p>
      <hr>
      <p style="color: red;"><strong>This item is overdue and requires immediate attention.</strong></p>
      <p><small>Gap Analysis System</small></p>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendWelcomeEmail(
    to: string,
    firstName: string,
    lastName: string,
    organizationName: string,
    branchName: string,
    loginUrl: string
  ): Promise<boolean> {
    const subject = `Welcome to Gap Analysis System - ${organizationName}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Gap Analysis System!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your account has been successfully created</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Hello ${firstName} ${lastName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Welcome to the Gap Analysis System! Your account has been successfully created and you're now part of the <strong>${organizationName}</strong> team.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Your Account Details:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Name:</strong> ${firstName} ${lastName}</li>
              <li><strong>Organization:</strong> ${organizationName}</li>
              <li><strong>Branch:</strong> ${branchName}</li>
              <li><strong>Role:</strong> Staff (will be assigned by administrator)</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Login to Your Account
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">What's Next?</h4>
            <ul style="color: #666; line-height: 1.6;">
              <li>An administrator will assign your appropriate role</li>
              <li>You'll receive access to organization-specific features</li>
              <li>You can start using the compliance management tools</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions, please contact your system administrator or support team.
          </p>
        </div>
        
        <div style="background: #f1f3f4; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">Gap Analysis System - Kenyan Banking Compliance Platform</p>
          <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendPaymentConfirmation(
    to: string,
    firstName: string,
    paymentDetails: {
      amount: number;
      currency: string;
      paymentMethod: string;
      reference: string;
      description: string;
      status: string;
    }
  ): Promise<boolean> {
    const subject = `Payment Confirmation - ${paymentDetails.reference}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Payment Confirmation</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your payment has been processed</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Hello ${firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            This email confirms that your payment has been successfully processed.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
            <table style="width: 100%; color: #666; line-height: 1.8;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                <td style="padding: 8px 0;">${paymentDetails.currency} ${paymentDetails.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0;">${paymentDetails.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Reference:</td>
                <td style="padding: 8px 0; font-family: monospace;">${paymentDetails.reference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Description:</td>
                <td style="padding: 8px 0;">${paymentDetails.description}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${paymentDetails.status}
                  </span>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2e7d32; margin-top: 0;">✅ Payment Successful</h4>
            <p style="color: #666; line-height: 1.6; margin: 0;">
              Your payment has been processed and your account has been updated accordingly.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Please keep this email as a receipt for your records. If you have any questions about this payment, 
            please contact our support team.
          </p>
        </div>
        
        <div style="background: #f1f3f4; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">Gap Analysis System - Payment Confirmation</p>
          <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    return this.sendEmail(to, subject, message);
  }

  async sendPaymentFailed(
    to: string,
    firstName: string,
    paymentDetails: {
      amount: number;
      currency: string;
      paymentMethod: string;
      reference: string;
      description: string;
      errorMessage: string;
    }
  ): Promise<boolean> {
    const subject = `Payment Failed - ${paymentDetails.reference}`;
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Payment Failed</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your payment could not be processed</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Hello ${firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            We're sorry to inform you that your payment could not be processed at this time.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
            <h3 style="color: #333; margin-top: 0;">Payment Details:</h3>
            <table style="width: 100%; color: #666; line-height: 1.8;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Amount:</td>
                <td style="padding: 8px 0;">${paymentDetails.currency} ${paymentDetails.amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0;">${paymentDetails.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Reference:</td>
                <td style="padding: 8px 0; font-family: monospace;">${paymentDetails.reference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Description:</td>
                <td style="padding: 8px 0;">${paymentDetails.description}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Error:</td>
                <td style="padding: 8px 0; color: #f44336;">${paymentDetails.errorMessage}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #c62828; margin-top: 0;">❌ Payment Failed</h4>
            <p style="color: #666; line-height: 1.6; margin: 0;">
              Please try again or contact our support team if the issue persists.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you continue to experience issues, please contact our support team for assistance.
          </p>
        </div>
        
        <div style="background: #f1f3f4; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">Gap Analysis System - Payment Notification</p>
          <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    return this.sendEmail(to, subject, message);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email service connection failed:', error);
      return false;
    }
  }

  async sendTestEmail(to: string): Promise<boolean> {
    const subject = 'Test Email - Gap Analysis System';
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Email Service Test</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Gap Analysis System Email Service</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Hello!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            This is a test email to verify that the email notification system is working correctly.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">✅ Email Service Status:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Status:</strong> Working correctly</li>
              <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
              <li><strong>System:</strong> Gap Analysis System</li>
              <li><strong>SMTP Host:</strong> ${this.configService.get('SMTP_HOST')}</li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2e7d32; margin-top: 0;">🎯 What this means:</h4>
            <ul style="color: #666; line-height: 1.6;">
              <li>Welcome emails will be sent after registration</li>
              <li>Payment notifications will work correctly</li>
              <li>System notifications are operational</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you received this email, the email configuration is working properly and you will receive notifications for account creation and other system events.
          </p>
        </div>
        
        <div style="background: #f1f3f4; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0;">Gap Analysis System - Email Service Test</p>
          <p style="margin: 5px 0 0 0;">This is an automated test message.</p>
        </div>
      </div>
    `;

    return this.sendEmail(to, subject, message);
  }

  private getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Not Implemented';
      case 1:
        return 'Partially Implemented';
      case 2:
        return 'Mostly Implemented';
      case 3:
        return 'Fully Implemented';
      default:
        return 'Unknown';
    }
  }
}
