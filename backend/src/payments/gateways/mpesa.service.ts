import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private readonly baseUrl = process.env.MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';
  
  private readonly consumerKey = process.env.MPESA_CONSUMER_KEY;
  private readonly consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  private readonly shortcode = process.env.MPESA_SHORTCODE;
  private readonly passkey = process.env.MPESA_PASSKEY;
  private readonly callbackUrl = process.env.MPESA_CALLBACK_URL || 
    (process.env.MPESA_ENVIRONMENT === 'production' 
      ? 'https://yourdomain.com/api/payments/mpesa/callback'
      : 'https://webhook.site/unique-url-for-testing');

  async initiateSTKPush(phoneNumber: string, amount: number, reference: string, description: string) {
    try {
      // For sandbox testing, simulate the M-Pesa response without making actual API calls
      if (process.env.MPESA_ENVIRONMENT === 'sandbox') {
        this.logger.log('M-Pesa Sandbox Mode: Simulating STK Push');
        
        // Simulate a successful response
        const mockResponse = {
          success: true,
          checkoutRequestId: `ws_CO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchantRequestId: `ws_CO_${Date.now()}`,
          responseCode: '0',
          responseDescription: 'Success. Request accepted for processing',
          customerMessage: 'Success. Request accepted for processing'
        };
        
        this.logger.log(`M-Pesa STK Push simulated: ${mockResponse.checkoutRequestId}`);
        return mockResponse;
      }

      // Production mode - make actual API call
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const phone = this.formatPhoneNumber(phoneNumber);

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount), // M-Pesa requires integer amounts
          PartyA: phone,
          PartyB: this.shortcode,
          PhoneNumber: phone,
          CallBackURL: this.callbackUrl,
          AccountReference: reference,
          TransactionDesc: description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`M-Pesa STK Push initiated: ${response.data.CheckoutRequestID}`);
      
      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage,
      };
    } catch (error) {
      this.logger.error('M-Pesa STK Push failed:', error.response?.data || error.message);
      throw new Error(`M-Pesa payment failed: ${error.response?.data?.errorMessage || error.message}`);
    }
  }

  async querySTKPushStatus(checkoutRequestId: string) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = this.generatePassword(timestamp);

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.shortcode,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
      };
    } catch (error) {
      this.logger.error('M-Pesa STK Push query failed:', error.response?.data || error.message);
      throw new Error(`M-Pesa query failed: ${error.response?.data?.errorMessage || error.message}`);
    }
  }

  async handleCallback(callbackData: any) {
    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;
      
      if (stkCallback.ResultCode === 0) {
        const { CallbackMetadata } = stkCallback;
        const metadata: Record<string, any> = {};
        
        CallbackMetadata.Item.forEach((item: any) => {
          metadata[item.Name] = item.Value;
        });

        return {
          success: true,
          transactionId: metadata.MpesaReceiptNumber,
          amount: metadata.Amount,
          phoneNumber: metadata.PhoneNumber,
          transactionDate: metadata.TransactionDate,
          checkoutRequestId: stkCallback.CheckoutRequestID,
          merchantRequestId: stkCallback.MerchantRequestID,
        };
      } else {
        return {
          success: false,
          errorCode: stkCallback.ResultCode,
          errorMessage: stkCallback.ResultDesc,
          checkoutRequestId: stkCallback.CheckoutRequestID,
          merchantRequestId: stkCallback.MerchantRequestID,
        };
      }
    } catch (error) {
      this.logger.error('M-Pesa callback processing failed:', error);
      throw new Error('Failed to process M-Pesa callback');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('M-Pesa is not configured. Please set MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET environment variables.');
    }
    
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa access token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  private generatePassword(timestamp: string): string {
    const data = `${this.shortcode}${this.passkey}${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('base64');
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add country code if not present
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  }
}
