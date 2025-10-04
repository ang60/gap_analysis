import { IsEnum, IsNumber, IsString, IsOptional, IsObject, ValidateIf } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string = 'KES';

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  description: string;

  @IsString()
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.MPESA)
  phoneNumber?: string; // Required for M-Pesa

  @IsString()
  @ValidateIf((o) => o.paymentMethod === PaymentMethod.PAYPAL)
  email?: string; // Required for PayPal

  @IsObject()
  @IsOptional()
  metadata?: any;
}
