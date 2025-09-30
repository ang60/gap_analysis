'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Upload, 
  AlertCircle, 
  Clock,
  FileText,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import Link from 'next/link';

export default function StaffDashboard() {
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
          <p className="mt-2 text-gray-600">Loading Staff Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedComponent allowedRoles={['STAFF']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">Input & Implementation - Complete your assigned tasks</p>
          </div>
          <Badge className="bg-gray-100 text-gray-800 px-3 py-1">
            <Target className="h-4 w-4 mr-1" />
            Staff
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                3 due this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Needs attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                On track
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Complete Assigned Tasks
              </CardTitle>
              <CardDescription>
                Complete tasks assigned by Managers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckSquare className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Active Tasks</span>
                  </div>
                  <Link href="/dashboard/action-plans">
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      View Tasks
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Completed Today</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    3 Tasks
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Due This Week</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    3 Due Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Evidence & Documents
              </CardTitle>
              <CardDescription>
                Upload evidence and documents for completed tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Upload Evidence</span>
                  </div>
                  <Link href="/dashboard/evidence">
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      Upload Now
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Documents Uploaded</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    15 Files
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Pending Review</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    2 Files
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Status Updates & Issue Reporting */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Update Task Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Update Task Status
              </CardTitle>
              <CardDescription>
                Update status of assigned tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">In Progress</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    5 Tasks
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Update Status</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      // Open task status update modal
                      alert('Opening task status update... (This would open a modal to update task status)');
                    }}
                  >
                    Update Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Report Issues & Concerns
              </CardTitle>
              <CardDescription>
                Report any issues or concerns with tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium">Open Issues</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    1 Issue
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Report New Issue</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      // Open issue reporting modal
                      alert('Opening issue reporting form... (This would open a modal to report issues)');
                    }}
                  >
                    Report Issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              My Current Tasks
            </CardTitle>
            <CardDescription>
              Tasks assigned to you by your Manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Update Compliance Documentation</h4>
                    <p className="text-sm text-gray-600">Due: Tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      alert('Opening task details... (This would open task details modal)');
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Upload Training Certificates</h4>
                    <p className="text-sm text-gray-600">Due: Friday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      alert('Viewing completed task details... (This would show task completion details)');
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg hover:border-red-300 transition-colors bg-red-50">
                <div className="flex items-center">
                  <CheckSquare className="h-4 w-4 text-red-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Review Risk Assessment</h4>
                    <p className="text-sm text-gray-600">Due: Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      alert('Opening overdue task... (This would open task with high priority)');
                    }}
                  >
                    Complete Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedComponent>
  );
}
