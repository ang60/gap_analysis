# 🔐 Role-Based Access Control (RBAC) for Multi-Tenant System

This guide explains the role-based access control system that identifies different tenants and enforces proper permissions.

## 🏢 **Tenant Identification System**

### **1. Organization-Based Tenants**
Each user belongs to a specific organization (tenant):
- **Default Organization** (ID: 1) - `default.local`
- **Test Bank A** (ID: 3) - `testa.local`
- **Test Bank B** (ID: 4) - `testb.local`

### **2. User Roles by Organization**
Each organization has users with different roles:

| Role | Description | Primary Focus |
|------|-------------|---------------|
| **ADMIN** | Support & Coordination | Technical support, system coordination, user assistance |
| **MANAGER** | Direction & Decision-making | Strategic direction, resource allocation, key decisions |
| **COMPLIANCE_OFFICER** | Oversight & Regulatory Assurance | Compliance monitoring, regulatory adherence, audit oversight |
| **STAFF** | Input & Implementation | Data entry, task execution, operational implementation |

---

## 🔐 **Access Control Implementation**

### **1. Tenant Guards**
- **TenantGuard**: Ensures users can only access their organization's data
- **TenantRoleGuard**: Combines tenant isolation with role-based permissions
- **OrganizationGuard**: Validates organization access

### **2. Role-Based Permissions**

#### **ADMIN Role - Support & Coordination:**
```typescript
@Roles(UserRole.ADMIN)
```
**Primary Focus:** Technical support, system coordination, user assistance
- ✅ **System Support** - Troubleshoot technical issues, maintain system functionality
- ✅ **User Coordination** - Assist users with system access, password resets, account issues
- ✅ **Data Coordination** - Ensure data integrity, backup coordination, system maintenance
- ✅ **Training Support** - Provide user training, documentation, system guidance
- ✅ **Integration Support** - Coordinate with external systems, API management
- ❌ **Cannot make business decisions** or strategic choices

#### **MANAGER Role - Direction & Decision-making:**
```typescript
@Roles(UserRole.MANAGER)
```
**Primary Focus:** Strategic direction, resource allocation, key decisions
- ✅ **Strategic Direction** - Set compliance goals, define organizational priorities
- ✅ **Resource Allocation** - Assign staff, allocate budgets, prioritize initiatives
- ✅ **Decision Making** - Approve action plans, resolve compliance conflicts
- ✅ **Performance Management** - Evaluate compliance performance, set targets
- ✅ **Risk Management** - Make risk acceptance decisions, approve mitigation strategies
- ❌ **Cannot perform technical system maintenance** or user account management

#### **COMPLIANCE_OFFICER Role - Oversight & Regulatory Assurance:**
```typescript
@Roles(UserRole.COMPLIANCE_OFFICER)
```
**Primary Focus:** Compliance monitoring, regulatory adherence, audit oversight
- ✅ **Regulatory Oversight** - Monitor adherence to regulations, ensure compliance
- ✅ **Audit Management** - Conduct internal audits, prepare for external audits
- ✅ **Compliance Monitoring** - Track compliance status, identify gaps
- ✅ **Regulatory Reporting** - Prepare compliance reports, submit to regulators
- ✅ **Policy Development** - Develop compliance policies, update procedures
- ❌ **Cannot make strategic business decisions** or allocate resources

#### **STAFF Role - Input & Implementation:**
```typescript
@Roles(UserRole.STAFF)
```
**Primary Focus:** Data entry, task execution, operational implementation
- ✅ **Data Input** - Enter compliance data, update status information
- ✅ **Task Implementation** - Execute assigned compliance tasks, complete actions
- ✅ **Evidence Collection** - Gather compliance evidence, maintain documentation
- ✅ **Progress Reporting** - Report task progress, update completion status
- ✅ **Operational Support** - Support day-to-day compliance operations
- ❌ **Cannot create policies** or make compliance decisions

---

## 🧪 **Testing Role-Based Access**

### **Test 1: Admin Access**
```bash
# Login as Admin
POST /auth/login/organization
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "organizationId": 1
}

# Test Admin permissions
GET /users - Should work (ADMIN can view all users)
GET /organizations - Should work (ADMIN can view organizations)
POST /users - Should work (ADMIN can create users)
```

### **Test 2: Manager Access**
```bash
# Login as Manager
POST /auth/login/organization
{
  "email": "manager@bank.co.ke",
  "password": "ManagerPass123",
  "organizationId": 1
}

# Test Manager permissions
GET /users - Should work (MANAGER can view users)
GET /users/branches - Should work (MANAGER can view branches)
POST /users/branches - Should work (MANAGER can create branches)
```

### **Test 3: Staff Access**
```bash
# Login as Staff
POST /auth/login/organization
{
  "email": "officer@bank.co.ke",
  "password": "OfficerPass123",
  "organizationId": 1
}

# Test Staff permissions
GET /users - Should fail (STAFF cannot view all users)
GET /requirements - Should work (STAFF can view requirements)
GET /risks - Should work (STAFF can view risks)
```

### **Test 4: Cross-Organization Access**
```bash
# Login to Organization 1
POST /auth/login/organization
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "organizationId": 1
}

# Try to access Organization 3 data
GET /organizations/3 - Should fail (Cannot access other organizations)
GET /users?organizationId=3 - Should fail (Cannot access other organizations)
```

---

## 🏢 **Multi-Tenant Data Isolation**

### **1. Automatic Tenant Filtering**
All API endpoints automatically filter data by organization:

```typescript
// Users can only see their organization's data
GET /users → Returns users from user.organizationId only
GET /requirements → Returns requirements from user.organizationId only
GET /risks → Returns risks from user.organizationId only
```

### **2. Tenant Context Injection**
The system automatically adds tenant context to requests:

```typescript
// Request automatically includes:
request.organizationId = user.organizationId;
request.tenantId = user.organizationId;
request.userRole = user.role;
```

### **3. Cross-Tenant Access Prevention**
Users cannot access data from other organizations:

```typescript
// These will fail:
GET /organizations/3 (when user is in organization 1)
GET /users?organizationId=3 (when user is in organization 1)
POST /requirements (with organizationId: 3 when user is in organization 1)
```

---

## 🔧 **Implementation Details**

### **1. Tenant-Aware Services**
All services extend `TenantAwareService` for automatic tenant filtering:

```typescript
export class UsersService extends TenantAwareService {
  async findAll(organizationId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { organizationId } // Automatic tenant filtering
    });
  }
}
```

### **2. Role-Based Guards**
Controllers use `TenantRoleGuard` for combined access control:

```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, TenantRoleGuard)
export class UsersController {
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async getUsers(@CurrentUser() user: User) {
    // Only ADMIN and MANAGER can access
    // Only users from same organization
  }
}
```

### **3. Automatic Organization Context**
The system automatically:
- ✅ Validates user belongs to organization
- ✅ Filters data by organizationId
- ✅ Prevents cross-organization access
- ✅ Enforces role-based permissions

---

## 🎯 **Frontend Integration**

### **1. Role-Based UI Components**
The frontend can show/hide components based on user role:

```typescript
// Show admin-only features
{user.role === 'ADMIN' && <AdminPanel />}

// Show manager features
{['ADMIN', 'MANAGER'].includes(user.role) && <ManagerPanel />}

// Show staff features
{user.role === 'STAFF' && <StaffPanel />}
```

### **2. Organization Context Display**
Show current organization and allow switching:

```typescript
// Display current organization
<div>Current Organization: {user.organization.name}</div>

// Organization switcher (for multi-org users)
<OrganizationSwitcher 
  currentOrganizationId={user.organizationId}
  onOrganizationChange={handleOrgSwitch}
/>
```

### **3. Permission-Based Navigation**
Show navigation items based on user role:

```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
  { name: 'Users', href: '/users', roles: ['ADMIN', 'MANAGER'] },
  { name: 'Organizations', href: '/organizations', roles: ['ADMIN'] },
  { name: 'Requirements', href: '/requirements', roles: ['ADMIN', 'MANAGER', 'STAFF'] },
];
```

---

## 🚀 **Production Deployment**

### **1. Tenant Identification**
- **Subdomain-based**: `equitybank.com`, `bankofkenya.com`
- **Path-based**: `/org/equitybank`, `/org/bankofkenya`
- **Header-based**: `X-Organization-ID` header

### **2. Role Hierarchy & Focus Areas**
```
MANAGER (Direction & Decision-making)
├── Strategic planning and resource allocation
├── Business decisions and risk management
└── Performance oversight

COMPLIANCE_OFFICER (Oversight & Regulatory Assurance)
├── Regulatory compliance monitoring
├── Audit management and reporting
└── Policy development and enforcement

ADMIN (Support & Coordination)
├── Technical system support
├── User assistance and training
└── Data coordination and maintenance

STAFF (Input & Implementation)
├── Data entry and task execution
├── Evidence collection and reporting
└── Operational implementation
```

### **3. Security Features**
- ✅ JWT tokens include organizationId and role
- ✅ API endpoints filter by organization
- ✅ Cross-organization access prevention
- ✅ Role-based permission enforcement
- ✅ Automatic tenant context injection

---

## ✅ **Summary**

The role-based access control system provides:

1. **✅ Multi-Tenant Isolation** - Complete data separation between organizations
2. **✅ Role-Based Permissions** - Different access levels for different roles
3. **✅ Automatic Filtering** - All data automatically filtered by organization
4. **✅ Security Enforcement** - Cross-organization access prevention
5. **✅ Flexible Architecture** - Easy to add new roles and permissions
6. **✅ Production Ready** - Scalable for multiple banking organizations

**Ready for production deployment with full role-based access control!** 🎉
