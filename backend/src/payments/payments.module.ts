import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MpesaService } from './gateways/mpesa.service';
import { PaypalService } from './gateways/paypal.service';
import { StripeService } from './gateways/stripe.service';
import { EmailService } from '../email/email.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController, SubscriptionsController],
  providers: [PaymentsService, MpesaService, PaypalService, StripeService, EmailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
