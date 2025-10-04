import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-08-27.basil',
      });
    } else {
      this.logger.warn('STRIPE_SECRET_KEY not found. Stripe payments will be disabled.');
    }
  }

  async createPaymentIntent(amount: number, currency: string, reference: string, description: string, metadata?: any) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description: description,
        metadata: {
          reference,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      this.logger.log(`Stripe payment intent created: ${paymentIntent.id}`);

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        reference: reference,
      };
    } catch (error) {
      this.logger.error('Stripe payment intent creation failed:', error.message);
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      this.logger.error('Stripe payment intent confirmation failed:', error.message);
      throw new Error(`Stripe confirmation failed: ${error.message}`);
    }
  }

  async createCheckoutSession(amount: number, currency: string, reference: string, description: string, successUrl: string, cancelUrl: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: 'Gap Analysis System Payment',
                description: description,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          reference,
        },
      });

      this.logger.log(`Stripe checkout session created: ${session.id}`);

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
        reference: reference,
      };
    } catch (error) {
      this.logger.error('Stripe checkout session creation failed:', error.message);
      throw new Error(`Stripe checkout failed: ${error.message}`);
    }
  }

  async retrieveCheckoutSession(sessionId: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return {
        success: true,
        sessionId: session.id,
        status: session.payment_status,
        amount: session.amount_total,
        currency: session.currency,
        paymentIntentId: session.payment_intent,
        metadata: session.metadata,
      };
    } catch (error) {
      this.logger.error('Stripe checkout session retrieval failed:', error.message);
      throw new Error(`Stripe session retrieval failed: ${error.message}`);
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number, reason?: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const refundData: any = {
        payment_intent: paymentIntentId,
        reason: reason || 'requested_by_customer',
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount,
        currency: refund.currency,
        reason: refund.reason,
      };
    } catch (error) {
      this.logger.error('Stripe refund failed:', error.message);
      throw new Error(`Stripe refund failed: ${error.message}`);
    }
  }

  async createCustomer(email: string, name: string, metadata?: any) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata,
      });

      return {
        success: true,
        customerId: customer.id,
        email: customer.email,
        name: customer.name,
      };
    } catch (error) {
      this.logger.error('Stripe customer creation failed:', error.message);
      throw new Error(`Stripe customer creation failed: ${error.message}`);
    }
  }

  async setupPaymentMethod(customerId: string, paymentMethodId: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        type: paymentMethod.type,
        customer: paymentMethod.customer,
      };
    } catch (error) {
      this.logger.error('Stripe payment method setup failed:', error.message);
      throw new Error(`Stripe payment method setup failed: ${error.message}`);
    }
  }

  async listPaymentMethods(customerId: string) {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data.map(pm => ({
          id: pm.id,
          type: pm.type,
          card: pm.card,
          created: pm.created,
        })),
      };
    } catch (error) {
      this.logger.error('Stripe payment methods list failed:', error.message);
      throw new Error(`Stripe payment methods list failed: ${error.message}`);
    }
  }
}
