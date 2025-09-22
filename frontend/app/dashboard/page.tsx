'use client';

import Link from 'next/link';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Calendar,
  Users,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const metrics = [
    {
      name: 'Requirements',
      value: '28/41',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
      color: 'blue',
    },
    {
      name: 'Schedules',
      value: '8 upcoming',
      change: '3 overdue',
      changeType: 'negative',
      icon: Calendar,
      color: 'orange',
    },
    {
      name: 'Action Plans',
      value: '45 completed',
      change: '7 pending',
      changeType: 'neutral',
      icon: CheckCircle,
      color: 'green',
    },
    {
      name: 'Active Risks',
      value: '12',
      change: '2 high',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red',
    },
  ];

  const quickActions = [
    {
      name: 'New Gap Assessment',
      description: 'Create a new compliance gap assessment',
      href: '/dashboard/gap-analysis/new',
      icon: Plus,
      color: 'blue',
    },
    {
      name: 'Create Schedule',
      description: 'Set up a new recurring schedule',
      href: '/dashboard/schedules/new',
      icon: Calendar,
      color: 'green',
    },
    {
      name: 'Add Risk',
      description: 'Register a new risk in the system',
      href: '/dashboard/risks/new',
      icon: AlertTriangle,
      color: 'red',
    },
    {
      name: 'Upload Evidence',
      description: 'Upload supporting documentation',
      href: '/dashboard/evidence/upload',
      icon: FileText,
      color: 'purple',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'gap_assessment',
      title: 'New gap assessment created',
      description: 'ISO 27001:2022 Clause 7.3 - Awareness',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'action_plan',
      title: 'Action plan completed',
      description: 'Implement security awareness training',
      time: '4 hours ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'schedule',
      title: 'Schedule reminder',
      description: 'Quarterly Risk Assessment due in 3 days',
      time: '1 day ago',
      status: 'warning',
    },
    {
      id: 4,
      type: 'risk',
      title: 'New risk identified',
      description: 'Data breach risk - High priority',
      time: '2 days ago',
      status: 'critical',
    },
  ];

  const upcomingSchedules = [
    {
      id: 1,
      title: 'Quarterly Risk Assessment',
      dueDate: '2024-02-15',
      priority: 'critical',
      branch: 'Head Office',
    },
    {
      id: 2,
      title: 'Information Security Training',
      dueDate: '2024-02-20',
      priority: 'high',
      branch: 'Nairobi CBD',
    },
    {
      id: 3,
      title: 'Internal Audit Review',
      dueDate: '2024-02-25',
      priority: 'medium',
      branch: 'Mombasa Branch',
    },
  ];

  const complianceOverview = [
    { clause: 'Clause 4', progress: 85, status: 'good' },
    { clause: 'Clause 5', progress: 92, status: 'excellent' },
    { clause: 'Clause 6', progress: 78, status: 'good' },
    { clause: 'Clause 7', progress: 65, status: 'warning' },
    { clause: 'Clause 8', progress: 88, status: 'good' },
    { clause: 'Clause 9', progress: 95, status: 'excellent' },
    { clause: 'Clause 10', progress: 82, status: 'good' },
    { clause: 'Annex A', progress: 71, status: 'warning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-blue-100">
              Your compliance score is <span className="font-semibold">87%</span> - Great progress!
            </p>
          </div>
          <div className="hidden sm:block">
            <Shield className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className={`text-sm ${
                  metric.changeType === 'positive' ? 'text-green-600' :
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                metric.color === 'blue' ? 'bg-blue-100' :
                metric.color === 'orange' ? 'bg-orange-100' :
                metric.color === 'green' ? 'bg-green-100' :
                metric.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <metric.icon className={`h-6 w-6 ${
                  metric.color === 'blue' ? 'text-blue-600' :
                  metric.color === 'orange' ? 'text-orange-600' :
                  metric.color === 'green' ? 'text-green-600' :
                  metric.color === 'red' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  action.color === 'blue' ? 'bg-blue-100' :
                  action.color === 'green' ? 'bg-green-100' :
                  action.color === 'red' ? 'bg-red-100' :
                  action.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <action.icon className={`h-5 w-5 ${
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'green' ? 'text-green-600' :
                    action.color === 'red' ? 'text-red-600' :
                    action.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/activity"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all activity →
            </Link>
          </div>
        </div>

        {/* Upcoming Schedules */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Schedules</h2>
          <div className="space-y-4">
            {upcomingSchedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{schedule.title}</p>
                  <p className="text-xs text-gray-500">{schedule.branch}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority}
                  </span>
                  <span className="text-xs text-gray-500">{schedule.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link
              href="/dashboard/schedules"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all schedules →
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ISO 27001:2022 Compliance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceOverview.map((item) => (
            <div key={item.clause} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{item.clause}</span>
                <span className="text-sm text-gray-500">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(item.status)}`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/requirements"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View detailed compliance report →
          </Link>
        </div>
      </div>
    </div>
  );
}
