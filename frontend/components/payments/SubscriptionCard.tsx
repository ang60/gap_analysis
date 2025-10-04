'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface Subscription {
  id: number;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export function SubscriptionCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Mock subscription data - replace with actual API call
    setTimeout(() => {
      setSubscription({
        id: 1,
        planType: 'PROFESSIONAL',
        status: 'ACTIVE',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        autoRenew: true,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'ENTERPRISE':
        return <Crown className="h-5 w-5 text-purple-500" />;
      case 'PROFESSIONAL':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'BASIC':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'EXPIRED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'SUSPENDED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      EXPIRED: 'destructive',
      SUSPENDED: 'secondary',
      CANCELLED: 'outline',
      INACTIVE: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  };

  const handleManageSubscription = async () => {
    setShowManageModal(true);
  };

  const handleRenewSubscription = async () => {
    setShowRenewModal(true);
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in again. Your session has expired.');
      return;
    }
    
    setActionLoading(true);
    try {
      // API call to toggle auto-renewal
      const response = await fetch(`http://localhost:3000/subscriptions/${subscription.id}/auto-renew`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ autoRenew: !subscription.autoRenew }),
      });

      if (response.ok) {
        setSubscription(prev => prev ? { ...prev, autoRenew: !prev.autoRenew } : null);
        alert(`Auto-renewal ${!subscription.autoRenew ? 'enabled' : 'disabled'} successfully`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update auto-renewal setting: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling auto-renewal:', error);
      alert('Error updating auto-renewal setting');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in again. Your session has expired.');
      return;
    }
    
    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/subscriptions/${subscription.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSubscription(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
        alert('Subscription cancelled successfully');
        setShowManageModal(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to cancel subscription: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpgradePlan = async (newPlan: string) => {
    if (!subscription) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in again. Your session has expired.');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/subscriptions/${subscription.id}/upgrade`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planType: newPlan }),
      });

      if (response.ok) {
        setSubscription(prev => prev ? { ...prev, planType: newPlan } : null);
        alert(`Successfully upgraded to ${newPlan} plan`);
        setShowManageModal(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to upgrade plan: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Error upgrading plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewNow = async () => {
    if (!subscription) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in again. Your session has expired.');
      return;
    }
    
    // Get form data from the modal
    const paymentInput = document.getElementById('payment-input') as HTMLInputElement;
    const paymentMethodSelect = document.querySelector('select') as HTMLSelectElement;
    
    const inputValue = paymentInput?.value?.trim();
    const paymentMethod = paymentMethodSelect?.value || 'MPESA';
    
    // Validate based on payment method
    if (paymentMethod === 'MPESA' && !inputValue) {
      alert('Please enter your phone number for M-Pesa payment.');
      return;
    }
    
    if (paymentMethod === 'PAYPAL' && !inputValue) {
      alert('Please enter your email for PayPal payment.');
      return;
    }
    
    setActionLoading(true);
    try {
      // Prepare payment data based on method
      const paymentData: any = {
        amount: 99.99, // Plan price
        description: `Renewal for ${subscription.planType} plan`,
        paymentMethod: paymentMethod,
      };
      
      // Add method-specific fields
      if (paymentMethod === 'MPESA') {
        paymentData.phoneNumber = inputValue;
      } else if (paymentMethod === 'PAYPAL') {
        paymentData.email = inputValue;
      }
      
      const response = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert('Payment initiated successfully. Please complete the payment to renew your subscription.');
        setShowRenewModal(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to initiate renewal payment: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error initiating renewal:', error);
      alert('Error initiating renewal payment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Loading subscription details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>No active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
            <p className="text-gray-500 mb-4">
              Subscribe to a plan to access all features
            </p>
            <Button>Choose Plan</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysRemaining = getDaysRemaining(subscription.endDate);
  const progressPercentage = getProgressPercentage(subscription.startDate, subscription.endDate);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPlanIcon(subscription.planType)}
            <CardTitle className="text-lg">{subscription.planType} Plan</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(subscription.status)}
            {getStatusBadge(subscription.status)}
          </div>
        </div>
        <CardDescription>
          {subscription.autoRenew ? 'Auto-renewal enabled' : 'Manual renewal required'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subscription Period</span>
            <span className="font-medium">
              {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Days Remaining</span>
              <span className="font-medium">{daysRemaining} days</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleManageSubscription}
              disabled={actionLoading}
            >
              <Settings className="h-4 w-4 mr-2" />
              {actionLoading ? 'Loading...' : 'Manage'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleRenewSubscription}
              disabled={actionLoading}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {actionLoading ? 'Loading...' : 'Renew'}
            </Button>
          </div>
        </div>

        {daysRemaining <= 30 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                {daysRemaining <= 0 
                  ? 'Subscription expired' 
                  : `Subscription expires in ${daysRemaining} days`
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Manage Subscription Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Manage Subscription</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-renewal</span>
                <Button
                  variant={subscription?.autoRenew ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleAutoRenew}
                  disabled={actionLoading}
                >
                  {subscription?.autoRenew ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Upgrade Plan</span>
                <div className="grid grid-cols-2 gap-2">
                  {['BASIC', 'PROFESSIONAL', 'ENTERPRISE'].map((plan) => (
                    <Button
                      key={plan}
                      variant={subscription?.planType === plan ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpgradePlan(plan)}
                      disabled={actionLoading || subscription?.planType === plan}
                    >
                      {plan}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  className="w-full"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowManageModal(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Subscription Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Renew Subscription</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{subscription?.planType} Plan</span>
                  <span className="text-lg font-bold">KES 99.99</span>
                </div>
                <p className="text-sm text-gray-600">
                  Renewal will extend your subscription for another year
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const input = document.getElementById('payment-input') as HTMLInputElement;
                    const label = document.getElementById('input-label') as HTMLLabelElement;
                    const help = document.getElementById('input-help') as HTMLParagraphElement;
                    
                    if (e.target.value === 'MPESA') {
                      input.type = 'tel';
                      input.placeholder = '254712345678';
                      label.textContent = 'Phone Number (for M-Pesa) *';
                      help.textContent = 'Enter your M-Pesa registered phone number';
                    } else if (e.target.value === 'PAYPAL') {
                      input.type = 'email';
                      input.placeholder = 'user@example.com';
                      label.textContent = 'Email (for PayPal) *';
                      help.textContent = 'Enter your PayPal registered email address';
                    } else {
                      input.type = 'text';
                      input.placeholder = 'Card details will be handled securely';
                      label.textContent = 'Payment Details';
                      help.textContent = 'Card payment will be processed securely';
                    }
                  }}
                >
                  <option value="MPESA">M-Pesa</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" id="input-label">Phone Number (for M-Pesa) *</label>
                <input
                  type="tel"
                  placeholder="254712345678"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  id="payment-input"
                />
                <p className="text-xs text-gray-500" id="input-help">
                  Enter your M-Pesa registered phone number
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowRenewModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenewNow}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? 'Processing...' : 'Renew Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
