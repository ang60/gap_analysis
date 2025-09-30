'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  // Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<GapAssessment | null>(null);

  // Form data for editing
  const [formData, setFormData] = useState({
    status: 0,
    description: '',
    evidenceLink: '',
    riskScore: 0
  });

  // Form data for creating new assessment
  const [createFormData, setCreateFormData] = useState({
    requirementId: 1,
    branchId: 1,
    status: 0,
    description: '',
    evidenceLink: '',
    riskScore: 0
  });

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

  // View, Edit, and Delete handlers
  const handleViewAssessment = (assessment: GapAssessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleEditAssessment = (assessment: GapAssessment) => {
    setSelectedAssessment(assessment);
    setFormData({
      status: assessment.status,
      description: assessment.description,
      evidenceLink: assessment.evidenceLink || '',
      riskScore: assessment.riskScore
    });
    setShowEditModal(true);
  };

  const handleDeleteAssessment = (assessment: GapAssessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteModal(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update assessment in the list
      setAssessments(prev => prev.map(assessment => 
        assessment.id === selectedAssessment.id 
          ? { ...assessment, ...formData, updatedAt: new Date().toISOString() }
          : assessment
      ));
      
      setShowEditModal(false);
      setSelectedAssessment(null);
      setFormData({
        status: 0,
        description: '',
        evidenceLink: '',
        riskScore: 0
      });
      
      alert('Assessment updated successfully!');
    } catch (error) {
      console.error('Failed to update assessment:', error);
      alert('Failed to update assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAssessment) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove assessment from list
      setAssessments(prev => prev.filter(assessment => assessment.id !== selectedAssessment.id));
      
      setShowDeleteModal(false);
      setSelectedAssessment(null);
      alert(`Assessment deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      alert('Failed to delete assessment. Please try again.');
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedAssessment(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAssessment(null);
    setFormData({
      status: 0,
      description: '',
      evidenceLink: '',
      riskScore: 0
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAssessment(null);
  };

  // Create new assessment handlers
  const handleCreateAssessment = () => {
    console.log('Create assessment button clicked');
    setShowCreateModal(true);
  };

  const handleCreateInputChange = (field: string, value: any) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new assessment object
      const newAssessment: GapAssessment = {
        id: Date.now(), // Temporary ID
        ...createFormData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requirement: {
          id: createFormData.requirementId,
          clause: 'A.9.2.1', // Mock requirement data
          title: 'User Access Control',
          section: 'Access Control'
        },
        branch: {
          id: createFormData.branchId,
          name: 'Head Office'
        }
      };
      
      // Add to assessments list
      setAssessments(prev => [newAssessment, ...prev]);
      
      // Reset form and close modal
      setCreateFormData({
        requirementId: 1,
        branchId: 1,
        status: 0,
        description: '',
        evidenceLink: '',
        riskScore: 0
      });
      setShowCreateModal(false);
      
      alert('Assessment created successfully!');
    } catch (error) {
      console.error('Failed to create assessment:', error);
      alert('Failed to create assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      requirementId: 1,
      branchId: 1,
      status: 0,
      description: '',
      evidenceLink: '',
      riskScore: 0
    });
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
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleCreateAssessment}
          >
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewAssessment(assessment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditAssessment(assessment)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update Assessment
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteAssessment(assessment)}
                    >
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
            <Button onClick={handleCreateAssessment}>
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>
        )}
      </div>

      {/* Create Assessment Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
            <DialogDescription>
              Create a new gap assessment for a specific requirement.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitCreateAssessment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-requirementId">Requirement</Label>
                <Select 
                  value={createFormData.requirementId.toString()} 
                  onValueChange={(value) => handleCreateInputChange('requirementId', parseInt(value))}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select requirement" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">A.9.2.1 - User Access Control</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">A.9.2.2 - User Access Review</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">A.9.2.3 - Privileged Access Management</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">A.9.2.4 - Access Rights Review</SelectItem>
                    <SelectItem value="5" className="text-gray-900 hover:bg-gray-100">A.9.2.5 - Access Rights Removal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-branchId">Branch</Label>
                <Select 
                  value={createFormData.branchId.toString()} 
                  onValueChange={(value) => handleCreateInputChange('branchId', parseInt(value))}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">Head Office</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">Branch A</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">Branch B</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">Branch C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-status">Implementation Status</Label>
              <Select 
                value={createFormData.status.toString()} 
                onValueChange={(value) => handleCreateInputChange('status', parseInt(value))}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="0" className="text-gray-900 hover:bg-gray-100">0 - Not Implemented</SelectItem>
                  <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Partially Implemented</SelectItem>
                  <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Mostly Implemented</SelectItem>
                  <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - Fully Implemented</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Assessment Description</Label>
              <Textarea
                id="create-description"
                value={createFormData.description}
                onChange={(e) => handleCreateInputChange('description', e.target.value)}
                placeholder="Describe the current implementation status of this requirement"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-evidenceLink">Evidence Link (Optional)</Label>
              <Input
                id="create-evidenceLink"
                type="url"
                value={createFormData.evidenceLink}
                onChange={(e) => handleCreateInputChange('evidenceLink', e.target.value)}
                placeholder="https://example.com/evidence"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-riskScore">Risk Score</Label>
              <Select 
                value={createFormData.riskScore.toString()} 
                onValueChange={(value) => handleCreateInputChange('riskScore', parseInt(value))}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select risk score" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="0" className="text-gray-900 hover:bg-gray-100">0 - No Risk</SelectItem>
                  <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Low Risk</SelectItem>
                  <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Medium Risk</SelectItem>
                  <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseCreateModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Assessment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Assessment Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
            <DialogDescription>
              View detailed information about this gap assessment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssessment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Requirement</Label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedAssessment.requirement?.clause} - {selectedAssessment.requirement?.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Section: {selectedAssessment.requirement?.section}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Assessment Description</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedAssessment.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Implementation Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusInfo(selectedAssessment.status).color}>
                      {getStatusInfo(selectedAssessment.status).label}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ({selectedAssessment.status}/3)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Risk Score</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskInfo(selectedAssessment.riskScore).color}>
                      {getRiskInfo(selectedAssessment.riskScore).label}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      ({selectedAssessment.riskScore}/3)
                    </span>
                  </div>
                </div>
              </div>

              {selectedAssessment.evidenceLink && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Evidence Link</Label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <a 
                      href={selectedAssessment.evidenceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {selectedAssessment.evidenceLink}
                    </a>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Branch</Label>
                  <p className="text-sm text-gray-900">
                    {selectedAssessment.branch?.name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedAssessment.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assessment Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Assessment</DialogTitle>
            <DialogDescription>
              Update the gap assessment information and status.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateAssessment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Implementation Status</Label>
              <Select 
                value={formData.status.toString()} 
                onValueChange={(value) => handleInputChange('status', parseInt(value))}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="0" className="text-gray-900 hover:bg-gray-100">0 - Not Implemented</SelectItem>
                  <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Partially Implemented</SelectItem>
                  <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Mostly Implemented</SelectItem>
                  <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - Fully Implemented</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Assessment Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the current implementation status"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-evidenceLink">Evidence Link (Optional)</Label>
              <Input
                id="edit-evidenceLink"
                type="url"
                value={formData.evidenceLink}
                onChange={(e) => handleInputChange('evidenceLink', e.target.value)}
                placeholder="https://example.com/evidence"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-riskScore">Risk Score</Label>
              <Select 
                value={formData.riskScore.toString()} 
                onValueChange={(value) => handleInputChange('riskScore', parseInt(value))}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select risk score" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="0" className="text-gray-900 hover:bg-gray-100">0 - No Risk</SelectItem>
                  <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Low Risk</SelectItem>
                  <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Medium Risk</SelectItem>
                  <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Assessment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Assessment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this gap assessment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssessment && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Assessment to be deleted:</span>
                </div>
                <p className="text-sm text-red-700 font-medium">
                  {selectedAssessment.requirement?.clause} - {selectedAssessment.requirement?.title}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Status: {getStatusInfo(selectedAssessment.status).label} | 
                  Risk: {getRiskInfo(selectedAssessment.riskScore).label}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
