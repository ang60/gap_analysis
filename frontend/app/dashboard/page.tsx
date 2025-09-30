'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Calendar,
  Users,
  BarChart3,
  Plus,
  ArrowRight,
  Target,
  Search,
  Settings,
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import Link from 'next/link';

export default function DashboardPage() {
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
          <p className="mt-2 text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Super Admin Dashboard
  if (user?.role === 'SUPER_ADMIN') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">System-wide oversight and management</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
            Super Admin
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active organizations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20</div>
              <p className="text-xs text-muted-foreground">Across all organizations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <p className="text-xs text-muted-foreground">Uptime this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Current users online</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>Manage organizations and system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/super-admin">
                <Button className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  System Administration
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === 'ADMIN') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Support & Coordination - Manage your organization</p>
          </div>
          <Badge className="bg-red-100 text-red-800 px-3 py-1">
            Admin
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">In your organization</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Users online now</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Pending resolution</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operational</div>
              <p className="text-xs text-muted-foreground">All systems running</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and assign roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/user-management">
                <Button className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Support & Training</CardTitle>
              <CardDescription>Help users and provide training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" onClick={() => alert('Starting training session...')}>
                <Shield className="mr-2 h-4 w-4" />
                Start Training Session
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.open('/docs', '_blank')}>
                <FileText className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/dashboard/support-tickets'}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Compliance Officer Dashboard
  if (user?.role === 'COMPLIANCE_OFFICER') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Officer Dashboard</h1>
            <p className="text-gray-600">Oversight & Regulatory Assurance - Ensure compliance excellence</p>
          </div>
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            Compliance Officer
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requirements</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Total requirements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gap Assessments</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Register</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">High priority risks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-muted-foreground">Current compliance level</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>Manage requirements and assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/requirements">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Requirements
                </Button>
              </Link>
              <Link href="/dashboard/gap-analysis">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Gap Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk & Reporting</CardTitle>
              <CardDescription>Assess risks and generate reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/risks">
                <Button className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Risk Register
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Generating compliance report...')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Checking for regulatory updates...')}>
                <Search className="mr-2 h-4 w-4" />
                Check Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Manager Dashboard
  if (user?.role === 'MANAGER') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600">Direction & Decision-making - Lead your team</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
            Manager
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Under your management</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Action Plans</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Active plans</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Upcoming tasks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">92%</div>
              <p className="text-xs text-muted-foreground">Team efficiency</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage your team and assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" onClick={() => alert('Opening task assignment interface...')}>
                <Users className="mr-2 h-4 w-4" />
                Assign Tasks
              </Button>
              <Link href="/dashboard/action-plans">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Create Action Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Planning & Scheduling</CardTitle>
              <CardDescription>Plan and schedule team activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/schedules">
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Schedules
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Opening planning interface...')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Strategic Planning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Staff Dashboard
  if (user?.role === 'STAFF') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600">Input & Implementation - Execute tasks and provide input</p>
          </div>
          <Badge className="bg-gray-100 text-gray-800 px-3 py-1">
            Staff
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evidence</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Uploaded this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Manage your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Complete Risk Assessment</p>
                    <p className="text-sm text-gray-600">Due: Tomorrow</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => alert('Opening task details...')}>
                    View Details
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">Upload Evidence</p>
                    <p className="text-sm text-red-600">Overdue: 2 days</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => alert('Opening overdue task...')}>
                    Complete Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence Management</CardTitle>
              <CardDescription>Upload and manage evidence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/dashboard/evidence">
                <Button className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Evidence
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert('Opening issue reporting form...')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fallback for users without specific roles
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your gap analysis system</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Total requirements</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Upcoming tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Plans</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Completed plans</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active risks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}