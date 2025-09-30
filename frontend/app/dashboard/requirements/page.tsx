'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { RoleBasedComponent, ComplianceOfficerOnly, ManagerAndAbove } from '@/components/RoleBasedComponent';
import { useAuth } from '@/contexts/AuthContext';

interface Requirement {
  id: number;
  clause: string;
  subClause?: string;
  title: string;
  description: string;
  category: string;
  standard: string;
  section: string;
  isMandatory: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
  gapAssessments?: unknown[];
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const { user } = useAuth();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  // Form data for creating new requirement
  const [createFormData, setCreateFormData] = useState({
    clause: '',
    subClause: '',
    title: '',
    description: '',
    category: 'ACCESS_CONTROL',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    section: '',
    branchId: 1
  });

  // Form data for editing
  const [formData, setFormData] = useState({
    clause: '',
    subClause: '',
    title: '',
    description: '',
    category: 'ACCESS_CONTROL',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    section: '',
    branchId: 1
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/requirements');
      // setRequirements(response.data);
      
      // Mock data for now
      setRequirements([
        {
          id: 1,
          clause: 'A.9.2.1',
          title: 'User access provisioning',
          description: 'The organization shall control the allocation and use of privileged access rights to information systems and services.',
          category: 'ISO 27001',
          standard: 'ISO 27001:2022',
          section: 'Access Control',
          isMandatory: true,
          priority: 'HIGH',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          gapAssessments: []
        },
        {
          id: 2,
          clause: 'A.9.2.2',
          title: 'User access review',
          description: 'The organization shall review user access rights at regular intervals.',
          category: 'ISO 27001',
          standard: 'ISO 27001:2022',
          section: 'Access Control',
          isMandatory: true,
          priority: 'MEDIUM',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          gapAssessments: []
        }
      ]);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  // View, Edit, Delete, and Create handlers
  const handleViewRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setShowViewModal(true);
  };

  const handleEditRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setFormData({
      clause: requirement.clause,
      subClause: requirement.subClause || '',
      title: requirement.title,
      description: requirement.description,
      category: requirement.category,
      priority: requirement.priority,
      section: requirement.section,
      branchId: 1
    });
    setShowEditModal(true);
  };

  const handleDeleteRequirement = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setShowDeleteModal(true);
  };

  const handleCreateRequirement = () => {
    setShowCreateModal(true);
  };

  const handleCreateInputChange = (field: string, value: any) => {
    setCreateFormData(prev => ({
      ...prev,
      [field]: field === 'priority' ? value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' : value
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'priority' ? value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' : value
    }));
  };

  const handleSubmitCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new requirement object
      const newRequirement: Requirement = {
        id: Date.now(), // Temporary ID
        ...createFormData,
        standard: 'ISO 27001:2022',
        isMandatory: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gapAssessments: []
      };
      
      // Add to requirements list
      setRequirements(prev => [newRequirement, ...prev]);
      
      // Reset form and close modal
      setCreateFormData({
        clause: '',
        subClause: '',
        title: '',
        description: '',
        category: 'ACCESS_CONTROL',
        priority: 'MEDIUM',
        section: '',
        branchId: 1
      });
      setShowCreateModal(false);
      
      alert('Requirement created successfully!');
    } catch (error) {
      console.error('Failed to create requirement:', error);
      alert('Failed to create requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequirement) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update requirement in the list
      setRequirements(prev => prev.map(req => 
        req.id === selectedRequirement.id 
          ? { ...req, ...formData, updatedAt: new Date().toISOString() }
          : req
      ));
      
      setShowEditModal(false);
      setSelectedRequirement(null);
      setFormData({
        clause: '',
        subClause: '',
        title: '',
        description: '',
        category: 'ACCESS_CONTROL',
        priority: 'MEDIUM',
        section: '',
        branchId: 1
      });
      
      alert('Requirement updated successfully!');
    } catch (error) {
      console.error('Failed to update requirement:', error);
      alert('Failed to update requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequirement) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove requirement from list
      setRequirements(prev => prev.filter(req => req.id !== selectedRequirement.id));
      
      setShowDeleteModal(false);
      setSelectedRequirement(null);
      alert(`Requirement deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete requirement:', error);
      alert('Failed to delete requirement. Please try again.');
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedRequirement(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedRequirement(null);
    setFormData({
      clause: '',
      subClause: '',
      title: '',
      description: '',
      category: 'ACCESS_CONTROL',
      priority: 'MEDIUM',
      section: '',
      branchId: 1
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      clause: '',
      subClause: '',
      title: '',
      description: '',
      category: 'ACCESS_CONTROL',
      priority: 'MEDIUM',
      section: '',
      branchId: 1
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRequirement(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.clause.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || req.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

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
            <h1 className="text-2xl font-bold mb-2">Requirements Management</h1>
            <p className="text-blue-100">
              Manage ISO 27001:2022 compliance requirements - <span className="font-semibold">{filteredRequirements.length} requirements</span> found
            </p>
          </div>
          <div className="hidden sm:block">
            <FileText className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requirements</p>
              <p className="text-2xl font-bold text-gray-900">{requirements.length}</p>
              <p className="text-sm text-green-600">+2 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mandatory</p>
              <p className="text-2xl font-bold text-gray-900">{requirements.filter(r => r.isMandatory).length}</p>
              <p className="text-sm text-red-600">Critical priority</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{requirements.filter(r => r.priority === 'HIGH' || r.priority === 'CRITICAL').length}</p>
              <p className="text-sm text-orange-600">Need attention</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-green-600">+5% this month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
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
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300">
                <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Categories</SelectItem>
                <SelectItem value="ISO 27001" className="text-gray-900 hover:bg-gray-100">ISO 27001</SelectItem>
                <SelectItem value="CBK" className="text-gray-900 hover:bg-gray-100">CBK Guidelines</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300">
                <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Priorities</SelectItem>
                <SelectItem value="CRITICAL" className="text-gray-900 hover:bg-gray-100">Critical</SelectItem>
                <SelectItem value="HIGH" className="text-gray-900 hover:bg-gray-100">High</SelectItem>
                <SelectItem value="MEDIUM" className="text-gray-900 hover:bg-gray-100">Medium</SelectItem>
                <SelectItem value="LOW" className="text-gray-900 hover:bg-gray-100">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchRequirements}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Grid */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          <ComplianceOfficerOnly>
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateRequirement}
            >
              <Plus className="h-4 w-4" />
              Add Requirement
            </Button>
          </ComplianceOfficerOnly>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequirements.map((requirement) => (
            <div key={requirement.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{requirement.clause}</h3>
                  <p className="text-sm text-gray-600">{requirement.title}</p>
                </div>
                <Badge className={getPriorityColor(requirement.priority)}>
                  {requirement.priority}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {requirement.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Section:</span>
                  <span className="font-medium">{requirement.section}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Standard:</span>
                  <span className="font-medium">{requirement.standard}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mandatory:</span>
                  <span className="font-medium">
                    {requirement.isMandatory ? (
                      <span className="text-red-600">Yes</span>
                    ) : (
                      <span className="text-green-600">No</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                    onClick={() => handleViewRequirement(requirement)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <ComplianceOfficerOnly>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEditRequirement(requirement)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </ComplianceOfficerOnly>
                <ComplianceOfficerOnly>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteRequirement(requirement)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ComplianceOfficerOnly>
              </div>
            </div>
          ))}
        </div>

        {filteredRequirements.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by adding your first requirement.'}
            </p>
            <ComplianceOfficerOnly>
              <Button
                onClick={handleCreateRequirement}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </ComplianceOfficerOnly>
          </div>
        )}
      </div>

      {/* Create Requirement Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Requirement</DialogTitle>
            <DialogDescription>
              Add a new compliance requirement to your organization's framework.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitCreateRequirement} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-clause">Clause</Label>
                <Input
                  id="create-clause"
                  value={createFormData.clause}
                  onChange={(e) => handleCreateInputChange('clause', e.target.value)}
                  placeholder="e.g., A.9.2.1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-subClause">Sub-clause (Optional)</Label>
                <Input
                  id="create-subClause"
                  value={createFormData.subClause}
                  onChange={(e) => handleCreateInputChange('subClause', e.target.value)}
                  placeholder="e.g., A.9.2.1.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-title">Title</Label>
              <Input
                id="create-title"
                value={createFormData.title}
                onChange={(e) => handleCreateInputChange('title', e.target.value)}
                placeholder="Enter requirement title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={createFormData.description}
                onChange={(e) => handleCreateInputChange('description', e.target.value)}
                placeholder="Describe the requirement in detail"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-category">Category</Label>
                <Select 
                  value={createFormData.category} 
                  onValueChange={(value) => handleCreateInputChange('category', value)}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="ACCESS_CONTROL" className="text-gray-900 hover:bg-gray-100">Access Control</SelectItem>
                    <SelectItem value="INFORMATION_SECURITY" className="text-gray-900 hover:bg-gray-100">Information Security</SelectItem>
                    <SelectItem value="RISK_MANAGEMENT" className="text-gray-900 hover:bg-gray-100">Risk Management</SelectItem>
                    <SelectItem value="COMPLIANCE" className="text-gray-900 hover:bg-gray-100">Compliance</SelectItem>
                    <SelectItem value="AUDIT" className="text-gray-900 hover:bg-gray-100">Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-priority">Priority</Label>
                <Select 
                  value={createFormData.priority} 
                  onValueChange={(value) => handleCreateInputChange('priority', value)}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="LOW" className="text-gray-900 hover:bg-gray-100">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="text-gray-900 hover:bg-gray-100">Medium</SelectItem>
                    <SelectItem value="HIGH" className="text-gray-900 hover:bg-gray-100">High</SelectItem>
                    <SelectItem value="CRITICAL" className="text-gray-900 hover:bg-gray-100">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-section">Section</Label>
              <Input
                id="create-section"
                value={createFormData.section}
                onChange={(e) => handleCreateInputChange('section', e.target.value)}
                placeholder="e.g., Access Control"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseCreateModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Requirement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Requirement Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Requirement Details</DialogTitle>
            <DialogDescription>
              View detailed information about this compliance requirement.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequirement && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Clause</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedRequirement.clause}
                  {selectedRequirement.subClause && `.${selectedRequirement.subClause}`}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedRequirement.title}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedRequirement.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Category</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedRequirement.category}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Priority</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedRequirement.priority)}>
                      {selectedRequirement.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Section</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedRequirement.section}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Standard</Label>
                  <p className="text-sm text-gray-900">
                    {selectedRequirement.standard}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Mandatory</Label>
                  <p className="text-sm text-gray-900">
                    {selectedRequirement.isMandatory ? 'Yes' : 'No'}
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

      {/* Edit Requirement Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Requirement</DialogTitle>
            <DialogDescription>
              Update the compliance requirement information.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateRequirement} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-clause">Clause</Label>
                <Input
                  id="edit-clause"
                  value={formData.clause}
                  onChange={(e) => handleInputChange('clause', e.target.value)}
                  placeholder="e.g., A.9.2.1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-subClause">Sub-clause (Optional)</Label>
                <Input
                  id="edit-subClause"
                  value={formData.subClause}
                  onChange={(e) => handleInputChange('subClause', e.target.value)}
                  placeholder="e.g., A.9.2.1.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter requirement title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the requirement in detail"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="ACCESS_CONTROL" className="text-gray-900 hover:bg-gray-100">Access Control</SelectItem>
                    <SelectItem value="INFORMATION_SECURITY" className="text-gray-900 hover:bg-gray-100">Information Security</SelectItem>
                    <SelectItem value="RISK_MANAGEMENT" className="text-gray-900 hover:bg-gray-100">Risk Management</SelectItem>
                    <SelectItem value="COMPLIANCE" className="text-gray-900 hover:bg-gray-100">Compliance</SelectItem>
                    <SelectItem value="AUDIT" className="text-gray-900 hover:bg-gray-100">Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="LOW" className="text-gray-900 hover:bg-gray-100">Low</SelectItem>
                    <SelectItem value="MEDIUM" className="text-gray-900 hover:bg-gray-100">Medium</SelectItem>
                    <SelectItem value="HIGH" className="text-gray-900 hover:bg-gray-100">High</SelectItem>
                    <SelectItem value="CRITICAL" className="text-gray-900 hover:bg-gray-100">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-section">Section</Label>
              <Input
                id="edit-section"
                value={formData.section}
                onChange={(e) => handleInputChange('section', e.target.value)}
                placeholder="e.g., Access Control"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Requirement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Requirement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this requirement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequirement && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Requirement to be deleted:</span>
                </div>
                <p className="text-sm text-red-700 font-medium">
                  {selectedRequirement.clause} - {selectedRequirement.title}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Category: {selectedRequirement.category} | 
                  Priority: {selectedRequirement.priority}
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
              Delete Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
