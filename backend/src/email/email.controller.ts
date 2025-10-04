import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Email')
@Controller('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('status')
  @ApiOperation({ summary: 'Check email service status' })
  @ApiResponse({ status: 200, description: 'Email service status' })
  async getEmailStatus() {
    const isConnected = await this.emailService.testConnection();
    return {
      success: isConnected,
      message: isConnected 
        ? 'Email service is configured and ready' 
        : 'Email service configuration issue',
      status: isConnected ? 'CONNECTED' : 'DISCONNECTED',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('test-connection')
  @ApiOperation({ summary: 'Test email service connection' })
  @ApiResponse({ status: 200, description: 'Email service connection test result' })
  async testConnection() {
    const isConnected = await this.emailService.testConnection();
    return {
      success: isConnected,
      message: isConnected 
        ? 'Email service connection successful' 
        : 'Email service connection failed',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('send-test')
  @ApiOperation({ summary: 'Send test email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', format: 'email', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject (optional)' },
        message: { type: 'string', description: 'Email message (optional)' }
      },
      required: ['to']
    }
  })
  @ApiResponse({ status: 200, description: 'Test email sent' })
  @ApiResponse({ status: 400, description: 'Invalid email address' })
  async sendTestEmail(@Body() body: { to: string; subject?: string; message?: string }) {
    const success = await this.emailService.sendTestEmail(body.to);
    return {
      success,
      message: success 
        ? 'Test email sent successfully' 
        : 'Failed to send test email',
      recipient: body.to,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('send-custom')
  @ApiOperation({ summary: 'Send custom email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', format: 'email', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject' },
        message: { type: 'string', description: 'Email message (HTML supported)' }
      },
      required: ['to', 'subject', 'message']
    }
  })
  @ApiResponse({ status: 200, description: 'Custom email sent' })
  @ApiResponse({ status: 400, description: 'Invalid email data' })
  async sendCustomEmail(@Body() body: { to: string; subject: string; message: string }) {
    const success = await this.emailService.sendEmail(body.to, body.subject, body.message);
    return {
      success,
      message: success 
        ? 'Custom email sent successfully' 
        : 'Failed to send custom email',
      recipient: body.to,
      subject: body.subject,
      timestamp: new Date().toISOString(),
    };
  }
}
