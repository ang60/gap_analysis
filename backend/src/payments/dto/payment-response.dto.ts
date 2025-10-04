import { PaymentStatus, PaymentMethod } from '@prisma/client';

export class PaymentResponseDto {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  reference: string;
  description: string;
  metadata?: any;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  organization: {
    name: string;
  };
}

export class PaymentInitiationResponseDto {
  success: boolean;
  message: string;
  paymentId: number;
  reference: string;
  checkoutUrl?: string; // For PayPal/Stripe
  instructions?: string; // For M-Pesa
  transactionId?: string;
}
