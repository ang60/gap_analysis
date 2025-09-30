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
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent, ManagerAndAbove, ComplianceOfficerOnly } from '@/components/RoleBasedComponent';

interface ActionPlan {
  id: number;
  actionText: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deadline?: string;
  completionNotes?: string;
  completedAt?: string;
  gapId: number;
  responsibleId: number;
  requirementId: number;
  createdAt: string;
  updatedAt: string;
  gap?: {
    id: number;
    description: string;
    requirement: {
      id: number;
      clause: string;
      title: string;
    };
  };
  responsible?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  requirement?: {
    id: number;
    clause: string;
    title: string;
  };
}

export default function ActionPlansPage() {
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const { user } = useAuth();

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActionPlan, setSelectedActionPlan] = useState<ActionPlan | null>(null);

  // Form states
  const [editFormData, setEditFormData] = useState({
    actionText: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    status: 'PENDING' as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    deadline: '',
    completionNotes: ''
  });

  const [createFormData, setCreateFormData] = useState({
    actionText: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    deadline: '',
    responsibleId: 1,
    requirementId: 1
  });

  const [completeFormData, setCompleteFormData] = useState({
    completionNotes: ''
  });

  useEffect(() => {
    fetchActionPlans();
  }, []);

  // Modal handlers
  const handleViewActionPlan = (actionPlan: ActionPlan) => {
    setSelectedActionPlan(actionPlan);
    setShowViewModal(true);
  };

  const handleEditActionPlan = (actionPlan: ActionPlan) => {
    setSelectedActionPlan(actionPlan);
    setEditFormData({
      actionText: actionPlan.actionText,
      priority: actionPlan.priority,
      status: actionPlan.status,
      deadline: actionPlan.deadline ? new Date(actionPlan.deadline).toISOString().split('T')[0] : '',
      completionNotes: actionPlan.completionNotes || ''
    });
    setShowEditModal(true);
  };

  const handleCompleteActionPlan = (actionPlan: ActionPlan) => {
    setSelectedActionPlan(actionPlan);
    setCompleteFormData({ completionNotes: '' });
    setShowCompleteModal(true);
  };

  const handleDeleteActionPlan = (actionPlan: ActionPlan) => {
    setSelectedActionPlan(actionPlan);
    setShowDeleteModal(true);
  };

  const handleCreateActionPlan = () => {
    setCreateFormData({
      actionText: '',
      priority: 'MEDIUM',
      deadline: '',
      responsibleId: 1,
      requirementId: 1
    });
    setShowCreateModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedActionPlan(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedActionPlan(null);
    setEditFormData({
      actionText: '',
      priority: 'MEDIUM',
      status: 'PENDING',
      deadline: '',
      completionNotes: ''
    });
  };

  const handleCloseCompleteModal = () => {
    setShowCompleteModal(false);
    setSelectedActionPlan(null);
    setCompleteFormData({ completionNotes: '' });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedActionPlan(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({
      actionText: '',
      priority: 'MEDIUM',
      deadline: '',
      responsibleId: 1,
      requirementId: 1
    });
  };

  const handleUpdateActionPlan = async () => {
    if (!selectedActionPlan) return;
    
    try {
      // TODO: Replace with actual API call
      // await api.put(`/action-plans/${selectedActionPlan.id}`, editFormData);
      
      // Mock update
      setActionPlans(prev => prev.map(plan => 
        plan.id === selectedActionPlan.id 
          ? { ...plan, ...editFormData, updatedAt: new Date().toISOString() }
          : plan
      ));
      
      alert('Action plan updated successfully!');
      handleCloseEditModal();
    } catch (error) {
      console.error('Failed to update action plan:', error);
      alert('Failed to update action plan. Please try again.');
    }
  };

  const handleCompleteActionPlanSubmit = async () => {
    if (!selectedActionPlan) return;
    
    try {
      // TODO: Replace with actual API call
      // await api.put(`/action-plans/${selectedActionPlan.id}/complete`, completeFormData);
      
      // Mock completion
      setActionPlans(prev => prev.map(plan => 
        plan.id === selectedActionPlan.id 
          ? { 
              ...plan, 
              status: 'COMPLETED' as const,
              completionNotes: completeFormData.completionNotes,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : plan
      ));
      
      alert('Action plan marked as complete!');
      handleCloseCompleteModal();
    } catch (error) {
      console.error('Failed to complete action plan:', error);
      alert('Failed to complete action plan. Please try again.');
    }
  };

  const handleDeleteActionPlanSubmit = async () => {
    if (!selectedActionPlan) return;
    
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/action-plans/${selectedActionPlan.id}`);
      
      // Mock deletion
      setActionPlans(prev => prev.filter(plan => plan.id !== selectedActionPlan.id));
      
      alert('Action plan deleted successfully!');
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Failed to delete action plan:', error);
      alert('Failed to delete action plan. Please try again.');
    }
  };

  const handleCreateActionPlanSubmit = async () => {
    try {
      // TODO: Replace with actual API call
      // await api.post('/action-plans', createFormData);
      
      // Mock creation
      const newActionPlan: ActionPlan = {
        id: Math.max(...actionPlans.map(p => p.id)) + 1,
        actionText: createFormData.actionText,
        priority: createFormData.priority,
        status: 'PENDING',
        deadline: createFormData.deadline ? new Date(createFormData.deadline).toISOString() : undefined,
        gapId: 1,
        responsibleId: createFormData.responsibleId,
        requirementId: createFormData.requirementId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responsible: { id: 1, firstName: 'John', lastName: 'Doe' },
        requirement: { id: 1, clause: 'A.9.2.1', title: 'User access provisioning' }
      };
      
      setActionPlans(prev => [...prev, newActionPlan]);
      
      alert('Action plan created successfully!');
      handleCloseCreateModal();
    } catch (error) {
      console.error('Failed to create action plan:', error);
      alert('Failed to create action plan. Please try again.');
    }
  };

  const fetchActionPlans = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/action-plans');
      // setActionPlans(response.data);
      
      // Mock data for now
      setActionPlans([
        {
          id: 1,
          actionText: 'Implement multi-factor authentication for all user accounts',
          priority: 'HIGH',
          status: 'IN_PROGRESS',
          deadline: '2024-03-31T23:59:59.000Z',
          gapId: 1,
          responsibleId: 1,
          requirementId: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          gap: {
            id: 1,
            description: 'Multi-factor authentication is partially implemented',
            requirement: {
              id: 1,
              clause: 'A.9.2.1',
              title: 'User access provisioning'
            }
          },
          responsible: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          },
          requirement: {
            id: 1,
            clause: 'A.9.2.1',
            title: 'User access provisioning'
          }
        },
        {
          id: 2,
          actionText: 'Establish formal access review process',
          priority: 'CRITICAL',
          status: 'PENDING',
          deadline: '2024-02-28T23:59:59.000Z',
          gapId: 2,
          responsibleId: 2,
          requirementId: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          gap: {
            id: 2,
            description: 'No formal access review process is currently in place',
            requirement: {
              id: 2,
              clause: 'A.9.2.2',
              title: 'User access review'
            }
          },
          responsible: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith'
          },
          requirement: {
            id: 2,
            clause: 'A.9.2.2',
            title: 'User access review'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching action plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'IN_PROGRESS': return { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock };
      case 'COMPLETED': return { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'CANCELLED': return { label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (deadline: string, status: string) => {
    return deadline && new Date(deadline) < new Date() && status !== 'COMPLETED';
  };

  const filteredActionPlans = actionPlans.filter(plan => {
    const matchesSearch = plan.actionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.requirement?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || plan.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
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
            <h1 className="text-2xl font-bold mb-2">Action Plans</h1>
            <p className="text-blue-100">
              Track and manage compliance improvement actions - <span className="font-semibold">{filteredActionPlans.length} action plans</span> found
            </p>
          </div>
          <div className="hidden sm:block">
            <CheckSquare className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900">{actionPlans.length}</p>
              <p className="text-sm text-blue-600">+5 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{actionPlans.filter(a => a.status === 'IN_PROGRESS').length}</p>
              <p className="text-sm text-blue-600">Active tasks</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{actionPlans.filter(a => isOverdue(a.deadline || '', a.status)).length}</p>
              <p className="text-sm text-red-600">Need attention</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{actionPlans.filter(a => a.status === 'COMPLETED').length}</p>
              <p className="text-sm text-green-600">This month</p>
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
                 placeholder="Search action plans..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10"
               />
            </div>
             <Select value={filterStatus} onValueChange={setFilterStatus}>
               <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-300">
                 <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Status</SelectItem>
                 <SelectItem value="PENDING" className="text-gray-900 hover:bg-gray-100">Pending</SelectItem>
                 <SelectItem value="IN_PROGRESS" className="text-gray-900 hover:bg-gray-100">In Progress</SelectItem>
                 <SelectItem value="COMPLETED" className="text-gray-900 hover:bg-gray-100">Completed</SelectItem>
                 <SelectItem value="CANCELLED" className="text-gray-900 hover:bg-gray-100">Cancelled</SelectItem>
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
             <Button variant="outline" onClick={fetchActionPlans}>
               Refresh
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Plans List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Action Plans</h2>
          <ManagerAndAbove>
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                // Open action plan creation form
                alert('Opening action plan creation form... (This would open a modal to create new action plans)');
              }}
            >
              <Plus className="h-4 w-4" />
              New Action Plan
            </Button>
          </ManagerAndAbove>
        </div>
        
        <div className="space-y-4">
          {filteredActionPlans.map((plan) => {
            const statusInfo = getStatusInfo(plan.status);
            const StatusIcon = statusInfo.icon;
            const overdue = isOverdue(plan.deadline || '', plan.status);
            
            return (
              <div key={plan.id} className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${overdue ? 'border-red-200' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{plan.actionText}</h3>
                    <p className="text-sm text-gray-600">
                      {plan.requirement?.clause} - {plan.requirement?.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                    <Badge className={getPriorityColor(plan.priority)}>
                      {plan.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">Responsible:</span>
                        <div className="font-medium text-gray-900">
                          {plan.responsible?.firstName} {plan.responsible?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">Deadline:</span>
                        <div className="font-medium text-gray-900">
                          {plan.deadline ? formatDate(plan.deadline) : 'No deadline'}
                          {overdue && <span className="text-red-600 ml-1">(Overdue)</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">Gap:</span>
                        <div className="font-medium text-gray-900 text-sm">
                          {plan.gap?.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {plan.completionNotes && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-800 mb-1">Completion Notes:</div>
                      <div className="text-sm text-green-700">{plan.completionNotes}</div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewActionPlan(plan)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditActionPlan(plan)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {plan.status !== 'COMPLETED' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleCompleteActionPlan(plan)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteActionPlan(plan)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActionPlans.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No action plans found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first action plan.'}
            </p>
            <ManagerAndAbove>
              <Button
                onClick={handleCreateActionPlan}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Action Plan
              </Button>
            </ManagerAndAbove>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Action Plan Details</DialogTitle>
            <DialogDescription>
              View detailed information about this action plan
            </DialogDescription>
          </DialogHeader>
          {selectedActionPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Action Text</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                    {selectedActionPlan.actionText}
                  </p>
                </div>
                <div>
                  <Label className="text-white">Priority</Label>
                  <div className="mt-1">
                    <Badge variant={
                      selectedActionPlan.priority === 'CRITICAL' ? 'destructive' :
                      selectedActionPlan.priority === 'HIGH' ? 'destructive' :
                      selectedActionPlan.priority === 'MEDIUM' ? 'secondary' : 'outline'
                    }>
                      {selectedActionPlan.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Status</Label>
                  <div className="mt-1">
                    <Badge variant={
                      selectedActionPlan.status === 'COMPLETED' ? 'default' :
                      selectedActionPlan.status === 'IN_PROGRESS' ? 'secondary' :
                      selectedActionPlan.status === 'CANCELLED' ? 'destructive' : 'outline'
                    }>
                      {selectedActionPlan.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-white">Deadline</Label>
                  <p className="text-sm text-white">
                    {selectedActionPlan.deadline 
                      ? new Date(selectedActionPlan.deadline).toLocaleDateString()
                      : 'No deadline set'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-white">Responsible</Label>
                  <p className="text-sm text-white">
                    {selectedActionPlan.responsible 
                      ? `${selectedActionPlan.responsible.firstName} ${selectedActionPlan.responsible.lastName}`
                      : 'Not assigned'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-white">Requirement</Label>
                  <p className="text-sm text-white">
                    {selectedActionPlan.requirement 
                      ? `${selectedActionPlan.requirement.clause} - ${selectedActionPlan.requirement.title}`
                      : 'No requirement linked'
                    }
                  </p>
                </div>
              </div>
              {selectedActionPlan.completionNotes && (
                <div>
                  <Label className="text-white">Completion Notes</Label>
                  <p className="text-sm text-gray-900 bg-green-50 p-3 rounded border">
                    {selectedActionPlan.completionNotes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Action Plan</DialogTitle>
            <DialogDescription>
              Update the action plan details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Action Text</Label>
              <Textarea
                value={editFormData.actionText}
                onChange={(e) => setEditFormData(prev => ({ ...prev, actionText: e.target.value }))}
                placeholder="Enter action description..."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Priority</Label>
                <Select
                  value={editFormData.priority}
                  onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => 
                    setEditFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') => 
                    setEditFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-white">Deadline</Label>
              <Input
                type="date"
                value={editFormData.deadline}
                onChange={(e) => setEditFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-white">Completion Notes</Label>
              <Textarea
                value={editFormData.completionNotes}
                onChange={(e) => setEditFormData(prev => ({ ...prev, completionNotes: e.target.value }))}
                placeholder="Enter completion notes..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateActionPlan}>
              Update Action Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Complete Modal */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Action Plan as Complete</DialogTitle>
            <DialogDescription>
              Add completion notes and mark this action plan as complete
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Completion Notes</Label>
              <Textarea
                value={completeFormData.completionNotes}
                onChange={(e) => setCompleteFormData(prev => ({ ...prev, completionNotes: e.target.value }))}
                placeholder="Enter completion notes..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCompleteModal}>
              Cancel
            </Button>
            <Button onClick={handleCompleteActionPlanSubmit}>
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Action Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this action plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedActionPlan && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Action:</strong> {selectedActionPlan.actionText}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteActionPlanSubmit}>
              Delete Action Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Action Plan Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Action Plan</DialogTitle>
            <DialogDescription>
              Create a new action plan to address compliance gaps
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Action Text</Label>
              <Textarea
                value={createFormData.actionText}
                onChange={(e) => setCreateFormData(prev => ({ ...prev, actionText: e.target.value }))}
                placeholder="Enter action description..."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Priority</Label>
                <Select
                  value={createFormData.priority}
                  onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => 
                    setCreateFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Deadline</Label>
                <Input
                  type="date"
                  value={createFormData.deadline}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button onClick={handleCreateActionPlanSubmit}>
              Create Action Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
