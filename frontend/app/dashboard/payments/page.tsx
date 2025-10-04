'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { SubscriptionCard } from '@/components/payments/SubscriptionCard';
import { BillingDashboard } from '@/components/payments/BillingDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, History, Receipt, Settings } from 'lucide-react';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600">Manage your payments, subscriptions, and billing information</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Make Payment
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BillingDashboard payments={payments} loading={loading} />
            </div>
            <div>
              <SubscriptionCard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <PaymentForm onPaymentSuccess={fetchPayments} />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PaymentHistory payments={payments} loading={loading} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <BillingDashboard payments={payments} loading={loading} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
