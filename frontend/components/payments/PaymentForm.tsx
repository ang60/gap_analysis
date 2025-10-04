'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Smartphone, Globe } from 'lucide-react';

interface PaymentFormProps {
  onPaymentSuccess: () => void;
}

export function PaymentForm({ onPaymentSuccess }: PaymentFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paymentMethod: 'MPESA',
    phoneNumber: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          description: formData.description,
          paymentMethod: formData.paymentMethod,
          phoneNumber: formData.paymentMethod === 'MPESA' ? formData.phoneNumber : undefined,
          email: formData.paymentMethod === 'PAYPAL' ? formData.email : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Payment initiated successfully!');
        
        // Handle different payment methods
        if (formData.paymentMethod === 'MPESA' && data.instructions) {
          setSuccess(`M-Pesa payment initiated. ${data.instructions}`);
        } else if (formData.paymentMethod === 'PAYPAL' && data.checkoutUrl) {
          window.open(data.checkoutUrl, '_blank');
          setSuccess('PayPal checkout opened in new tab. Complete payment there.');
        } else if (formData.paymentMethod === 'STRIPE' && data.clientSecret) {
          // Handle Stripe payment
          setSuccess('Stripe payment initiated. Complete payment in the next step.');
        }
        
        onPaymentSuccess();
        setFormData({ amount: '', description: '', paymentMethod: 'MPESA', phoneNumber: '', email: '' });
      } else {
        setError(data.message || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'MPESA':
        return <Smartphone className="h-4 w-4" />;
      case 'PAYPAL':
        return <Globe className="h-4 w-4" />;
      case 'STRIPE':
      case 'CREDIT_CARD':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getPaymentMethodIcon(formData.paymentMethod)}
          Make Payment
        </CardTitle>
        <CardDescription>
          Choose your preferred payment method and complete the transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MPESA">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      M-Pesa
                    </div>
                  </SelectItem>
                  <SelectItem value="PAYPAL">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      PayPal
                    </div>
                  </SelectItem>
                  <SelectItem value="STRIPE">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Payment description"
              required
            />
          </div>

          {formData.paymentMethod === 'MPESA' && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="254700000000"
                required
              />
              <p className="text-sm text-gray-500">
                Enter your M-Pesa registered phone number (e.g., 254700000000)
              </p>
            </div>
          )}

          {formData.paymentMethod === 'PAYPAL' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
              <p className="text-sm text-gray-500">
                Enter your PayPal email address
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {getPaymentMethodIcon(formData.paymentMethod)}
                <span className="ml-2">
                  {formData.paymentMethod === 'MPESA' && 'Initiate M-Pesa Payment'}
                  {formData.paymentMethod === 'PAYPAL' && 'Pay with PayPal'}
                  {formData.paymentMethod === 'STRIPE' && 'Pay with Card'}
                </span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
