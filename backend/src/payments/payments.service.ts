import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto, PaymentInitiationResponseDto } from './dto/payment-response.dto';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { MpesaService } from './gateways/mpesa.service';
import { PaypalService } from './gateways/paypal.service';
import { StripeService } from './gateways/stripe.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private mpesaService: MpesaService,
    private paypalService: PaypalService,
    private stripeService: StripeService,
    private emailService: EmailService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto, userId: number, organizationId: number): Promise<PaymentInitiationResponseDto> {
    try {
      // Validate payment method specific requirements
      this.validatePaymentMethodRequirements(createPaymentDto);

      // Create payment record
      const payment = await this.prisma.payment.create({
        data: {
          amount: createPaymentDto.amount,
          currency: createPaymentDto.currency || 'KES',
          paymentMethod: createPaymentDto.paymentMethod,
          description: createPaymentDto.description,
          reference: this.generateReference(),
          metadata: createPaymentDto.metadata || {},
          userId,
          organizationId,
          status: PaymentStatus.PENDING,
        },
      });

      this.logger.log(`Payment created: ${payment.id} - ${payment.reference}`);

      // Process payment based on method
      const result = await this.processPayment(payment, createPaymentDto);

      // Send payment notification email
      await this.sendPaymentNotification(payment, result);

      return {
        success: true,
        message: 'Payment initiated successfully',
        paymentId: payment.id,
        reference: payment.reference,
        ...result,
      };
    } catch (error) {
      this.logger.error('Payment creation failed:', error);
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  async getPaymentsByOrganization(organizationId: number): Promise<PaymentResponseDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: { organizationId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        organization: {
          select: { name: true }
        },
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(payment => ({
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || undefined,
      reference: payment.reference,
      description: payment.description,
      metadata: payment.metadata,
      processedAt: payment.processedAt || undefined,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: payment.user,
      organization: payment.organization,
    }));
  }

  async getPaymentById(paymentId: number, organizationId: number): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, organizationId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        organization: {
          select: { name: true }
        },
        subscription: true,
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return {
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || undefined,
      reference: payment.reference,
      description: payment.description,
      metadata: payment.metadata,
      processedAt: payment.processedAt || undefined,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: payment.user,
      organization: payment.organization,
    };
  }

  async updatePaymentStatus(paymentId: number, status: PaymentStatus, transactionId?: string, metadata?: any): Promise<void> {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        transactionId,
        metadata: metadata ? { ...metadata } : undefined,
        processedAt: status === PaymentStatus.COMPLETED ? new Date() : undefined,
      },
    });

    this.logger.log(`Payment ${paymentId} status updated to ${status}`);
  }

  async handleMpesaCallback(callbackData: any): Promise<void> {
    try {
      const result = await this.mpesaService.handleCallback(callbackData);
      
      if (result.success) {
        // Find payment by checkout request ID or merchant request ID
        const payment = await this.prisma.payment.findFirst({
          where: {
            OR: [
              { metadata: { path: ['checkoutRequestId'], equals: result.checkoutRequestId } },
              { metadata: { path: ['merchantRequestId'], equals: result.merchantRequestId } },
            ],
          },
        });

        if (payment) {
          await this.updatePaymentStatus(
            payment.id,
            PaymentStatus.COMPLETED,
            result.transactionId,
            {
              ...(payment.metadata as Record<string, any>),
              mpesaResponse: result,
            }
          );
        }
      }
    } catch (error) {
      this.logger.error('M-Pesa callback handling failed:', error);
    }
  }

  async handlePaypalCallback(orderId: string, paymentId: number): Promise<void> {
    try {
      const result = await this.paypalService.captureOrder(orderId);
      
      if (result.success) {
        await this.updatePaymentStatus(
          paymentId,
          PaymentStatus.COMPLETED,
          result.transactionId,
          {
            paypalResponse: result,
          }
        );
      }
    } catch (error) {
      this.logger.error('PayPal callback handling failed:', error);
      await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED);
    }
  }

  async handleStripeCallback(paymentIntentId: string, paymentId: number): Promise<void> {
    try {
      const result = await this.stripeService.confirmPaymentIntent(paymentIntentId);
      
      if (result.status === 'succeeded') {
        await this.updatePaymentStatus(
          paymentId,
          PaymentStatus.COMPLETED,
          paymentIntentId,
          {
            stripeResponse: result,
          }
        );
      } else if (result.status === 'requires_payment_method' || result.status === 'canceled') {
        await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED);
      }
    } catch (error) {
      this.logger.error('Stripe callback handling failed:', error);
      await this.updatePaymentStatus(paymentId, PaymentStatus.FAILED);
    }
  }

  private async processPayment(payment: any, createPaymentDto: CreatePaymentDto): Promise<any> {
    switch (payment.paymentMethod) {
      case PaymentMethod.MPESA:
        return this.processMpesaPayment(payment, createPaymentDto);
      case PaymentMethod.PAYPAL:
        return this.processPaypalPayment(payment, createPaymentDto);
      case PaymentMethod.STRIPE:
      case PaymentMethod.CREDIT_CARD:
        return this.processStripePayment(payment, createPaymentDto);
      default:
        throw new Error('Unsupported payment method');
    }
  }

  private async processMpesaPayment(payment: any, createPaymentDto: CreatePaymentDto): Promise<any> {
    if (!createPaymentDto.phoneNumber) {
      throw new Error('Phone number is required for M-Pesa payments');
    }

    const result = await this.mpesaService.initiateSTKPush(
      createPaymentDto.phoneNumber,
      payment.amount,
      payment.reference,
      payment.description
    );

    // Update payment with M-Pesa response
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          ...(payment.metadata as Record<string, any>),
          mpesaInitiation: result,
        },
      },
    });

    return {
      instructions: result.customerMessage,
      transactionId: result.checkoutRequestId,
    };
  }

  private async processPaypalPayment(payment: any, createPaymentDto: CreatePaymentDto): Promise<any> {
    const result = await this.paypalService.createOrder(
      Number(payment.amount),
      payment.currency,
      payment.reference,
      payment.description
    );

    // Update payment with PayPal response
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          ...(payment.metadata as Record<string, any>),
          paypalInitiation: result,
        },
      },
    });

    return {
      checkoutUrl: result.links.find(link => link.rel === 'approve')?.href,
      transactionId: result.orderId,
    };
  }

  private async processStripePayment(payment: any, createPaymentDto: CreatePaymentDto): Promise<any> {
    const result = await this.stripeService.createPaymentIntent(
      Number(payment.amount),
      payment.currency,
      payment.reference,
      payment.description,
      payment.metadata
    );

    // Update payment with Stripe response
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          ...(payment.metadata as Record<string, any>),
          stripeInitiation: result,
        },
      },
    });

    return {
      clientSecret: result.clientSecret,
      transactionId: result.paymentIntentId,
    };
  }

  private validatePaymentMethodRequirements(createPaymentDto: CreatePaymentDto): void {
    switch (createPaymentDto.paymentMethod) {
      case PaymentMethod.MPESA:
        if (!createPaymentDto.phoneNumber) {
          throw new Error('Phone number is required for M-Pesa payments');
        }
        break;
      case PaymentMethod.PAYPAL:
        if (!createPaymentDto.email) {
          throw new Error('Email is required for PayPal payments');
        }
        break;
      case PaymentMethod.CREDIT_CARD:
        // Credit card validation can be added here if needed
        break;
      case PaymentMethod.BANK_TRANSFER:
        // Bank transfer validation can be added here if needed
        break;
      case PaymentMethod.STRIPE:
        // Stripe validation can be added here if needed
        break;
    }
  }

  private generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `PAY-${timestamp}-${random}`.toUpperCase();
  }

  private async sendPaymentNotification(payment: any, result: any): Promise<void> {
    try {
      // Get user details for email
      const user = await this.prisma.user.findUnique({
        where: { id: payment.userId },
        select: { firstName: true, lastName: true, email: true }
      });

      if (!user) {
        this.logger.warn(`User not found for payment ${payment.id}`);
        return;
      }

      const paymentDetails = {
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        reference: payment.reference,
        description: payment.description,
        status: payment.status
      };

      // Send appropriate email based on payment status
      if (payment.status === PaymentStatus.COMPLETED) {
        await this.emailService.sendPaymentConfirmation(
          user.email,
          user.firstName,
          paymentDetails
        );
      } else if (payment.status === PaymentStatus.FAILED) {
        await this.emailService.sendPaymentFailed(
          user.email,
          user.firstName,
          {
            ...paymentDetails,
            errorMessage: result.errorMessage || 'Payment processing failed'
          }
        );
      }

      this.logger.log(`Payment notification email sent to ${user.email} for payment ${payment.id}`);
    } catch (error) {
      this.logger.error(`Failed to send payment notification email for payment ${payment.id}:`, error);
    }
  }
}
