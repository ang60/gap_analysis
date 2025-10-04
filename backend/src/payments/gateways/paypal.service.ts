import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);
  private readonly baseUrl = process.env.PAYPAL_ENVIRONMENT === 'production'
    ? 'https://api.paypal.com'
    : 'https://api.sandbox.paypal.com';
  
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  async createOrder(amount: number, currency: string, reference: string, description: string) {
    try {
      const accessToken = await this.getAccessToken();

      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: reference,
            description: description,
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'Gap Analysis System',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.APP_URL}/dashboard/payments/paypal/success`,
          cancel_url: `${process.env.APP_URL}/dashboard/payments/paypal/cancel`,
        },
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': reference,
          },
        }
      );

      this.logger.log(`PayPal order created: ${response.data.id}`);

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        links: response.data.links,
        reference: reference,
      };
    } catch (error) {
      this.logger.error('PayPal order creation failed:', error.response?.data || error.message);
      throw new Error(`PayPal payment failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async captureOrder(orderId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const capture = response.data.purchase_units[0].payments.captures[0];

      return {
        success: true,
        captureId: capture.id,
        status: capture.status,
        amount: parseFloat(capture.amount.value),
        currency: capture.amount.currency_code,
        transactionId: capture.id,
        orderId: response.data.id,
      };
    } catch (error) {
      this.logger.error('PayPal order capture failed:', error.response?.data || error.message);
      throw new Error(`PayPal capture failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getOrderDetails(orderId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.baseUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        orderId: response.data.id,
        status: response.data.status,
        amount: response.data.purchase_units[0].amount.value,
        currency: response.data.purchase_units[0].amount.currency_code,
        reference: response.data.purchase_units[0].reference_id,
      };
    } catch (error) {
      this.logger.error('PayPal order details fetch failed:', error.response?.data || error.message);
      throw new Error(`PayPal order fetch failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async refundPayment(captureId: string, amount?: number, reason?: string) {
    try {
      const accessToken = await this.getAccessToken();

      const refundData = {
        amount: amount ? {
          value: amount.toFixed(2),
          currency_code: 'USD', // PayPal typically uses USD
        } : undefined,
        note_to_payer: reason || 'Refund for Gap Analysis System payment',
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/payments/captures/${captureId}/refund`,
        refundData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        refundId: response.data.id,
        status: response.data.status,
        amount: parseFloat(response.data.amount.value),
        currency: response.data.amount.currency_code,
      };
    } catch (error) {
      this.logger.error('PayPal refund failed:', error.response?.data || error.message);
      throw new Error(`PayPal refund failed: ${error.response?.data?.message || error.message}`);
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.');
    }
    
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get PayPal access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPal');
    }
  }
}
