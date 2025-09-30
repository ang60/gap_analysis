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
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Link,
  Calendar,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Evidence {
  id: number;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'SCREENSHOT' | 'POLICY' | 'PROCEDURE' | 'TRAINING_RECORD' | 'AUDIT_REPORT' | 'OTHER';
  filePath?: string;
  fileUrl?: string;
  externalUrl?: string;
  requirementId: number;
  branchId: number;
  uploadedById: number;
  uploadedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
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
  uploadedBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/evidence');
      // setEvidence(response.data);
      
      // Mock data for now
      setEvidence([
        {
          id: 1,
          title: 'MFA Implementation Policy',
          description: 'Official policy document outlining multi-factor authentication requirements for all user accounts',
          type: 'POLICY',
          filePath: '/documents/mfa-policy.pdf',
          requirementId: 1,
          branchId: 1,
          uploadedById: 1,
          uploadedAt: '2024-01-15T10:00:00Z',
          status: 'APPROVED',
          requirement: {
            id: 1,
            clause: 'A.9.2.1',
            title: 'User access provisioning',
            section: 'Access Control'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          },
          uploadedBy: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          }
        },
        {
          id: 2,
          title: 'Access Review Procedure',
          description: 'Step-by-step procedure for conducting regular user access reviews',
          type: 'PROCEDURE',
          filePath: '/documents/access-review-procedure.pdf',
          requirementId: 2,
          branchId: 1,
          uploadedById: 2,
          uploadedAt: '2024-01-16T14:30:00Z',
          status: 'PENDING',
          requirement: {
            id: 2,
            clause: 'A.9.2.2',
            title: 'User access review',
            section: 'Access Control'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          },
          uploadedBy: {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith'
          }
        },
        {
          id: 3,
          title: 'Security Training Records',
          description: 'Records of security awareness training completed by all staff members',
          type: 'TRAINING_RECORD',
          externalUrl: 'https://training.company.com/records/security-2024',
          requirementId: 3,
          branchId: 1,
          uploadedById: 1,
          uploadedAt: '2024-01-17T09:15:00Z',
          status: 'APPROVED',
          requirement: {
            id: 3,
            clause: 'A.7.2.2',
            title: 'Information security awareness, education and training',
            section: 'Human Resource Security'
          },
          branch: {
            id: 1,
            name: 'Head Office'
          },
          uploadedBy: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'DOCUMENT': return { label: 'Document', color: 'bg-blue-100 text-blue-800', icon: FileText };
      case 'SCREENSHOT': return { label: 'Screenshot', color: 'bg-green-100 text-green-800', icon: FileText };
      case 'POLICY': return { label: 'Policy', color: 'bg-purple-100 text-purple-800', icon: FileText };
      case 'PROCEDURE': return { label: 'Procedure', color: 'bg-orange-100 text-orange-800', icon: FileText };
      case 'TRAINING_RECORD': return { label: 'Training Record', color: 'bg-yellow-100 text-yellow-800', icon: FileText };
      case 'AUDIT_REPORT': return { label: 'Audit Report', color: 'bg-red-100 text-red-800', icon: FileText };
      case 'OTHER': return { label: 'Other', color: 'bg-gray-100 text-gray-800', icon: FileText };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: FileText };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'APPROVED': return { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'REJECTED': return { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      default: return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.requirement?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
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
            <h1 className="text-2xl font-bold mb-2">Evidence Management</h1>
            <p className="text-blue-100">
              Manage compliance evidence and documentation - <span className="font-semibold">{filteredEvidence.length} evidence items</span> found
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
              <p className="text-sm font-medium text-gray-600">Total Evidence</p>
              <p className="text-2xl font-bold text-gray-900">{evidence.length}</p>
              <p className="text-sm text-blue-600">+8 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{evidence.filter(e => e.status === 'APPROVED').length}</p>
              <p className="text-sm text-green-600">Ready for audit</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{evidence.filter(e => e.status === 'PENDING').length}</p>
              <p className="text-sm text-yellow-600">Awaiting approval</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">{evidence.filter(e => e.type === 'DOCUMENT' || e.type === 'POLICY' || e.type === 'PROCEDURE').length}</p>
              <p className="text-sm text-purple-600">Policy & procedures</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
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
                 placeholder="Search evidence..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10"
               />
            </div>
             <Select value={filterType} onValueChange={setFilterType}>
               <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                 <SelectValue placeholder="Type" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-300">
                 <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Types</SelectItem>
                 <SelectItem value="DOCUMENT" className="text-gray-900 hover:bg-gray-100">Document</SelectItem>
                 <SelectItem value="SCREENSHOT" className="text-gray-900 hover:bg-gray-100">Screenshot</SelectItem>
                 <SelectItem value="POLICY" className="text-gray-900 hover:bg-gray-100">Policy</SelectItem>
                 <SelectItem value="PROCEDURE" className="text-gray-900 hover:bg-gray-100">Procedure</SelectItem>
                 <SelectItem value="TRAINING_RECORD" className="text-gray-900 hover:bg-gray-100">Training Record</SelectItem>
                 <SelectItem value="AUDIT_REPORT" className="text-gray-900 hover:bg-gray-100">Audit Report</SelectItem>
                 <SelectItem value="OTHER" className="text-gray-900 hover:bg-gray-100">Other</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterStatus} onValueChange={setFilterStatus}>
               <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent className="bg-white border border-gray-300">
                 <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Status</SelectItem>
                 <SelectItem value="PENDING" className="text-gray-900 hover:bg-gray-100">Pending Review</SelectItem>
                 <SelectItem value="APPROVED" className="text-gray-900 hover:bg-gray-100">Approved</SelectItem>
                 <SelectItem value="REJECTED" className="text-gray-900 hover:bg-gray-100">Rejected</SelectItem>
               </SelectContent>
             </Select>
             <Button variant="outline" onClick={fetchEvidence}>
               Refresh
             </Button>
          </div>
        </CardContent>
      </Card>

      {/* Evidence List */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Evidence</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                // Open file upload modal
                alert('Opening file upload modal... (This would open a file upload interface)');
              }}
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                // Open evidence creation form
                alert('Opening evidence creation form... (This would open a modal to add new evidence)');
              }}
            >
              <Plus className="h-4 w-4" />
              Add Evidence
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredEvidence.map((item) => {
            const typeInfo = getTypeInfo(item.type);
            const statusInfo = getStatusInfo(item.status);
            const TypeIcon = typeInfo.icon;
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.requirement?.clause} - {item.requirement?.title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={typeInfo.color}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    {item.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">Uploaded by:</span>
                        <div className="font-medium text-gray-900">
                          {item.uploadedBy?.firstName} {item.uploadedBy?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">Uploaded:</span>
                        <div className="font-medium text-gray-900">
                          {formatDate(item.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-700 font-medium">Section:</span>
                        <div className="font-medium text-gray-900">
                          {item.requirement?.section}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        // Open evidence details modal
                        alert(`Viewing evidence: ${item.title}`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {item.filePath && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          // Download file
                          alert(`Downloading file: ${item.title}`);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {item.externalUrl && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          // Open external link
                          if (item.externalUrl) {
                            window.open(item.externalUrl, '_blank');
                          }
                        }}
                      >
                        <Link className="h-4 w-4 mr-1" />
                        Open Link
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        // Open evidence edit form
                        alert(`Editing evidence: ${item.title}`);
                      }}
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
                        if (confirm(`Are you sure you want to delete evidence: ${item.title}?`)) {
                          alert(`Deleting evidence: ${item.title}`);
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

        {filteredEvidence.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No evidence found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by uploading your first piece of evidence.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline"
                onClick={() => {
                  // Open file upload modal
                  alert('Opening file upload modal... (This would open a file upload interface)');
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              <Button
                onClick={() => {
                  // Open evidence creation form
                  alert('Opening evidence creation form... (This would open a modal to add new evidence)');
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Evidence
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
