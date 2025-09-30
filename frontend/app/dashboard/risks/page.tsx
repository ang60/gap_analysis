'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    description: '',
    likelihood: 3,
    impact: 3,
    status: 'ACTIVE' as Risk['status'],
    mitigation: '',
    branchId: 1,
    ownerId: 1
  });

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

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new risk object
      const newRisk: Risk = {
        id: Date.now(), // Temporary ID
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: { id: formData.ownerId, firstName: 'New', lastName: 'User' },
        branch: { id: formData.branchId, name: 'Head Office' }
      };
      
      // Add to risks list
      setRisks(prev => [newRisk, ...prev]);
      
      // Reset form and close modal
      setFormData({
        description: '',
        likelihood: 3,
        impact: 3,
        status: 'ACTIVE',
        mitigation: '',
        branchId: 1,
        ownerId: 1
      });
      setShowCreateModal(false);
      
      alert('Risk created successfully!');
    } catch (error) {
      console.error('Failed to create risk:', error);
      alert('Failed to create risk. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      description: '',
      likelihood: 3,
      impact: 3,
      status: 'ACTIVE',
      mitigation: '',
      branchId: 1,
      ownerId: 1
    });
  };

  // View and Edit handlers
  const handleViewRisk = (risk: Risk) => {
    setSelectedRisk(risk);
    setShowViewModal(true);
  };

  const handleEditRisk = (risk: Risk) => {
    setSelectedRisk(risk);
    setFormData({
      description: risk.description,
      likelihood: risk.likelihood,
      impact: risk.impact,
      status: risk.status,
      mitigation: risk.mitigation || '',
      branchId: risk.branchId,
      ownerId: risk.ownerId
    });
    setShowEditModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedRisk(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedRisk(null);
    setFormData({
      description: '',
      likelihood: 3,
      impact: 3,
      status: 'ACTIVE',
      mitigation: '',
      branchId: 1,
      ownerId: 1
    });
  };

  const handleUpdateRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRisk) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update risk in the list
      setRisks(prev => prev.map(risk => 
        risk.id === selectedRisk.id 
          ? { ...risk, ...formData, updatedAt: new Date().toISOString() }
          : risk
      ));
      
      setShowEditModal(false);
      setSelectedRisk(null);
      setFormData({
        description: '',
        likelihood: 3,
        impact: 3,
        status: 'ACTIVE',
        mitigation: '',
        branchId: 1,
        ownerId: 1
      });
      
      alert('Risk updated successfully!');
    } catch (error) {
      console.error('Failed to update risk:', error);
      alert('Failed to update risk. Please try again.');
    } finally {
      setIsSubmitting(false);
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
               <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-300">
                 <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Status</SelectItem>
                 <SelectItem value="ACTIVE" className="text-gray-900 hover:bg-gray-100">Active</SelectItem>
                 <SelectItem value="MITIGATED" className="text-gray-900 hover:bg-gray-100">Mitigated</SelectItem>
                 <SelectItem value="ACCEPTED" className="text-gray-900 hover:bg-gray-100">Accepted</SelectItem>
                 <SelectItem value="CLOSED" className="text-gray-900 hover:bg-gray-100">Closed</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
               <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                 <SelectValue placeholder="Risk Level" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-300">
                 <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Risk Levels</SelectItem>
                 <SelectItem value="CRITICAL" className="text-gray-900 hover:bg-gray-100">Critical</SelectItem>
                 <SelectItem value="HIGH" className="text-gray-900 hover:bg-gray-100">High</SelectItem>
                 <SelectItem value="MEDIUM" className="text-gray-900 hover:bg-gray-100">Medium</SelectItem>
                 <SelectItem value="LOW" className="text-gray-900 hover:bg-gray-100">Low</SelectItem>
                 <SelectItem value="VERY_LOW" className="text-gray-900 hover:bg-gray-100">Very Low</SelectItem>
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
          <Button 
            className="flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewRisk(risk)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEditRisk(risk)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        // Confirm deletion
                        if (confirm(`Are you sure you want to delete risk: ${risk.description}?`)) {
                          alert(`Deleting risk: ${risk.description}`);
                        }
                      }}
                    >
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
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Risk
            </Button>
          </div>
        )}
      </div>

      {/* Create Risk Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Risk</DialogTitle>
            <DialogDescription>
              Identify and assess a new risk for your organization.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Risk Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the risk in detail"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                <Select 
                  value={formData.likelihood.toString()} 
                  onValueChange={(value) => handleInputChange('likelihood', parseInt(value))}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select likelihood" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Very Low</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Low</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - Medium</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">4 - High</SelectItem>
                    <SelectItem value="5" className="text-gray-900 hover:bg-gray-100">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="impact">Impact (1-5)</Label>
                <Select 
                  value={formData.impact.toString()} 
                  onValueChange={(value) => handleInputChange('impact', parseInt(value))}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Very Low</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Low</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - Medium</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">4 - High</SelectItem>
                    <SelectItem value="5" className="text-gray-900 hover:bg-gray-100">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Risk Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="ACTIVE" className="text-gray-900 hover:bg-gray-100">Active</SelectItem>
                  <SelectItem value="MITIGATED" className="text-gray-900 hover:bg-gray-100">Mitigated</SelectItem>
                  <SelectItem value="ACCEPTED" className="text-gray-900 hover:bg-gray-100">Accepted</SelectItem>
                  <SelectItem value="CLOSED" className="text-gray-900 hover:bg-gray-100">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mitigation">Mitigation Strategy (Optional)</Label>
              <Textarea
                id="mitigation"
                value={formData.mitigation}
                onChange={(e) => handleInputChange('mitigation', e.target.value)}
                placeholder="Describe how this risk can be mitigated or managed"
                rows={3}
              />
            </div>

            {/* Risk Score Display */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Risk Score:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {formData.likelihood * formData.impact}
                  </span>
                  <Badge className={getRiskLevel(formData.likelihood, formData.impact).color}>
                    {getRiskLevel(formData.likelihood, formData.impact).level}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Likelihood: {formData.likelihood} × Impact: {formData.impact} = {formData.likelihood * formData.impact}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Risk'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Risk Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Risk Details</DialogTitle>
            <DialogDescription>
              View detailed information about this risk.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRisk && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Risk Description</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedRisk.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Likelihood</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedRisk.likelihood} - {selectedRisk.likelihood === 1 ? 'Very Low' : 
                     selectedRisk.likelihood === 2 ? 'Low' : 
                     selectedRisk.likelihood === 3 ? 'Medium' : 
                     selectedRisk.likelihood === 4 ? 'High' : 'Very High'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Impact</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedRisk.impact} - {selectedRisk.impact === 1 ? 'Very Low' : 
                     selectedRisk.impact === 2 ? 'Low' : 
                     selectedRisk.impact === 3 ? 'Medium' : 
                     selectedRisk.impact === 4 ? 'High' : 'Very High'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Risk Status</Label>
                <div className="flex items-center gap-2">
                  <Badge className={selectedRisk.status === 'ACTIVE' ? 'bg-red-100 text-red-800' : 
                                   selectedRisk.status === 'MITIGATED' ? 'bg-green-100 text-green-800' : 
                                   selectedRisk.status === 'ACCEPTED' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-gray-100 text-gray-800'}>
                    {selectedRisk.status}
                  </Badge>
                </div>
              </div>

              {selectedRisk.mitigation && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Mitigation Strategy</Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedRisk.mitigation}
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Risk Score:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedRisk.likelihood * selectedRisk.impact}
                    </span>
                    <Badge className={getRiskLevel(selectedRisk.likelihood, selectedRisk.impact).color}>
                      {getRiskLevel(selectedRisk.likelihood, selectedRisk.impact).level}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Likelihood: {selectedRisk.likelihood} × Impact: {selectedRisk.impact} = {selectedRisk.likelihood * selectedRisk.impact}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Owner</Label>
                  <p className="text-sm text-gray-900">
                    {selectedRisk.owner?.firstName} {selectedRisk.owner?.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Branch</Label>
                  <p className="text-sm text-gray-900">
                    {selectedRisk.branch?.name}
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

      {/* Edit Risk Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>
              Update the risk information and assessment.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateRisk} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Risk Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the risk in detail"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-likelihood">Likelihood (1-5)</Label>
                <Select 
                  value={formData.likelihood.toString()} 
                  onValueChange={(value) => handleInputChange('likelihood', parseInt(value))}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select likelihood" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Very Low</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Low</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - Medium</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">4 - High</SelectItem>
                    <SelectItem value="5" className="text-gray-900 hover:bg-gray-100">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-impact">Impact (1-5)</Label>
                <Select 
                  value={formData.impact.toString()} 
                  onValueChange={(value) => handleInputChange('impact', parseInt(value))}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="1" className="text-gray-900 hover:bg-gray-100">1 - Very Low</SelectItem>
                    <SelectItem value="2" className="text-gray-900 hover:bg-gray-100">2 - Low</SelectItem>
                    <SelectItem value="3" className="text-gray-900 hover:bg-gray-100">3 - Medium</SelectItem>
                    <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">4 - High</SelectItem>
                    <SelectItem value="5" className="text-gray-900 hover:bg-gray-100">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Risk Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300">
                  <SelectItem value="ACTIVE" className="text-gray-900 hover:bg-gray-100">Active</SelectItem>
                  <SelectItem value="MITIGATED" className="text-gray-900 hover:bg-gray-100">Mitigated</SelectItem>
                  <SelectItem value="ACCEPTED" className="text-gray-900 hover:bg-gray-100">Accepted</SelectItem>
                  <SelectItem value="CLOSED" className="text-gray-900 hover:bg-gray-100">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-mitigation">Mitigation Strategy (Optional)</Label>
              <Textarea
                id="edit-mitigation"
                value={formData.mitigation}
                onChange={(e) => handleInputChange('mitigation', e.target.value)}
                placeholder="Describe how this risk can be mitigated or managed"
                rows={3}
              />
            </div>

            {/* Risk Score Display */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Risk Score:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {formData.likelihood * formData.impact}
                  </span>
                  <Badge className={getRiskLevel(formData.likelihood, formData.impact).color}>
                    {getRiskLevel(formData.likelihood, formData.impact).level}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Likelihood: {formData.likelihood} × Impact: {formData.impact} = {formData.likelihood * formData.impact}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseEditModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Risk'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
