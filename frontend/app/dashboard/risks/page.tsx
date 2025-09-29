'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Shield,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  User,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Risk {
  id: number;
  description: string;
  likelihood: number; // 1-5 scale
  impact: number; // 1-5 scale
  status: 'ACTIVE' | 'MITIGATED' | 'ACCEPTED' | 'CLOSED';
  mitigation?: string;
  ownerId: number;
  branchId: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRiskLevel, setFilterRiskLevel] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/risks');
      // setRisks(response.data);
      
      // Mock data for now
      setRisks([
        {
          id: 1,
          description: 'Unauthorized access to customer data due to weak authentication mechanisms',
          likelihood: 3,
          impact: 4,
          status: 'ACTIVE',
          mitigation: 'Implement multi-factor authentication and regular access reviews',
          ownerId: 1,
          branchId: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          owner: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          }
        },
        {
          id: 2,
          description: 'Data breach due to insufficient network security controls',
          likelihood: 2,
          impact: 5,
          status: 'MITIGATED',
          mitigation: 'Deployed advanced firewall and intrusion detection systems',
          ownerId: 2,
          branchId: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          owner: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching risks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 20) return { level: 'CRITICAL', color: 'bg-red-100 text-red-800', score };
    if (score >= 15) return { level: 'HIGH', color: 'bg-orange-100 text-orange-800', score };
    if (score >= 10) return { level: 'MEDIUM', color: 'bg-yellow-100 text-yellow-800', score };
    if (score >= 5) return { level: 'LOW', color: 'bg-green-100 text-green-800', score };
    return { level: 'VERY_LOW', color: 'bg-gray-100 text-gray-800', score };
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { label: 'Active', color: 'bg-red-100 text-red-800', icon: Activity };
      case 'MITIGATED': return { label: 'Mitigated', color: 'bg-yellow-100 text-yellow-800', icon: Shield };
      case 'ACCEPTED': return { label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: Shield };
      case 'CLOSED': return { label: 'Closed', color: 'bg-green-100 text-green-800', icon: Shield };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: AlertTriangle };
    }
  };

  const getLikelihoodLabel = (likelihood: number) => {
    switch (likelihood) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Unknown';
    }
  };

  const getImpactLabel = (impact: number) => {
    switch (impact) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Unknown';
    }
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || risk.status === filterStatus;
    const riskLevel = getRiskLevel(risk.likelihood, risk.impact);
    const matchesRiskLevel = filterRiskLevel === 'all' || riskLevel.level === filterRiskLevel;
    
    return matchesSearch && matchesStatus && matchesRiskLevel;
  });

  const highRisks = risks.filter(risk => {
    const riskLevel = getRiskLevel(risk.likelihood, risk.impact);
    return riskLevel.level === 'HIGH' || riskLevel.level === 'CRITICAL';
  });

  const activeRisks = risks.filter(risk => risk.status === 'ACTIVE');

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
            <h1 className="text-2xl font-bold mb-2">Risk Register</h1>
            <p className="text-blue-100">
              Identify, assess, and manage compliance risks - <span className="font-semibold">{filteredRisks.length} risks</span> found
            </p>
          </div>
          <div className="hidden sm:block">
            <AlertTriangle className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Risks</p>
              <p className="text-2xl font-bold text-gray-900">{risks.length}</p>
              <p className="text-sm text-blue-600">{activeRisks.length} active risks</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High/Critical Risks</p>
              <p className="text-2xl font-bold text-gray-900">{highRisks.length}</p>
              <p className="text-sm text-red-600">Require immediate attention</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mitigated Risks</p>
              <p className="text-2xl font-bold text-gray-900">{risks.filter(r => r.status === 'MITIGATED').length}</p>
              <p className="text-sm text-green-600">Successfully addressed</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Trend</p>
              <p className="text-2xl font-bold text-gray-900">-12%</p>
              <p className="text-sm text-green-600">From last month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingDown className="h-6 w-6 text-green-600" />
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
                 placeholder="Search risks..."
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
                 <SelectItem value="ACTIVE">Active</SelectItem>
                 <SelectItem value="MITIGATED">Mitigated</SelectItem>
                 <SelectItem value="ACCEPTED">Accepted</SelectItem>
                 <SelectItem value="CLOSED">Closed</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
               <SelectTrigger>
                 <SelectValue placeholder="Risk Level" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Risk Levels</SelectItem>
                 <SelectItem value="CRITICAL">Critical</SelectItem>
                 <SelectItem value="HIGH">High</SelectItem>
                 <SelectItem value="MEDIUM">Medium</SelectItem>
                 <SelectItem value="LOW">Low</SelectItem>
                 <SelectItem value="VERY_LOW">Very Low</SelectItem>
               </SelectContent>
             </Select>
             <Button variant="outline" onClick={fetchRisks}>
               Refresh
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risks List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Risk Register</h2>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Risk
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredRisks.map((risk) => {
            const riskLevel = getRiskLevel(risk.likelihood, risk.impact);
            const statusInfo = getStatusInfo(risk.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={risk.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{risk.description}</h3>
                    <p className="text-sm text-gray-600">
                      {risk.branch?.name} • Owned by {risk.owner?.firstName} {risk.owner?.lastName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={riskLevel.color}>
                      {riskLevel.level} ({riskLevel.score})
                    </Badge>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700 font-medium">Likelihood:</span>
                      <div className="font-medium text-gray-900">{getLikelihoodLabel(risk.likelihood)}</div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">Impact:</span>
                      <div className="font-medium text-gray-900">{getImpactLabel(risk.impact)}</div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">Risk Score:</span>
                      <div className="font-medium text-gray-900">{riskLevel.score}/25</div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">Created:</span>
                      <div className="font-medium text-gray-900">
                        {new Date(risk.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {risk.mitigation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-800 mb-1">Mitigation:</div>
                      <div className="text-sm text-blue-700">{risk.mitigation}</div>
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
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRisks.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No risks found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterRiskLevel !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by identifying your first risk.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Risk
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
