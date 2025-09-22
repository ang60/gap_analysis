'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface GapAssessment {
  id: number;
  status: number; // 0-3 scale: 0=Not Implemented, 1=Partially, 2=Mostly, 3=Fully
  description: string;
  evidenceLink?: string;
  riskScore: number; // 0-3 scale
  requirementId: number;
  branchId: number;
  createdAt: string;
  updatedAt: string;
  requirement?: {
    id: number;
    clause: string;
    title: string;
    section: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

export default function GapAnalysisPage() {
  const [assessments, setAssessments] = useState<GapAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/gap-assessments');
      // setAssessments(response.data);
      
      // Mock data for now
      setAssessments([
        {
          id: 1,
          status: 2,
          description: 'Multi-factor authentication is partially implemented. Some systems have MFA enabled but not all user accounts.',
          evidenceLink: 'https://docs.company.com/mfa-implementation',
          riskScore: 2,
          requirementId: 1,
          branchId: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          requirement: {
            id: 1,
            clause: 'A.9.2.1',
            title: 'User access provisioning',
            section: 'Access Control'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          }
        },
        {
          id: 2,
          status: 0,
          description: 'No formal access review process is currently in place. User access rights are not regularly reviewed.',
          riskScore: 3,
          requirementId: 2,
          branchId: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          requirement: {
            id: 2,
            clause: 'A.9.2.2',
            title: 'User access review',
            section: 'Access Control'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: return { label: 'Not Implemented', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 1: return { label: 'Partially', color: 'bg-orange-100 text-orange-800', icon: Clock };
      case 2: return { label: 'Mostly', color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp };
      case 3: return { label: 'Fully', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getRiskInfo = (riskScore: number) => {
    switch (riskScore) {
      case 0: return { label: 'Low', color: 'bg-green-100 text-green-800' };
      case 1: return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
      case 2: return { label: 'High', color: 'bg-orange-100 text-orange-800' };
      case 3: return { label: 'Critical', color: 'bg-red-100 text-red-800' };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStatusProgress = (status: number) => {
    return (status / 3) * 100;
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.requirement?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.requirement?.clause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assessment.status.toString() === filterStatus;
    const matchesRisk = filterRisk === 'all' || assessment.riskScore.toString() === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const overallCompliance = assessments.length > 0 
    ? (assessments.reduce((sum, a) => sum + a.status, 0) / (assessments.length * 3)) * 100 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gap Analysis</h1>
            <p className="text-blue-100">
              Assess compliance gaps and track implementation progress - <span className="font-semibold">{overallCompliance.toFixed(1)}% overall compliance</span>
            </p>
          </div>
          <div className="hidden sm:block">
            <CheckSquare className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{overallCompliance.toFixed(1)}%</p>
              <p className="text-sm text-green-600">+3% this month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
              <p className="text-sm text-blue-600">{assessments.filter(a => a.status === 3).length} fully implemented</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Items</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.filter(a => a.riskScore >= 2).length}</p>
              <p className="text-sm text-red-600">Require attention</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Not Implemented</p>
              <p className="text-2xl font-bold text-gray-900">{assessments.filter(a => a.status === 0).length}</p>
              <p className="text-sm text-orange-600">Need implementation</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                 placeholder="Search assessments..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10"
               />
            </div>
             <Select value={filterStatus} onValueChange={setFilterStatus}>
               <SelectTrigger>
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="0">Not Implemented</SelectItem>
                 <SelectItem value="1">Partially</SelectItem>
                 <SelectItem value="2">Mostly</SelectItem>
                 <SelectItem value="3">Fully</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterRisk} onValueChange={setFilterRisk}>
               <SelectTrigger>
                 <SelectValue placeholder="Risk Level" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Risk Levels</SelectItem>
                 <SelectItem value="0">Low</SelectItem>
                 <SelectItem value="1">Medium</SelectItem>
                 <SelectItem value="2">High</SelectItem>
                 <SelectItem value="3">Critical</SelectItem>
               </SelectContent>
             </Select>
             <Button variant="outline" onClick={fetchAssessments}>
               Refresh
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assessments List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Gap Assessments</h2>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => {
            const statusInfo = getStatusInfo(assessment.status);
            const riskInfo = getRiskInfo(assessment.riskScore);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={assessment.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {assessment.requirement?.clause} - {assessment.requirement?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {assessment.requirement?.section} • {assessment.branch?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                    <Badge className={riskInfo.color}>
                      {riskInfo.label} Risk
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    {assessment.description}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Implementation Progress</span>
                        <span>{getStatusProgress(assessment.status).toFixed(0)}%</span>
                      </div>
                      <Progress value={getStatusProgress(assessment.status)} />
                    </div>
                  </div>
                  
                  {assessment.evidenceLink && (
                    <div className="text-sm">
                      <span className="text-gray-500">Evidence: </span>
                      <a 
                        href={assessment.evidenceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Documentation
                      </a>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Update Assessment
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterRisk !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first gap assessment.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
