"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Bell,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Schedule {
  id: number;
  type:
    | "RISK_ASSESSMENT"
    | "COMPLIANCE_REVIEW"
    | "AUDIT"
    | "TRAINING"
    | "MAINTENANCE";
  title: string;
  description: string;
  dueDate: string;
  frequency?:
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "ANNUAL"
    | "CUSTOM";
  customInterval?: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isRecurring: boolean;
  reminderDays: number[];
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const { user } = useAuth();

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  // Form data
  const [formData, setFormData] = useState({
    type: "COMPLIANCE_REVIEW" as Schedule["type"],
    title: "",
    description: "",
    dueDate: "",
    frequency: "MONTHLY" as Schedule["frequency"],
    customInterval: 1,
    priority: "MEDIUM" as Schedule["priority"],
    isRecurring: false,
    reminderDays: [1, 3, 7] as number[],
    branchId: 1,
    responsibleId: 1,
  });

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
          type: "RISK_ASSESSMENT",
          title: "Annual Risk Assessment",
          description:
            "Conduct comprehensive risk assessment for all business processes",
          dueDate: "2024-12-31T23:59:59.000Z",
          frequency: "ANNUAL",
          priority: "HIGH",
          isRecurring: true,
          reminderDays: [30, 7, 1],
          status: "PENDING",
          branchId: 1,
          responsibleId: 1,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          branch: {
            id: 1,
            name: "Head Office",
          },
          responsible: {
            id: 1,
            firstName: "John",
            lastName: "Doe",
          },
        },
        {
          id: 2,
          type: "COMPLIANCE_REVIEW",
          title: "Monthly Compliance Review",
          description: "Review compliance status and update documentation",
          dueDate: "2024-02-15T23:59:59.000Z",
          frequency: "MONTHLY",
          priority: "MEDIUM",
          isRecurring: true,
          reminderDays: [7, 3, 1],
          status: "IN_PROGRESS",
          branchId: 1,
          responsibleId: 2,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          branch: {
            id: 1,
            name: "Head Office",
          },
          responsible: {
            id: 2,
            firstName: "Jane",
            lastName: "Smith",
          },
        },
      ]);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new schedule object
      const newSchedule: Schedule = {
        id: Date.now(), // Temporary ID
        ...formData,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        branch: { id: formData.branchId, name: "Head Office" },
        responsible: {
          id: formData.responsibleId,
          firstName: "New",
          lastName: "User",
        },
      };

      // Add to schedules list
      setSchedules((prev) => [newSchedule, ...prev]);

      // Reset form and close modal
      setFormData({
        type: "COMPLIANCE_REVIEW",
        title: "",
        description: "",
        dueDate: "",
        frequency: "MONTHLY",
        customInterval: 1,
        priority: "MEDIUM",
        isRecurring: false,
        reminderDays: [1, 3, 7],
        branchId: 1,
        responsibleId: 1,
      });
      setShowCreateModal(false);

      alert("Schedule created successfully!");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      alert("Failed to create schedule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      type: "COMPLIANCE_REVIEW",
      title: "",
      description: "",
      dueDate: "",
      frequency: "MONTHLY",
      customInterval: 1,
      priority: "MEDIUM",
      isRecurring: false,
      reminderDays: [1, 3, 7],
      branchId: 1,
      responsibleId: 1,
    });
  };

  // View, Edit, Delete, and Complete handlers
  const handleViewSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowViewModal(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      type: schedule.type,
      title: schedule.title,
      description: schedule.description,
      dueDate: schedule.dueDate,
      frequency: schedule.frequency,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customInterval: schedule.customInterval as any,
      priority: schedule.priority,
      isRecurring: schedule.isRecurring,
      reminderDays: schedule.reminderDays,
      branchId: schedule.branchId,
      responsibleId: schedule.responsibleId,
    });
    setShowEditModal(true);
  };

  const handleDeleteSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleCompleteSchedule = async (schedule: Schedule) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update schedule status to completed
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === schedule.id
            ? { ...s, status: "COMPLETED", updatedAt: new Date().toISOString() }
            : s
        )
      );

      alert(`Schedule "${schedule.title}" marked as complete!`);
    } catch (error) {
      console.error("Failed to complete schedule:", error);
      alert("Failed to complete schedule. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Remove schedule from list
      setSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));

      setShowDeleteModal(false);
      setSelectedSchedule(null);
      alert(`Schedule "${selectedSchedule.title}" deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      alert("Failed to delete schedule. Please try again.");
    }
  };

  const handleUpdateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update schedule in the list
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === selectedSchedule.id
            ? { ...s, ...formData, updatedAt: new Date().toISOString() }
            : s
        )
      );

      setShowEditModal(false);
      setSelectedSchedule(null);
      setFormData({
        type: "COMPLIANCE_REVIEW",
        title: "",
        description: "",
        dueDate: "",
        frequency: "MONTHLY",
        customInterval: 1,
        priority: "MEDIUM",
        isRecurring: false,
        reminderDays: [1, 3, 7],
        branchId: 1,
        responsibleId: 1,
      });

      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Failed to update schedule:", error);
      alert("Failed to update schedule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedSchedule(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedSchedule(null);
    setFormData({
      type: "COMPLIANCE_REVIEW",
      title: "",
      description: "",
      dueDate: "",
      frequency: "MONTHLY",
      customInterval: 1,
      priority: "MEDIUM",
      isRecurring: false,
      reminderDays: [1, 3, 7],
      branchId: 1,
      responsibleId: 1,
    });
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSchedule(null);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          color: "bg-blue-100 text-blue-800",
          icon: Clock,
        };
      case "COMPLETED":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "OVERDUE":
        return {
          label: "Overdue",
          color: "bg-red-100 text-red-800",
          icon: AlertTriangle,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "RISK_ASSESSMENT":
        return "Risk Assessment";
      case "COMPLIANCE_REVIEW":
        return "Compliance Review";
      case "AUDIT":
        return "Audit";
      case "TRAINING":
        return "Training";
      case "MAINTENANCE":
        return "Maintenance";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "COMPLETED";
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || schedule.status === filterStatus;
    const matchesType = filterType === "all" || schedule.type === filterType;
    const matchesPriority =
      filterPriority === "all" || schedule.priority === filterPriority;

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
              Manage recurring compliance tasks and deadlines -{" "}
              <span className="font-semibold">
                {filteredSchedules.length} schedules
              </span>{" "}
              found
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
              <p className="text-sm font-medium text-gray-600">
                Total Schedules
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {schedules.length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter((s) => s.status === "PENDING").length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter((s) => isOverdue(s.dueDate, s.status)).length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {schedules.filter((s) => s.status === "COMPLETED").length}
              </p>
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
              <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300">
                <SelectItem
                  value="all"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="PENDING"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="IN_PROGRESS"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  In Progress
                </SelectItem>
                <SelectItem
                  value="COMPLETED"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Completed
                </SelectItem>
                <SelectItem
                  value="OVERDUE"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Overdue
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300">
                <SelectItem
                  value="all"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  All Types
                </SelectItem>
                <SelectItem
                  value="RISK_ASSESSMENT"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Risk Assessment
                </SelectItem>
                <SelectItem
                  value="COMPLIANCE_REVIEW"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Compliance Review
                </SelectItem>
                <SelectItem
                  value="AUDIT"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Audit
                </SelectItem>
                <SelectItem
                  value="TRAINING"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Training
                </SelectItem>
                <SelectItem
                  value="MAINTENANCE"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Maintenance
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300">
                <SelectItem
                  value="all"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  All Priorities
                </SelectItem>
                <SelectItem
                  value="CRITICAL"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Critical
                </SelectItem>
                <SelectItem
                  value="HIGH"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  High
                </SelectItem>
                <SelectItem
                  value="MEDIUM"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="LOW"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Low
                </SelectItem>
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
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
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
              <div
                key={schedule.id}
                className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${
                  overdue ? "border-red-200" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      {schedule.title}
                      {schedule.isRecurring && (
                        <Repeat className="h-4 w-4 text-blue-600" />
                      )}
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
                      <span className="text-gray-700 font-medium">
                        Due Date:
                      </span>
                      <div className="font-medium text-gray-900">
                        {formatDate(schedule.dueDate)}
                        {overdue && (
                          <span className="text-red-600 ml-1">(Overdue)</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">
                        Responsible:
                      </span>
                      <div className="font-medium text-gray-900">
                        {schedule.responsible?.firstName}{" "}
                        {schedule.responsible?.lastName}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">
                        Frequency:
                      </span>
                      <div className="font-medium text-gray-900">
                        {schedule.frequency || "One-time"}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-700 font-medium">
                        Reminders:
                      </span>
                      <div className="font-medium text-gray-900 flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        {schedule.reminderDays.join(", ")} days before
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewSchedule(schedule)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {schedule.status !== "COMPLETED" && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCompleteSchedule(schedule)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteSchedule(schedule)}
                    >
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No schedules found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              filterStatus !== "all" ||
              filterType !== "all" ||
              filterPriority !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by creating your first schedule."}
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>
        )}
      </div>

      {/* Create Schedule Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Create a new schedule for compliance activities, risk assessments,
              or other tasks.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Schedule Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem
                      value="RISK_ASSESSMENT"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Risk Assessment
                    </SelectItem>
                    <SelectItem
                      value="COMPLIANCE_REVIEW"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Compliance Review
                    </SelectItem>
                    <SelectItem
                      value="AUDIT"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Audit
                    </SelectItem>
                    <SelectItem
                      value="TRAINING"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Training
                    </SelectItem>
                    <SelectItem
                      value="MAINTENANCE"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem
                      value="LOW"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Low
                    </SelectItem>
                    <SelectItem
                      value="MEDIUM"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="HIGH"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      High
                    </SelectItem>
                    <SelectItem
                      value="CRITICAL"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Critical
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter schedule title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter schedule description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) =>
                    handleInputChange("frequency", value)
                  }
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem
                      value="DAILY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Daily
                    </SelectItem>
                    <SelectItem
                      value="WEEKLY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Weekly
                    </SelectItem>
                    <SelectItem
                      value="MONTHLY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Monthly
                    </SelectItem>
                    <SelectItem
                      value="QUARTERLY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Quarterly
                    </SelectItem>
                    <SelectItem
                      value="ANNUAL"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Annual
                    </SelectItem>
                    <SelectItem
                      value="CUSTOM"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Custom
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.frequency === "CUSTOM" && (
              <div className="space-y-2">
                <Label htmlFor="customInterval">Custom Interval (days)</Label>
                <Input
                  id="customInterval"
                  type="number"
                  min="1"
                  value={formData.customInterval}
                  onChange={(e) =>
                    handleInputChange(
                      "customInterval",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  handleInputChange("isRecurring", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="isRecurring">This is a recurring schedule</Label>
            </div>

            <div className="space-y-2">
              <Label>Reminder Days</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 3, 7, 14, 30].map((day) => (
                  <label key={day} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={formData.reminderDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange("reminderDays", [
                            ...formData.reminderDays,
                            day,
                          ]);
                        } else {
                          handleInputChange(
                            "reminderDays",
                            formData.reminderDays.filter((d) => d !== day)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {day} day{day !== 1 ? "s" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Schedule Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Details</DialogTitle>
            <DialogDescription>
              View detailed information about this schedule.
            </DialogDescription>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Schedule Title
                </Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedSchedule.title}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedSchedule.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Type
                  </Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedSchedule.type.replace("_", " ")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Priority
                  </Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedSchedule.priority}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Due Date
                  </Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {new Date(selectedSchedule.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Frequency
                  </Label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {selectedSchedule.frequency}
                    {selectedSchedule.frequency === "CUSTOM" &&
                      ` (${selectedSchedule.customInterval} days)`}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <div className="flex items-center gap-2">
                  <Badge
                    className={getStatusInfo(selectedSchedule.status).color}
                  >
                    {getStatusInfo(selectedSchedule.status).label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Recurring
                </Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedSchedule.isRecurring ? "Yes" : "No"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Reminder Days
                </Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedSchedule.reminderDays.join(", ")} days before
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Responsible
                  </Label>
                  <p className="text-sm text-gray-900">
                    {selectedSchedule.responsible?.firstName}{" "}
                    {selectedSchedule.responsible?.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Branch
                  </Label>
                  <p className="text-sm text-gray-900">
                    {selectedSchedule.branch?.name}
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

      {/* Edit Schedule Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the schedule information and settings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSchedule} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Schedule Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem
                      value="RISK_ASSESSMENT"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Risk Assessment
                    </SelectItem>
                    <SelectItem
                      value="COMPLIANCE_REVIEW"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Compliance Review
                    </SelectItem>
                    <SelectItem
                      value="AUDIT"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Audit
                    </SelectItem>
                    <SelectItem
                      value="TRAINING"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Training
                    </SelectItem>
                    <SelectItem
                      value="MAINTENANCE"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Maintenance
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem
                      value="LOW"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Low
                    </SelectItem>
                    <SelectItem
                      value="MEDIUM"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="HIGH"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      High
                    </SelectItem>
                    <SelectItem
                      value="CRITICAL"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Critical
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter schedule title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter schedule description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) =>
                    handleInputChange("frequency", value)
                  }
                >
                  <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem
                      value="DAILY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Daily
                    </SelectItem>
                    <SelectItem
                      value="WEEKLY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Weekly
                    </SelectItem>
                    <SelectItem
                      value="MONTHLY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Monthly
                    </SelectItem>
                    <SelectItem
                      value="QUARTERLY"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Quarterly
                    </SelectItem>
                    <SelectItem
                      value="ANNUAL"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Annual
                    </SelectItem>
                    <SelectItem
                      value="CUSTOM"
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      Custom
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.frequency === "CUSTOM" && (
              <div className="space-y-2">
                <Label htmlFor="edit-customInterval">
                  Custom Interval (days)
                </Label>
                <Input
                  id="edit-customInterval"
                  type="number"
                  min="1"
                  value={formData.customInterval}
                  onChange={(e) =>
                    handleInputChange(
                      "customInterval",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isRecurring"
                checked={formData.isRecurring}
                onChange={(e) =>
                  handleInputChange("isRecurring", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-isRecurring">
                This is a recurring schedule
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Reminder Days</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 3, 7, 14, 30].map((day) => (
                  <label key={day} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={formData.reminderDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange("reminderDays", [
                            ...formData.reminderDays,
                            day,
                          ]);
                        } else {
                          handleInputChange(
                            "reminderDays",
                            formData.reminderDays.filter((d) => d !== day)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {day} day{day !== 1 ? "s" : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseEditModal}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedSchedule && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">
                    Schedule to be deleted:
                  </span>
                </div>
                <p className="text-sm text-red-700 font-medium">
                  {selectedSchedule.title}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Type: {selectedSchedule.type.replace("_", " ")} | Priority:{" "}
                  {selectedSchedule.priority} | Due:{" "}
                  {new Date(selectedSchedule.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
