'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  Shield, 
  Calendar,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    // For now, we'll just exit edit mode
    setIsEditing(false);
    // TODO: Implement actual update functionality
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      role: user?.role || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Support & Coordination',
      'MANAGER': 'Direction & Decision-making',
      'COMPLIANCE_OFFICER': 'Oversight & Regulatory Assurance',
      'STAFF': 'Input & Implementation'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-700">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <User className="h-5 w-5 text-blue-600" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1 text-gray-900"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {user?.firstName || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1 text-gray-900"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 font-medium">
                      {user?.lastName || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 text-gray-900"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user?.email || 'Not provided'}</span>
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
                {isEditing ? (
                  <Select value={editData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="mt-1 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Support & Coordination</SelectItem>
                      <SelectItem value="MANAGER">Direction & Decision-making</SelectItem>
                      <SelectItem value="COMPLIANCE_OFFICER">Oversight & Regulatory Assurance</SelectItem>
                      <SelectItem value="STAFF">Input & Implementation</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 font-medium flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>{getRoleDisplayName(user?.role || '')}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization & Account Info */}
        <div className="space-y-6">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Organization</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Organization Name</Label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {user?.organization?.name || 'Not assigned'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Domain</Label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {user?.organization?.domain || 'Not assigned'}
                </p>
              </div>
              {user?.branch && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Branch</Label>
                  <p className="mt-1 text-sm text-gray-900 font-medium flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user.branch.name}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{user.branch.region}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {user?.createdAt ? formatDate(user.createdAt) : 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {user?.updatedAt ? formatDate(user.updatedAt) : 'Not available'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
