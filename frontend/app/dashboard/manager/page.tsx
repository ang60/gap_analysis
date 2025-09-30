'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckSquare, 
  Users, 
  BarChart3,
  Target,
  TrendingUp,
  AlertTriangle,
  Clock,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import Link from 'next/link';

export default function ManagerDashboard() {
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
          <p className="mt-2 text-gray-600">Loading Manager Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedComponent allowedRoles={['MANAGER']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600">Direction & Decision-making - Lead your compliance efforts</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
            <Target className="h-4 w-4 mr-1" />
            Manager
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requirements to Review</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Pending your review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Plans</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Active plans
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Tasks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">
                Assigned to team
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                On track for goals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Manager Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Review Compliance Requirements
              </CardTitle>
              <CardDescription>
                Review requirements created by Compliance Officers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Pending Reviews</span>
                  </div>
                  <Link href="/dashboard/requirements">
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      Review Now
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Approved Requirements</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    15 Approved
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Create Action Plans
              </CardTitle>
              <CardDescription>
                Create action plans to address compliance gaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Gap Analysis Results</span>
                  </div>
                  <Link href="/dashboard/action-plans">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                    onClick={() => {
                      // Open action plan creation wizard
                      alert('Opening action plan creation wizard... (This would open a step-by-step plan creation interface)');
                    }}
                  >
                    Create Plan
                  </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Active Plans</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    12 In Progress
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Assignment & Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Task Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Assign Tasks to Staff
              </CardTitle>
              <CardDescription>
                Assign tasks to Staff members and monitor progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Available Staff</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    8 Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Task Assignment</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      // Open task assignment modal or page
                      alert('Opening task assignment interface... (This would open a task assignment modal)');
                    }}
                  >
                    Assign Tasks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monitor Progress
              </CardTitle>
              <CardDescription>
                Track progress and make strategic decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Overall Progress</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    78% Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Attention Needed</span>
                  </div>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                    3 Items
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleBasedComponent>
  );
}
