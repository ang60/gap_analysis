'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  Building, 
  Users, 
  FileText, 
  CheckSquare, 
  AlertTriangle, 
  Calendar,
  Bell,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleBasedComponent } from '@/components/RoleBasedComponent';
import api from '@/lib/api';

interface Organization {
  id: number;
  name: string;
  domain: string;
  subdomain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
    requirements: number;
    gapAssessments: number;
    actionPlans: number;
    risks: number;
    schedules: number;
  };
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  organization: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface SystemStats {
  totalOrganizations: number;
  totalUsers: number;
  totalRequirements: number;
  totalGapAssessments: number;
  totalActionPlans: number;
  totalRisks: number;
  totalSchedules: number;
}

export default function SuperAdminPage() {
  const { user: currentUser } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'users'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // View/Edit modals state
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for editing
  const [editOrgData, setEditOrgData] = useState({
    name: '',
    domain: '',
    subdomain: '',
    isActive: true
  });
  const [editUserData, setEditUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isActive: true
  });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, organizationsResponse, usersResponse] = await Promise.all([
        api.get('/super-admin/dashboard'),
        api.get('/super-admin/organizations'),
        api.get('/super-admin/users')
      ]);
      
      setSystemStats(dashboardResponse.data.statistics);
      setOrganizations(organizationsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Failed to fetch system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin',
      'MANAGER': 'Manager',
      'COMPLIANCE_OFFICER': 'Compliance Officer',
      'STAFF': 'Staff'
    };
    return roleMap[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-800',
      'ADMIN': 'bg-red-100 text-red-800',
      'MANAGER': 'bg-blue-100 text-blue-800',
      'COMPLIANCE_OFFICER': 'bg-green-100 text-green-800',
      'STAFF': 'bg-gray-100 text-gray-800'
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  };

  // Organization handlers
  const handleViewOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setIsEditing(false);
    setShowOrgModal(true);
  };

  const handleEditOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setEditOrgData({
      name: org.name,
      domain: org.domain,
      subdomain: org.subdomain || '',
      isActive: org.isActive
    });
    setIsEditing(true);
    setShowOrgModal(true);
  };

  const handleCloseOrgModal = () => {
    setShowOrgModal(false);
    setSelectedOrganization(null);
    setIsEditing(false);
  };

  // User handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setIsEditing(true);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && org.isActive) ||
                         (filterStatus === 'inactive' && !org.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organization.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading system data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoleBasedComponent 
      allowedRoles={['SUPER_ADMIN']} 
      fallback={
        <div className="p-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Only Super Administrators can access this system overview.</p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
            <p className="text-gray-600">Oversee all organizations and system-wide operations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="text-sm text-gray-600">Super Admin</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Activity className="h-4 w-4 inline mr-2" />
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('organizations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'organizations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Building className="h-4 w-4 inline mr-2" />
              Organizations
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              All Users
            </button>
          </nav>
        </div>

        {/* System Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Organizations</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {systemStats?.totalOrganizations || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {systemStats?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Requirements</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {systemStats?.totalRequirements || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <CheckSquare className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Action Plans</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {systemStats?.totalActionPlans || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Organizations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Organizations</CardTitle>
                <CardDescription>Latest organizations added to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organizations.slice(0, 5).map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{org.name}</h3>
                          <p className="text-sm text-gray-600">{org.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {org.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-sm text-gray-600">{org._count?.users || 0} users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="sm:w-48">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300">
                        <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Status</SelectItem>
                        <SelectItem value="active" className="text-gray-900 hover:bg-gray-100">Active</SelectItem>
                        <SelectItem value="inactive" className="text-gray-900 hover:bg-gray-100">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizations List */}
            <Card>
              <CardHeader>
                <CardTitle>Organizations ({filteredOrganizations.length})</CardTitle>
                <CardDescription>Manage all organizations in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrganizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{org.name}</h3>
                          <p className="text-sm text-gray-600">{org.domain}</p>
                          {org.subdomain && (
                            <p className="text-xs text-gray-500">Subdomain: {org.subdomain}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{org._count?.users || 0} users</p>
                          <p className="text-xs text-gray-500">
                            {org._count?.requirements || 0} requirements
                          </p>
                        </div>
                        <Badge className={org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {org.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewOrganization(org)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditOrganization(org)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users by name, email, or organization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                <CardDescription>Manage users across all organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.organization.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleDisplayName(user.role)}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Organization Modal */}
        <Dialog open={showOrgModal} onOpenChange={setShowOrgModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Organization' : 'View Organization'}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update organization details' : 'View organization information'}
              </DialogDescription>
            </DialogHeader>
            {selectedOrganization && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editOrgData.name}
                      onChange={(e) => setEditOrgData({...editOrgData, name: e.target.value})}
                      className="col-span-3"
                    />
                  ) : (
                    <span className="col-span-3 text-sm">{selectedOrganization.name}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domain" className="text-right">
                    Domain
                  </Label>
                  {isEditing ? (
                    <Input
                      id="domain"
                      value={editOrgData.domain}
                      onChange={(e) => setEditOrgData({...editOrgData, domain: e.target.value})}
                      className="col-span-3"
                    />
                  ) : (
                    <span className="col-span-3 text-sm">{selectedOrganization.domain}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subdomain" className="text-right">
                    Subdomain
                  </Label>
                  {isEditing ? (
                    <Input
                      id="subdomain"
                      value={editOrgData.subdomain}
                      onChange={(e) => setEditOrgData({...editOrgData, subdomain: e.target.value})}
                      className="col-span-3"
                    />
                  ) : (
                    <span className="col-span-3 text-sm">{selectedOrganization.subdomain || 'N/A'}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  {isEditing ? (
                    <Select 
                      value={editOrgData.isActive ? 'active' : 'inactive'}
                      onValueChange={(value) => setEditOrgData({...editOrgData, isActive: value === 'active'})}
                    >
                      <SelectTrigger className="col-span-3 bg-white text-gray-900 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300">
                        <SelectItem value="active" className="text-gray-900 hover:bg-gray-100">Active</SelectItem>
                        <SelectItem value="inactive" className="text-gray-900 hover:bg-gray-100">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={selectedOrganization.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {selectedOrganization.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Statistics</Label>
                  <div className="col-span-3 text-sm space-y-1">
                    <p>Users: {selectedOrganization._count?.users || 0}</p>
                    <p>Requirements: {selectedOrganization._count?.requirements || 0}</p>
                    <p>Gap Assessments: {selectedOrganization._count?.gapAssessments || 0}</p>
                    <p>Action Plans: {selectedOrganization._count?.actionPlans || 0}</p>
                    <p>Risks: {selectedOrganization._count?.risks || 0}</p>
                    <p>Schedules: {selectedOrganization._count?.schedules || 0}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {isEditing && (
                <Button type="submit" onClick={() => {
                  console.log('Saving organization changes:', editOrgData);
                  // TODO: Implement API call to save changes
                  alert('Organization changes saved! (This is a demo - no actual changes were made)');
                  handleCloseOrgModal();
                }}>
                  Save Changes
                </Button>
              )}
              <Button variant="outline" onClick={handleCloseOrgModal}>
                {isEditing ? 'Cancel' : 'Close'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Modal */}
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit User' : 'View User'}
              </DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update user details' : 'View user information'}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editUserData.firstName}
                      onChange={(e) => setEditUserData({...editUserData, firstName: e.target.value})}
                      className="col-span-3"
                    />
                  ) : (
                    <span className="col-span-3 text-sm">{selectedUser.firstName}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editUserData.lastName}
                      onChange={(e) => setEditUserData({...editUserData, lastName: e.target.value})}
                      className="col-span-3"
                    />
                  ) : (
                    <span className="col-span-3 text-sm">{selectedUser.lastName}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={editUserData.email}
                      onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                      className="col-span-3"
                    />
                  ) : (
                    <span className="col-span-3 text-sm">{selectedUser.email}</span>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  {isEditing ? (
                    <Select 
                      value={editUserData.role}
                      onValueChange={(value) => setEditUserData({...editUserData, role: value})}
                    >
                      <SelectTrigger className="col-span-3 bg-white text-gray-900 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300">
                        <SelectItem value="SUPER_ADMIN" className="text-gray-900 hover:bg-gray-100">Super Admin</SelectItem>
                        <SelectItem value="ADMIN" className="text-gray-900 hover:bg-gray-100">Admin</SelectItem>
                        <SelectItem value="MANAGER" className="text-gray-900 hover:bg-gray-100">Manager</SelectItem>
                        <SelectItem value="COMPLIANCE_OFFICER" className="text-gray-900 hover:bg-gray-100">Compliance Officer</SelectItem>
                        <SelectItem value="STAFF" className="text-gray-900 hover:bg-gray-100">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {getRoleDisplayName(selectedUser.role)}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Organization</Label>
                  <span className="col-span-3 text-sm">{selectedUser.organization.name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <Badge className={selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            )}
            <DialogFooter>
              {isEditing && (
                <Button type="submit" onClick={() => {
                  console.log('Saving user changes:', editUserData);
                  // TODO: Implement API call to save changes
                  alert('User changes saved! (This is a demo - no actual changes were made)');
                  handleCloseUserModal();
                }}>
                  Save Changes
                </Button>
              )}
              <Button variant="outline" onClick={handleCloseUserModal}>
                {isEditing ? 'Cancel' : 'Close'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleBasedComponent>
  );
}
