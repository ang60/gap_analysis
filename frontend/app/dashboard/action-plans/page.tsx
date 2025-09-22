'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  useEffect(() => {
    fetchActionPlans();
  }, []);

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
                 className="pl-10 border-black text-black"
               />
            </div>
             <Select value={filterStatus} onValueChange={setFilterStatus}>
               <SelectTrigger className="border-black text-black">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-200 shadow-lg">
                 <SelectItem value="all" className="text-black hover:bg-gray-100">All Status</SelectItem>
                 <SelectItem value="PENDING" className="text-black hover:bg-gray-100">Pending</SelectItem>
                 <SelectItem value="IN_PROGRESS" className="text-black hover:bg-gray-100">In Progress</SelectItem>
                 <SelectItem value="COMPLETED" className="text-black hover:bg-gray-100">Completed</SelectItem>
                 <SelectItem value="CANCELLED" className="text-black hover:bg-gray-100">Cancelled</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterPriority} onValueChange={setFilterPriority}>
               <SelectTrigger className="border-black text-black">
                 <SelectValue placeholder="Priority" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-200 shadow-lg">
                 <SelectItem value="all" className="text-black hover:bg-gray-100">All Priorities</SelectItem>
                 <SelectItem value="CRITICAL" className="text-black hover:bg-gray-100">Critical</SelectItem>
                 <SelectItem value="HIGH" className="text-black hover:bg-gray-100">High</SelectItem>
                 <SelectItem value="MEDIUM" className="text-black hover:bg-gray-100">Medium</SelectItem>
                 <SelectItem value="LOW" className="text-black hover:bg-gray-100">Low</SelectItem>
               </SelectContent>
             </Select>
             <Button variant="outline" onClick={fetchActionPlans} className="border-black text-black hover:bg-black hover:text-white">
               Refresh
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Plans List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Action Plans</h2>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Action Plan
          </Button>
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
                        <span className="text-gray-500">Responsible:</span>
                        <div className="font-medium">
                          {plan.responsible?.firstName} {plan.responsible?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Deadline:</span>
                        <div className="font-medium">
                          {plan.deadline ? formatDate(plan.deadline) : 'No deadline'}
                          {overdue && <span className="text-red-600 ml-1">(Overdue)</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Gap:</span>
                        <div className="font-medium text-sm">
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
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {plan.status !== 'COMPLETED' && (
                      <Button size="sm" className="flex-1">
                        Mark Complete
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Action Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
