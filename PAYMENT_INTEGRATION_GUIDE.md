# 💳 Payment Integration Guide

## Overview

This guide covers the complete payment integration implementation for the Gap Analysis System, supporting M-Pesa, PayPal, and Credit/Debit Cards (Stripe).

## 🏗️ Architecture

### Backend Components

```
backend/src/payments/
├── payments.module.ts          # Main payment module
├── payments.controller.ts      # Payment API endpoints
├── payments.service.ts         # Payment business logic
├── dto/
│   ├── create-payment.dto.ts   # Payment creation DTO
│   └── payment-response.dto.ts # Payment response DTO
└── gateways/
    ├── mpesa.service.ts        # M-Pesa integration
    ├── paypal.service.ts       # PayPal integration
    └── stripe.service.ts       # Stripe integration
```

### Frontend Components

```
frontend/components/payments/
├── PaymentForm.tsx             # Payment form component
├── PaymentHistory.tsx          # Payment history display
├── SubscriptionCard.tsx        # Subscription management
└── BillingDashboard.tsx        # Billing overview
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env` file:

```env
# M-Pesa Configuration
MPESA_ENVIRONMENT="sandbox"
MPESA_CONSUMER_KEY="your-mpesa-consumer-key"
MPESA_CONSUMER_SECRET="your-mpesa-consumer-secret"
MPESA_SHORTCODE="your-mpesa-shortcode"
MPESA_PASSKEY="your-mpesa-passkey"
MPESA_CALLBACK_URL="http://localhost:3001/api/payments/mpesa/callback"

# PayPal Configuration
PAYPAL_ENVIRONMENT="sandbox"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
```

### 2. Database Migration

Run the database migration to create payment tables:

```bash
cd backend
npx prisma migrate dev --name add_payment_system
npx prisma generate
```

### 3. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install axios stripe

# Frontend dependencies (if not already installed)
cd frontend
npm install @stripe/stripe-js
```

## 🚀 Payment Methods

### 1. M-Pesa Integration

#### Features:
- STK Push for mobile payments
- Real-time payment status updates
- Callback handling for payment confirmation
- Phone number validation and formatting

#### Usage:
```typescript
// Create M-Pesa payment
const payment = await paymentsService.createPayment({
  amount: 1000,
  description: "Gap Analysis System Payment",
  paymentMethod: "MPESA",
  phoneNumber: "254700000000"
}, userId, organizationId);
```

#### M-Pesa Setup:
1. Register with Safaricom Developer Portal
2. Create an app and get credentials
3. Configure callback URL
4. Test with sandbox environment

### 2. PayPal Integration

#### Features:
- PayPal Checkout integration
- Order creation and capture
- Refund support
- Webhook handling

#### Usage:
```typescript
// Create PayPal payment
const payment = await paymentsService.createPayment({
  amount: 1000,
  description: "Gap Analysis System Payment",
  paymentMethod: "PAYPAL",
  email: "user@example.com"
}, userId, organizationId);
```

#### PayPal Setup:
1. Create PayPal Developer Account
2. Create an app in PayPal Developer Dashboard
3. Get Client ID and Secret
4. Configure redirect URLs

### 3. Stripe Integration

#### Features:
- Credit/Debit card payments
- Payment Intents API
- Checkout Sessions
- Customer management
- Refund support

#### Usage:
```typescript
// Create Stripe payment
const payment = await paymentsService.createPayment({
  amount: 1000,
  description: "Gap Analysis System Payment",
  paymentMethod: "STRIPE"
}, userId, organizationId);
```

#### Stripe Setup:
1. Create Stripe Account
2. Get API keys from Dashboard
3. Configure webhook endpoints
4. Test with test cards

## 📱 Frontend Implementation

### Payment Form

The payment form supports all three payment methods with dynamic fields:

```tsx
<PaymentForm onPaymentSuccess={fetchPayments} />
```

### Payment History

View and filter payment history:

```tsx
<PaymentHistory payments={payments} loading={loading} />
```

### Billing Dashboard

Comprehensive billing overview:

```tsx
<BillingDashboard payments={payments} loading={loading} />
```

## 🔐 Security Features

### 1. Role-Based Access Control
- Only `ADMIN` and `MANAGER` roles can access payment features
- Payment data is isolated by organization
- User authentication required for all payment operations

### 2. Data Protection
- Payment data encryption
- Secure API endpoints
- Input validation and sanitization
- Audit logging

### 3. Compliance
- PCI DSS compliance for card payments
- Data protection regulations
- Secure callback handling

## 🧪 Testing

### 1. M-Pesa Testing
- Use sandbox environment
- Test phone numbers: 254708374149
- Verify callback handling
- Test payment status updates

### 2. PayPal Testing
- Use sandbox environment
- Test with PayPal sandbox accounts
- Verify order creation and capture
- Test refund functionality

### 3. Stripe Testing
- Use test mode
- Test with test card numbers
- Verify payment intents
- Test webhook handling

## 📊 Monitoring and Logging

### 1. Payment Logging
- All payment attempts logged
- Success/failure tracking
- Error monitoring
- Performance metrics

### 2. Dashboard Metrics
- Total revenue tracking
- Payment method distribution
- Success/failure rates
- Recent payment activity

## 🔄 Payment Flow

### 1. Payment Initiation
1. User selects payment method
2. System validates payment data
3. Payment record created in database
4. Gateway-specific processing initiated

### 2. Payment Processing
1. M-Pesa: STK Push sent to user's phone
2. PayPal: Checkout session created
3. Stripe: Payment intent created

### 3. Payment Confirmation
1. Gateway sends callback/webhook
2. System updates payment status
3. User notified of payment result
4. Payment record updated

## 🚨 Error Handling

### 1. Payment Failures
- Graceful error handling
- User-friendly error messages
- Retry mechanisms
- Fallback options

### 2. Network Issues
- Timeout handling
- Retry logic
- Offline support
- Status synchronization

## 📈 Performance Optimization

### 1. Database Optimization
- Indexed payment queries
- Efficient data retrieval
- Connection pooling
- Query optimization

### 2. API Optimization
- Response caching
- Rate limiting
- Request batching
- Async processing

## 🔧 Maintenance

### 1. Regular Updates
- Gateway API updates
- Security patches
- Feature enhancements
- Performance improvements

### 2. Monitoring
- Payment success rates
- Error tracking
- Performance metrics
- User feedback

## 📚 API Documentation

### Payment Endpoints

#### Create Payment
```http
POST /api/payments
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 1000,
  "description": "Payment description",
  "paymentMethod": "MPESA",
  "phoneNumber": "254700000000"
}
```

#### Get Payments
```http
GET /api/payments
Authorization: Bearer <token>
```

#### Get Payment by ID
```http
GET /api/payments/:id
Authorization: Bearer <token>
```

#### Update Payment Status
```http
POST /api/payments/:id/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "COMPLETED",
  "transactionId": "transaction_id"
}
```

### Callback Endpoints

#### M-Pesa Callback
```http
POST /api/payments/mpesa/callback
Content-Type: application/json
```

#### PayPal Callback
```http
POST /api/payments/paypal/callback?orderId=order_id&paymentId=payment_id
```

#### Stripe Callback
```http
POST /api/payments/stripe/callback?paymentIntentId=intent_id&paymentId=payment_id
```

## 🎯 Best Practices

### 1. Security
- Never store sensitive payment data
- Use HTTPS for all payment operations
- Validate all input data
- Implement proper authentication

### 2. User Experience
- Clear payment instructions
- Real-time status updates
- Error handling and recovery
- Mobile-friendly interface

### 3. Development
- Test thoroughly in sandbox environments
- Implement proper logging
- Handle edge cases
- Monitor payment success rates

## 🚀 Deployment

### 1. Production Setup
- Update environment variables
- Configure production gateways
- Set up monitoring
- Test payment flows

### 2. SSL Configuration
- Enable HTTPS
- Configure SSL certificates
- Update callback URLs
- Test secure connections

## 📞 Support

For payment-related issues:
1. Check payment gateway status
2. Review error logs
3. Verify configuration
4. Test with sandbox environments

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor payment success rates
- Update gateway APIs
- Review security measures
- Optimize performance
- Handle user feedback

### Emergency Procedures
- Payment system downtime
- Gateway API changes
- Security incidents
- Data recovery

---

**Payment integration is now complete and ready for production use!** 🎉
