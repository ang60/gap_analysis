'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  UserPlus,
  Bell,
  Upload,
  X,
  Edit,
  Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Modal states for staff dashboard
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showIssueReport, setShowIssueReport] = useState(false);
  const [showDocumentManagement, setShowDocumentManagement] = useState(false);
  const [showComplianceChecklist, setShowComplianceChecklist] = useState(false);
  const [showTimeTracking, setShowTimeTracking] = useState(false);
  const [showProgressUpdate, setShowProgressUpdate] = useState(false);
  const [showTrainingMaterials, setShowTrainingMaterials] = useState(false);
  const [showTeamChat, setShowTeamChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showPerformanceReport, setShowPerformanceReport] = useState(false);
  const [showComplianceReport, setShowComplianceReport] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  // Form states
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issuePriority, setIssuePriority] = useState('');
  const [progressComment, setProgressComment] = useState('');
  const [timeEntry, setTimeEntry] = useState('');
  const [timeDescription, setTimeDescription] = useState('');

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
                  <Button size="sm" variant="outline" onClick={() => setShowTaskDetails(true)}>
                    View Details
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">Upload Evidence</p>
                    <p className="text-sm text-red-600">Overdue: 2 days</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => setShowDocumentUpload(true)}>
                    Complete Now
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Update Compliance Status</p>
                    <p className="text-sm text-green-600">Due: Next week</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => setShowStatusUpdate(true)}>
                    Update Status
                  </Button>
                </div>
      </div>

              <div className="pt-4 border-t">
                <Button 
                  className="w-full" 
                  onClick={() => setShowAllTasks(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  View All Tasks
                </Button>
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Evidence Management</CardTitle>
              <CardDescription>Upload and manage evidence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                onClick={() => setShowDocumentUpload(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Evidence
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowIssueReport(true)}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Issue
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowDocumentManagement(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Documents
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowComplianceChecklist(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Compliance Checklist
              </Button>
            </CardContent>
          </Card>
                </div>

        {/* Additional Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowTimeTracking(true)}
              >
                <Clock className="mr-2 h-4 w-4" />
                Time Tracking
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowProgressUpdate(true)}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Update Progress
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowTrainingMaterials(true)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Training Materials
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
              <CardDescription>Stay connected with your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowTeamChat(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Team Chat
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowHelpCenter(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Help Center
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Track your performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowPerformanceReport(true)}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Performance Report
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowComplianceReport(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Compliance Report
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowAchievements(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Achievements
              </Button>
            </CardContent>
          </Card>
              </div>

        {/* Task Details Modal */}
        <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>
                Complete Risk Assessment - Due Tomorrow
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-white">Priority</Label>
                  <div className="p-2 bg-red-100 text-red-800 rounded-md text-sm font-medium">High</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-white">Status</Label>
                  <div className="p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">In Progress</div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-white">Description</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-900">
                  Review and assess potential risks in the current system implementation. 
                  Identify vulnerabilities, evaluate impact, and recommend mitigation strategies.
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-white">Requirements</Label>
                <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-white">
                  <li>Review system architecture documentation</li>
                  <li>Identify potential security vulnerabilities</li>
                  <li>Assess business impact of identified risks</li>
                  <li>Document findings and recommendations</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTaskDetails(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowTaskDetails(false);
                alert('Task marked as started!');
              }}>
                Start Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document Upload Modal */}
        <Dialog open={showDocumentUpload} onOpenChange={setShowDocumentUpload}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Evidence</DialogTitle>
              <DialogDescription>
                Upload required documents for your overdue task
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload" className="text-sm font-medium text-white">Select Files</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setUploadFiles(files);
                  }}
                  className="mt-1"
                />
                {uploadFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    <ul className="list-disc list-inside text-sm text-gray-900">
                      {uploadFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
        </div>
                )}
      </div>
              <div>
                <Label htmlFor="upload-description" className="text-sm font-medium text-white">Description</Label>
                <Textarea
                  id="upload-description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Describe the evidence being uploaded..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="upload-type" className="text-sm font-medium text-white">Evidence Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select evidence type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDocumentUpload(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowDocumentUpload(false);
                alert('Documents uploaded successfully!');
                setUploadFiles([]);
                setUploadDescription('');
                setUploadType('');
              }}>
                Upload Files
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Update Modal */}
        <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Compliance Status</DialogTitle>
              <DialogDescription>
                Update the current compliance status for your assigned requirements
              </DialogDescription>
            </DialogHeader>
          <div className="space-y-4">
              <div>
                <Label htmlFor="status-update" className="text-sm font-medium text-white">Status Update</Label>
                <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="needs-review">Needs Review</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              <div>
                <Label htmlFor="status-comment" className="text-sm font-medium text-white">Comments</Label>
                <Textarea
                  id="status-comment"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  placeholder="Add any additional comments about the status update..."
                  rows={3}
                />
                </div>
              </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusUpdate(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowStatusUpdate(false);
                alert('Status updated successfully!');
                setStatusUpdate('');
              }}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* All Tasks Modal */}
        <Dialog open={showAllTasks} onOpenChange={setShowAllTasks}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>All Tasks</DialogTitle>
              <DialogDescription>
                View and manage all your assigned tasks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">Complete Risk Assessment</h4>
                      <p className="text-sm text-white">Due: Tomorrow</p>
                      <p className="text-sm text-red-600">Priority: High</p>
          </div>
                    <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">Upload Evidence</h4>
                      <p className="text-sm text-red-600">Overdue: 2 days</p>
                      <p className="text-sm text-red-600">Priority: Critical</p>
                    </div>
                    <Button size="sm" variant="outline">Complete Now</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">Update Compliance Status</h4>
                      <p className="text-sm text-white">Due: Next week</p>
                      <p className="text-sm text-green-600">Priority: Medium</p>
                    </div>
                    <Button size="sm" variant="outline">Update Status</Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAllTasks(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Issue Report Modal */}
        <Dialog open={showIssueReport} onOpenChange={setShowIssueReport}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Report Issue</DialogTitle>
              <DialogDescription>
                Report a problem or concern to your management team
              </DialogDescription>
            </DialogHeader>
          <div className="space-y-4">
              <div>
                <Label htmlFor="issue-type" className="text-sm font-medium text-white">Issue Type</Label>
                <Select value={issueType} onValueChange={setIssueType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="compliance">Compliance Concern</SelectItem>
                    <SelectItem value="process">Process Problem</SelectItem>
                    <SelectItem value="resource">Resource Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="issue-priority" className="text-sm font-medium text-white">Priority</Label>
                <Select value={issuePriority} onValueChange={setIssuePriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="issue-description" className="text-sm font-medium text-white">Description</Label>
                <Textarea
                  id="issue-description"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                />
              </div>
          </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowIssueReport(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowIssueReport(false);
                alert('Issue reported successfully!');
                setIssueType('');
                setIssuePriority('');
                setIssueDescription('');
              }}>
                Submit Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document Management Modal */}
        <Dialog open={showDocumentManagement} onOpenChange={setShowDocumentManagement}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Document Management</DialogTitle>
              <DialogDescription>
                View and manage your uploaded documents
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-white">Risk Assessment Report.pdf</p>
                      <p className="text-sm text-white">Uploaded 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-white">Compliance Evidence.docx</p>
                      <p className="text-sm text-white">Uploaded 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDocumentManagement(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Compliance Checklist Modal */}
        <Dialog open={showComplianceChecklist} onOpenChange={setShowComplianceChecklist}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Compliance Checklist</DialogTitle>
              <DialogDescription>
                Review and update your compliance requirements
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-white">Access Control Review</p>
                      <p className="text-sm text-white">Due: Completed</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-white">Security Policy Update</p>
                      <p className="text-sm text-white">Due: In Progress</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-white">Risk Assessment</p>
                      <p className="text-sm text-red-600">Due: Overdue</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowComplianceChecklist(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Time Tracking Modal */}
        <Dialog open={showTimeTracking} onOpenChange={setShowTimeTracking}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Time Tracking</DialogTitle>
              <DialogDescription>
                Track your time spent on different activities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="time-entry" className="text-sm font-medium text-white">Time Spent (hours)</Label>
                <Input
                  id="time-entry"
                  type="number"
                  value={timeEntry}
                  onChange={(e) => setTimeEntry(e.target.value)}
                  placeholder="Enter hours worked"
                />
              </div>
              <div>
                <Label htmlFor="time-description" className="text-sm font-medium text-white">Activity Description</Label>
                <Textarea
                  id="time-description"
                  value={timeDescription}
                  onChange={(e) => setTimeDescription(e.target.value)}
                  placeholder="Describe what you worked on..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTimeTracking(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowTimeTracking(false);
                alert('Time entry logged successfully!');
                setTimeEntry('');
                setTimeDescription('');
              }}>
                Log Time
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Progress Update Modal */}
        <Dialog open={showProgressUpdate} onOpenChange={setShowProgressUpdate}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
              <DialogDescription>
                Update your task progress and share with your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="progress-comment" className="text-sm font-medium text-white">Progress Update</Label>
                <Textarea
                  id="progress-comment"
                  value={progressComment}
                  onChange={(e) => setProgressComment(e.target.value)}
                  placeholder="Describe your progress and any updates..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProgressUpdate(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowProgressUpdate(false);
                alert('Progress updated successfully!');
                setProgressComment('');
              }}>
                Update Progress
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Training Materials Modal */}
        <Dialog open={showTrainingMaterials} onOpenChange={setShowTrainingMaterials}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Training Materials</DialogTitle>
              <DialogDescription>
                Access compliance training and professional development resources
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-white">Compliance Fundamentals</h4>
                  <p className="text-sm text-white">Basic compliance training module</p>
                  <Button size="sm" className="mt-2">Start Training</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-white">Risk Management Guide</h4>
                  <p className="text-sm text-white">Downloadable PDF guide</p>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-white">Security Best Practices</h4>
                  <p className="text-sm text-white">Video tutorial series</p>
                  <Button size="sm" className="mt-2">Watch Videos</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTrainingMaterials(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Chat Modal */}
        <Dialog open={showTeamChat} onOpenChange={setShowTeamChat}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Team Chat</DialogTitle>
              <DialogDescription>
                Communicate with your team members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="h-64 border rounded-lg p-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs">
                      <p className="text-sm">Hi team, I've completed the risk assessment task.</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border p-2 rounded-lg max-w-xs">
                      <p className="text-sm">Great work! Please upload the evidence.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input placeholder="Type your message..." />
                <Button>Send</Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTeamChat(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notifications Modal */}
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                View your recent notifications and updates
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                  <p className="font-medium text-red-800">Urgent: Upload Evidence</p>
                  <p className="text-sm text-red-600">Task is overdue by 2 days</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <p className="font-medium text-blue-800">New Task Assigned</p>
                  <p className="text-sm text-blue-600">Complete Risk Assessment</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50 rounded">
                  <p className="font-medium text-green-800">Task Completed</p>
                  <p className="text-sm text-green-600">Access Control Review</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotifications(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Help Center Modal */}
        <Dialog open={showHelpCenter} onOpenChange={setShowHelpCenter}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Help Center</DialogTitle>
              <DialogDescription>
                Get help and support for your tasks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-white">How to upload evidence?</h4>
                  <p className="text-sm text-white">Step-by-step guide for document upload</p>
                  <Button size="sm" variant="outline" className="mt-2">View Guide</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-white">Compliance requirements</h4>
                  <p className="text-sm text-white">Understanding your compliance obligations</p>
                  <Button size="sm" variant="outline" className="mt-2">Learn More</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-white">Contact Support</h4>
                  <p className="text-sm text-white">Get direct help from our support team</p>
                  <Button size="sm" className="mt-2">Contact Us</Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowHelpCenter(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Performance Report Modal */}
        <Dialog open={showPerformanceReport} onOpenChange={setShowPerformanceReport}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Performance Report</DialogTitle>
              <DialogDescription>
                View your performance metrics and productivity data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <p className="text-sm text-white">Task Completion Rate</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">32</div>
                  <p className="text-sm text-white">Hours This Week</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <p className="text-sm text-white">Tasks Completed</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <p className="text-sm text-white">Overdue Tasks</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPerformanceReport(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Compliance Report Modal */}
        <Dialog open={showComplianceReport} onOpenChange={setShowComplianceReport}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Compliance Report</DialogTitle>
              <DialogDescription>
                View your compliance status and progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-white">Access Control</p>
                    <p className="text-sm text-white">100% Complete</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Complete</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-white">Security Policy</p>
                    <p className="text-sm text-white">75% Complete</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-white">Risk Assessment</p>
                    <p className="text-sm text-white">0% Complete</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Not Started</Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowComplianceReport(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Achievements Modal */}
        <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Achievements</DialogTitle>
              <DialogDescription>
                View your earned badges and accomplishments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="font-medium">First Task</p>
                  <p className="text-sm text-white">Completed your first task</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium">Document Master</p>
                  <p className="text-sm text-white">Uploaded 10 documents</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-medium">Goal Achiever</p>
                  <p className="text-sm text-white">Met weekly targets</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-medium">Compliance Star</p>
                  <p className="text-sm text-white">Perfect compliance record</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAchievements(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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