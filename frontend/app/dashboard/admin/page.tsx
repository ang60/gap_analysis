'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Settings, 
  BarChart3,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedComponent allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Support & Coordination - Manage your organization</p>
          </div>
          <Badge className="bg-red-100 text-red-800 px-3 py-1">
            <Shield className="h-4 w-4 mr-1" />
            Admin
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22</div>
              <p className="text-xs text-muted-foreground">
                92% active rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>
                Set up user accounts and assign roles to your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Create New User</span>
                  </div>
                  <Link href="/dashboard/user-management">
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      Manage Users
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Assign Roles</span>
                  </div>
                  <Link href="/dashboard/user-management">
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                      Assign Roles
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                System Performance
              </CardTitle>
              <CardDescription>
                Monitor system performance and fix issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">System Alerts</span>
                  </div>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                    2 Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Performance Status</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Optimal
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Training & Support
            </CardTitle>
            <CardDescription>
              Provide training on system usage and support your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">User Training</h4>
                <p className="text-sm text-gray-600 mb-3">Guide new users through system features</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Open training session modal or redirect to training page
                    alert('Starting training session... (This would open a training interface)');
                  }}
                >
                  Start Training Session
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">System Documentation</h4>
                <p className="text-sm text-gray-600 mb-3">Access system guides and manuals</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Open documentation in new tab or modal
                    window.open('/docs', '_blank');
                  }}
                >
                  View Documentation
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Support Tickets</h4>
                <p className="text-sm text-gray-600 mb-3">Manage user support requests</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Navigate to support tickets page
                    window.location.href = '/dashboard/support-tickets';
                  }}
                >
                  View Tickets
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedComponent>
  );
}
