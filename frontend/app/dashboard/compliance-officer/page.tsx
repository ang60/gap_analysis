'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  AlertTriangle, 
  CheckCircle,
  Shield,
  Target,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import Link from 'next/link';

export default function ComplianceOfficerDashboard() {
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
          <p className="mt-2 text-gray-600">Loading Compliance Officer Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedComponent allowedRoles={['COMPLIANCE_OFFICER']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Officer Dashboard</h1>
            <p className="text-gray-600">Oversight & Regulatory Assurance - Ensure compliance excellence</p>
          </div>
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Shield className="h-4 w-4 mr-1" />
            Compliance Officer
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requirements Created</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">
                +5 this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gap Assessments</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                3 pending review
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Assessments</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                2 high priority
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                Above target
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Officer Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Create Compliance Requirements
              </CardTitle>
              <CardDescription>
                Create compliance requirements based on regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">New Requirements</span>
                  </div>
                  <Link href="/dashboard/requirements">
                    <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                      Create New
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Draft Requirements</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    5 Drafts
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Perform Gap Analysis
              </CardTitle>
              <CardDescription>
                Identify compliance issues and gaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium">Gap Analysis</span>
                  </div>
                  <Link href="/dashboard/gap-assessments">
                    <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                      Start Analysis
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium">Critical Gaps</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    3 Critical
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment & Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Risk Assessment
              </CardTitle>
              <CardDescription>
                Assess risks and create risk assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium">Risk Assessment</span>
                  </div>
                  <Link href="/dashboard/risks">
                    <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                      Assess Risks
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium">High Risk Items</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    2 High Risk
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Compliance Verification
              </CardTitle>
              <CardDescription>
                Verify that compliance has been achieved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Verification Status</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    85% Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Pending Verification</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    4 Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common compliance tasks and tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Regulatory Updates</h4>
                <p className="text-sm text-gray-600 mb-3">Check for new regulatory requirements</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Check for regulatory updates
                    alert('Checking for regulatory updates... (This would fetch latest regulatory changes)');
                  }}
                >
                  Check Updates
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Compliance Reports</h4>
                <p className="text-sm text-gray-600 mb-3">Generate compliance status reports</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Generate compliance report
                    alert('Generating compliance report... (This would create and download a PDF report)');
                  }}
                >
                  Generate Report
                </Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Audit Trail</h4>
                <p className="text-sm text-gray-600 mb-3">Review compliance audit history</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Navigate to audit trail page
                    window.location.href = '/dashboard/audit-trail';
                  }}
                >
                  View Audit Trail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedComponent>
  );
}
