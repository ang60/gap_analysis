'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  gapAssessments?: any[];
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const { user } = useAuth();

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
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                <SelectItem value="CBK">CBK Guidelines</SelectItem>
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
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Requirement
          </Button>
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
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
