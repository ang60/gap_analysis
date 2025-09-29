'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Shield,
  UserCheck,
  UserX,
  Edit,
  MoreHorizontal,
  Mail,
  Building,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminOnly } from '@/components/RoleBasedComponent';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  organizationId: number;
  organization: {
    id: number;
    name: string;
  };
  branch?: {
    id: number;
    name: string;
    region: string;
  };
  createdAt: string;
  updatedAt: string;
}

const roleOptions = [
  { value: 'ADMIN', label: 'Admin', color: 'bg-red-100 text-red-800' },
  { value: 'MANAGER', label: 'Manager', color: 'bg-blue-100 text-blue-800' },
  { value: 'COMPLIANCE_OFFICER', label: 'Compliance Officer', color: 'bg-green-100 text-green-800' },
  { value: 'STAFF', label: 'Staff', color: 'bg-gray-100 text-gray-800' },
];

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/organization/${currentUser?.organizationId}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      setUpdating(true);
      await api.put(`/users/${userId}/assign-role`, { role: newRole });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setEditingUser(null);
      setSelectedRole('');
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleInfo = (role: string) => {
    return roleOptions.find(option => option.value === role) || roleOptions[3];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Support & Coordination',
      'MANAGER': 'Direction & Decision-making',
      'COMPLIANCE_OFFICER': 'Oversight & Regulatory Assurance',
      'STAFF': 'Input & Implementation'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly fallback={
      <div className="p-6">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </div>
      </div>
    }>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage users and assign roles in your organization</p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span className="text-sm text-gray-600">{users.length} users</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'ADMIN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'MANAGER').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Compliance Officers</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'COMPLIANCE_OFFICER').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Staff</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'STAFF').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Roles</SelectItem>
                    {roleOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-gray-900 hover:bg-gray-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Manage user roles and permissions in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const isCurrentUser = user.id === currentUser?.id;
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-blue-600 font-normal">(You)</span>
                            )}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>
                          {user.branch && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{user.branch.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge className={roleInfo.color}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                      
                      {!isCurrentUser && (
                        <div className="flex items-center space-x-2">
                          {editingUser?.id === user.id ? (
                            <div className="flex items-center space-x-2">
                              <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-48 bg-white text-gray-900 border-gray-300">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-300">
                                  {roleOptions.map((option) => (
                                    <SelectItem 
                                      key={option.value} 
                                      value={option.value}
                                      className="text-gray-900 hover:bg-gray-100"
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                onClick={() => handleRoleChange(user.id, selectedRole)}
                                disabled={updating || !selectedRole}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                              >
                                {updating ? 'Updating...' : 'Save'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(null);
                                  setSelectedRole('');
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user);
                                setSelectedRole(user.role);
                              }}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Change Role
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterRole !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No users have been added to this organization yet.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
