import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantRoleGuard } from '../auth/guards/tenant-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaymentStatus } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid payment data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.createPayment(
      createPaymentDto,
      req.user.id,
      req.user.organizationId
    );
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get all payments for organization' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: [PaymentResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPayments(@Request() req) {
    return this.paymentsService.getPaymentsByOrganization(req.user.organizationId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPayment(@Param('id') id: string, @Request() req) {
    return this.paymentsService.getPaymentById(
      parseInt(id),
      req.user.organizationId
    );
  }

  @Get('export/csv')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Export payments as CSV' })
  @ApiResponse({ status: 200, description: 'CSV export generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async exportPayments(@Request() req) {
    const payments = await this.paymentsService.getPaymentsByOrganization(req.user.organizationId);
    
    // Convert to CSV format
    const csvHeader = 'ID,Amount,Currency,Status,Payment Method,Transaction ID,Reference,Description,Created At,User,Organization\n';
    const csvRows = payments.map(payment => 
      `${payment.id},${payment.amount},${payment.currency},${payment.status},${payment.paymentMethod},${payment.transactionId || ''},${payment.reference},${payment.description},${payment.createdAt.toISOString()},${payment.user.firstName} ${payment.user.lastName},${payment.organization.name}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    return {
      content: csvContent,
      filename: `payments-export-${new Date().toISOString().split('T')[0]}.csv`
    };
  }

  @Post('mpesa/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle M-Pesa payment callback' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid callback data' })
  async handleMpesaCallback(@Body() callbackData: any) {
    await this.paymentsService.handleMpesaCallback(callbackData);
    return { success: true };
  }

  @Post('paypal/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle PayPal payment callback' })
  @ApiQuery({ name: 'orderId', description: 'PayPal order ID' })
  @ApiQuery({ name: 'paymentId', description: 'Internal payment ID' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid callback data' })
  async handlePaypalCallback(
    @Query('orderId') orderId: string,
    @Query('paymentId') paymentId: string
  ) {
    await this.paymentsService.handlePaypalCallback(orderId, parseInt(paymentId));
    return { success: true };
  }

  @Post('stripe/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe payment callback' })
  @ApiQuery({ name: 'paymentIntentId', description: 'Stripe payment intent ID' })
  @ApiQuery({ name: 'paymentId', description: 'Internal payment ID' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid callback data' })
  async handleStripeCallback(
    @Query('paymentIntentId') paymentIntentId: string,
    @Query('paymentId') paymentId: string
  ) {
    await this.paymentsService.handleStripeCallback(paymentIntentId, parseInt(paymentId));
    return { success: true };
  }

  @Post(':id/status')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiParam({ name: 'id', description: 'Payment ID' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: PaymentStatus; transactionId?: string; metadata?: any },
    @Request() req
  ) {
    // Verify payment belongs to organization
    await this.paymentsService.getPaymentById(parseInt(id), req.user.organizationId);
    
    await this.paymentsService.updatePaymentStatus(
      parseInt(id),
      body.status,
      body.transactionId,
      body.metadata
    );
    
    return { success: true };
  }
}
