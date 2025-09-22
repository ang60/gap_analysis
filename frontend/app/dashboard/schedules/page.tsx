'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Repeat,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Schedule {
  id: number;
  type: 'RISK_ASSESSMENT' | 'COMPLIANCE_REVIEW' | 'AUDIT' | 'TRAINING' | 'MAINTENANCE';
  title: string;
  description: string;
  dueDate: string;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
  customInterval?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isRecurring: boolean;
  reminderDays: number[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  branchId: number;
  responsibleId: number;
  createdAt: string;
  updatedAt: string;
  branch?: {
    id: number;
    name: string;
  };
  responsible?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/schedules');
      // setSchedules(response.data);
      
      // Mock data for now
      setSchedules([
        {
          id: 1,
          type: 'RISK_ASSESSMENT',
          title: 'Annual Risk Assessment',
          description: 'Conduct comprehensive risk assessment for all business processes',
          dueDate: '2024-12-31T23:59:59.000Z',
          frequency: 'ANNUAL',
          priority: 'HIGH',
          isRecurring: true,
          reminderDays: [30, 7, 1],
          status: 'PENDING',
          branchId: 1,
          responsibleId: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          branch: {
            id: 1,
            name: 'Head Office'
          },
          responsible: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        {
          id: 2,
          type: 'COMPLIANCE_REVIEW',
          title: 'Monthly Compliance Review',
          description: 'Review compliance status and update documentation',
          dueDate: '2024-02-15T23:59:59.000Z',
          frequency: 'MONTHLY',
          priority: 'MEDIUM',
          isRecurring: true,
          reminderDays: [7, 3, 1],
          status: 'IN_PROGRESS',
          branchId: 1,
          responsibleId: 2,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          branch: {
            id: 1,
            name: 'Head Office'
          },
          responsible: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'IN_PROGRESS': return { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: Clock };
      case 'COMPLETED': return { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'OVERDUE': return { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'RISK_ASSESSMENT': return 'Risk Assessment';
      case 'COMPLIANCE_REVIEW': return 'Compliance Review';
      case 'AUDIT': return 'Audit';
      case 'TRAINING': return 'Training';
      case 'MAINTENANCE': return 'Maintenance';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'COMPLETED';
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    const matchesType = filterType === 'all' || schedule.type === filterType;
    const matchesPriority = filterPriority === 'all' || schedule.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
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
            <h1 className="text-2xl font-bold mb-2">Schedule Management</h1>
            <p className="text-blue-100">
              Manage recurring compliance tasks and deadlines - <span className="font-semibold">{filteredSchedules.length} schedules</span> found
            </p>
          </div>
          <div className="hidden sm:block">
            <Calendar className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{schedules.length}</p>
              <p className="text-sm text-blue-600">+3 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{schedules.filter(s => s.status === 'PENDING').length}</p>
              <p className="text-sm text-yellow-600">Due soon</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{schedules.filter(s => isOverdue(s.dueDate, s.status)).length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{schedules.filter(s => s.status === 'COMPLETED').length}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                 placeholder="Search schedules..."
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
                 <SelectItem value="PENDING">Pending</SelectItem>
                 <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                 <SelectItem value="COMPLETED">Completed</SelectItem>
                 <SelectItem value="OVERDUE">Overdue</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterType} onValueChange={setFilterType}>
               <SelectTrigger>
                 <SelectValue placeholder="Type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Types</SelectItem>
                 <SelectItem value="RISK_ASSESSMENT">Risk Assessment</SelectItem>
                 <SelectItem value="COMPLIANCE_REVIEW">Compliance Review</SelectItem>
                 <SelectItem value="AUDIT">Audit</SelectItem>
                 <SelectItem value="TRAINING">Training</SelectItem>
                 <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterPriority} onValueChange={setFilterPriority}>
               <SelectTrigger>
                 <SelectValue placeholder="Priority" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Priorities</SelectItem>
                 <SelectItem value="CRITICAL">Critical</SelectItem>
                 <SelectItem value="HIGH">High</SelectItem>
                 <SelectItem value="MEDIUM">Medium</SelectItem>
                 <SelectItem value="LOW">Low</SelectItem>
               </SelectContent>
             </Select>
             <Button variant="outline" onClick={fetchSchedules}>
               Refresh
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedules List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Schedules</h2>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Schedule
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => {
            const statusInfo = getStatusInfo(schedule.status);
            const StatusIcon = statusInfo.icon;
            const overdue = isOverdue(schedule.dueDate, schedule.status);
            
            return (
              <div key={schedule.id} className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${overdue ? 'border-red-200' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      {schedule.title}
                      {schedule.isRecurring && <Repeat className="h-4 w-4 text-blue-600" />}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getTypeLabel(schedule.type)} • {schedule.branch?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                    <Badge className={getPriorityColor(schedule.priority)}>
                      {schedule.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    {schedule.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <div className="font-medium">
                        {formatDate(schedule.dueDate)}
                        {overdue && <span className="text-red-600 ml-1">(Overdue)</span>}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Responsible:</span>
                      <div className="font-medium">
                        {schedule.responsible?.firstName} {schedule.responsible?.lastName}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Frequency:</span>
                      <div className="font-medium">
                        {schedule.frequency || 'One-time'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Reminders:</span>
                      <div className="font-medium flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        {schedule.reminderDays.join(', ')} days before
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {schedule.status !== 'COMPLETED' && (
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

        {filteredSchedules.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first schedule.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
