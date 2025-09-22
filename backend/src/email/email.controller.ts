import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('email')
@Controller('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  @ApiOperation({ summary: 'Test email service connection' })
  @ApiResponse({ status: 200, description: 'Email service connection test result' })
  async testConnection() {
    const isConnected = await this.emailService.testConnection();
    return {
      success: isConnected,
      message: isConnected 
        ? 'Email service connection successful' 
        : 'Email service connection failed',
    };
  }

  @Post('send-test')
  @ApiOperation({ summary: 'Send test email' })
  @ApiResponse({ status: 200, description: 'Test email sent' })
  async sendTestEmail(@Body() body: { to: string }) {
    const success = await this.emailService.sendTestEmail(body.to);
    return {
      success,
      message: success 
        ? 'Test email sent successfully' 
        : 'Failed to send test email',
    };
  }
}
