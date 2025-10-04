'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, Loader2 } from 'lucide-react';
import { authService, Organization } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrganizationSwitcherProps {
  currentOrganizationId: number;
  onOrganizationChange?: (organizationId: number) => void;
}

export default function OrganizationSwitcher({ 
  currentOrganizationId, 
  onOrganizationChange 
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const orgs = await authService.getOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      console.error('Failed to load organizations:', error);
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationSwitch = async (organizationId: number) => {
    if (organizationId === currentOrganizationId) return;

    try {
      setSwitching(true);
      setError('');

      // Get current user credentials (you might need to store these securely)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!currentUser.email) {
        setError('User credentials not found. Please login again.');
        return;
      }

      // Login to the new organization
      const response = await authService.loginToOrganization({
        email: currentUser.email,
        password: '', // You'll need to handle this securely
        organizationId: organizationId
      });

      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Notify parent component
      if (onOrganizationChange) {
        onOrganizationChange(organizationId);
      }

      // Reload the page to update all components
      router.refresh();
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'response' in error 
        ? (error as any).response?.data?.message 
        : 'Failed to switch organization';
      setError(errorMessage || 'Failed to switch organization');
    } finally {
      setSwitching(false);
    }
  };

  const currentOrganization = organizations.find(org => org.id === currentOrganizationId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Loading organizations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Organization Switcher
        </CardTitle>
        <CardDescription>
          Switch between different organizations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Organization */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Building2 className="h-4 w-4 text-blue-600 mr-2" />
            <div>
              <div className="font-medium text-blue-900">
                {currentOrganization?.name || 'Unknown Organization'}
              </div>
              <div className="text-sm text-blue-700">
                {currentOrganization?.domain || 'No domain'}
              </div>
            </div>
          </div>
        </div>

        {/* Organization Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Switch to Organization
          </label>
          <Select 
            value={currentOrganizationId.toString()} 
            onValueChange={(value) => handleOrganizationSwitch(parseInt(value))}
            disabled={switching}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-xs text-gray-500">{org.domain}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Organization List */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Available Organizations</div>
          <div className="space-y-1">
            {organizations.map((org) => (
              <div 
                key={org.id} 
                className={`flex items-center justify-between p-2 rounded-lg border ${
                  org.id === currentOrganizationId 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">{org.name}</div>
                    <div className="text-xs text-gray-500">{org.domain}</div>
                  </div>
                </div>
                {org.id === currentOrganizationId && (
                  <div className="text-xs text-blue-600 font-medium">Current</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium text-gray-700 mb-2">Quick Actions</div>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOrganizationSwitch(1)}
              disabled={switching || currentOrganizationId === 1}
            >
              {switching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              Default Organization
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOrganizationSwitch(3)}
              disabled={switching || currentOrganizationId === 3}
            >
              {switching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              Test Organization A
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOrganizationSwitch(4)}
              disabled={switching || currentOrganizationId === 4}
            >
              {switching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Building2 className="h-4 w-4 mr-2" />
              )}
              Test Organization B
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
