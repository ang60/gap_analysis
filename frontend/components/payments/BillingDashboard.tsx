'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Globe,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface BillingDashboardProps {
  payments: Payment[];
  loading: boolean;
}

export function BillingDashboard({ payments, loading }: BillingDashboardProps) {
  const [stats, setStats] = useState({
    totalAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    mpesaPayments: 0,
    paypalPayments: 0,
    cardPayments: 0,
  });
  const [showPaymentDetails, setShowPaymentDetails] = useState<Payment | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (payments.length > 0) {
      const newStats = payments.reduce((acc, payment) => {
        acc.totalAmount += payment.amount;
        
        switch (payment.status) {
          case 'COMPLETED':
            acc.completedPayments++;
            break;
          case 'PENDING':
          case 'PROCESSING':
            acc.pendingPayments++;
            break;
          case 'FAILED':
            acc.failedPayments++;
            break;
        }
        
        switch (payment.paymentMethod) {
          case 'MPESA':
            acc.mpesaPayments++;
            break;
          case 'PAYPAL':
            acc.paypalPayments++;
            break;
          case 'STRIPE':
          case 'CREDIT_CARD':
            acc.cardPayments++;
            break;
        }
        
        return acc;
      }, {
        totalAmount: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        mpesaPayments: 0,
        paypalPayments: 0,
        cardPayments: 0,
      });
      
      setStats(newStats);
    }
  }, [payments]);

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getRecentPayments = () => {
    return payments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
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

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: 'default',
      FAILED: 'destructive',
      PENDING: 'secondary',
      PROCESSING: 'outline',
      CANCELLED: 'outline',
      REFUNDED: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toLowerCase().replace('_', ' ')}
      </Badge>
    );
  };

  const handleExportPayments = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in again. Your session has expired.');
      return;
    }
    
    setExportLoading(true);
    try {
      const response = await fetch('http://localhost:3000/payments/export/csv', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([data.content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Payments exported successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to export payments: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting payments');
    } finally {
      setExportLoading(false);
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setShowPaymentDetails(payment);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length} total payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedPayments}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length > 0 ? Math.round((stats.completedPayments / payments.length) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedPayments}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length > 0 ? Math.round((stats.failedPayments / payments.length) * 100) : 0}% failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              M-Pesa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mpesaPayments}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length > 0 ? Math.round((stats.mpesaPayments / payments.length) * 100) : 0}% of payments
            </p>
            <Progress 
              value={payments.length > 0 ? (stats.mpesaPayments / payments.length) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              PayPal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paypalPayments}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length > 0 ? Math.round((stats.paypalPayments / payments.length) * 100) : 0}% of payments
            </p>
            <Progress 
              value={payments.length > 0 ? (stats.paypalPayments / payments.length) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cardPayments}</div>
            <p className="text-xs text-muted-foreground">
              {payments.length > 0 ? Math.round((stats.cardPayments / payments.length) * 100) : 0}% of payments
            </p>
            <Progress 
              value={payments.length > 0 ? (stats.cardPayments / payments.length) * 100 : 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportPayments}
              disabled={exportLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              {exportLoading ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {getRecentPayments().length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payments found
            </div>
          ) : (
            <div className="space-y-4">
              {getRecentPayments().map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPaymentMethodIcon(payment.paymentMethod)}
                    <div>
                      <p className="font-medium">{formatCurrency(payment.amount, payment.currency)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(payment.status)}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewPayment(payment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Modal */}
      {showPaymentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(showPaymentDetails.amount, showPaymentDetails.currency)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(showPaymentDetails.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getPaymentMethodIcon(showPaymentDetails.paymentMethod)}
                    <span className="text-sm">{showPaymentDetails.paymentMethod}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-sm">
                    {new Date(showPaymentDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {showPaymentDetails.id.toString().padStart(8, '0')}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPaymentDetails(null)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // Add download receipt functionality
                  alert('Receipt download functionality would be implemented here');
                }}
                className="flex-1"
              >
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
