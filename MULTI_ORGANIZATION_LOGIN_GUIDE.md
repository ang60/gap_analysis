# 🏢 Multi-Organization Login Guide

This guide explains how to login as different organizations in the multitenancy system.

## 🚀 **Available Login Methods**

### **1. Standard Login (Default Organization)**
**Endpoint:** `POST /auth/login`

```json
{
  "email": "admin@bank.co.ke",
  "password": "admin123"
}
```

**Use Case:** Login to the user's default organization (Organization ID 1)

---

### **2. Organization-Specific Login**
**Endpoint:** `POST /auth/login/organization`

```json
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "organizationId": 1
}
```

**Use Case:** Login to a specific organization by ID

**Available Organizations:**
- **Organization ID 1:** Default Organization (default.local)
- **Organization ID 3:** Test Bank A (testa.local)
- **Organization ID 4:** Test Bank B (testb.local)

---

### **3. Domain-Based Login**
**Endpoint:** `POST /auth/login/domain`

```json
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "domain": "default.local"
}
```

**Use Case:** Login using organization domain (useful for subdomain-based multitenancy)

**Available Domains:**
- `default.local` - Default Organization
- `testa.local` - Test Bank A
- `testb.local` - Test Bank B

---

## 🔧 **How to Test Different Organizations**

### **Step 1: Check Available Organizations**
```bash
# Get list of organizations
GET /organizations
```

### **Step 2: Login to Specific Organization**

#### **Login to Default Organization:**
```json
POST /auth/login/organization
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "organizationId": 1
}
```

#### **Login to Test Bank A:**
```json
POST /auth/login/organization
{
  "email": "admin@testa.local",
  "password": "BankAPass123",
  "organizationId": 3
}
```

#### **Login to Test Bank B:**
```json
POST /auth/login/organization
{
  "email": "admin@testb.local",
  "password": "BankBPass123",
  "organizationId": 4
}
```

### **Step 3: Verify Organization Context**

After login, check your current user context:
```bash
GET /auth/me
```

**Response will show:**
```json
{
  "id": 1,
  "email": "admin@bank.co.ke",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "ADMIN",
  "organizationId": 1,
  "organization": {
    "id": 1,
    "name": "Default Organization",
    "domain": "default.local"
  }
}
```

---

## 🌐 **Real-World Implementation Scenarios**

### **Scenario 1: Subdomain-Based Multitenancy**
```
https://equitybank.com → Organization: Equity Bank
https://bankofkenya.com → Organization: Bank of Kenya
https://default.local → Organization: Default Organization
```

**Login Process:**
1. User visits `https://equitybank.com`
2. System extracts domain: `equitybank.com`
3. User enters credentials
4. System logs them into Equity Bank organization

### **Scenario 2: Organization Selection**
```
User: admin@bank.co.ke
Available Organizations:
- Default Organization (ID: 1)
- Test Bank A (ID: 3)
- Test Bank B (ID: 4)
```

**Login Process:**
1. User enters email/password
2. System shows available organizations
3. User selects organization
4. System logs them into selected organization

### **Scenario 3: Single Sign-On (SSO)**
```
User logs in once and can switch between organizations
```

**Implementation:**
1. User logs in with primary organization
2. System provides organization switcher
3. User can switch context without re-authentication

---

## 🔐 **Security & Data Isolation**

### **Organization-Scoped Data Access**
- ✅ Users can only see data from their organization
- ✅ API endpoints automatically filter by `organizationId`
- ✅ Cross-organization data access is prevented
- ✅ JWT tokens include `organizationId` for context

### **Example Data Isolation:**
```bash
# User from Organization 1 can only see:
GET /users/branches → Returns branches from Organization 1 only
GET /requirements → Returns requirements from Organization 1 only
GET /risks → Returns risks from Organization 1 only

# User from Organization 3 can only see:
GET /users/branches → Returns branches from Organization 3 only
GET /requirements → Returns requirements from Organization 3 only
GET /risks → Returns risks from Organization 3 only
```

---

## 🧪 **Testing Multi-Organization Login**

### **Test 1: Login to Different Organizations**
```bash
# Login to Default Organization
curl -X POST http://localhost:3000/auth/login/organization \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bank.co.ke", "password": "admin123", "organizationId": 1}'

# Login to Test Bank A
curl -X POST http://localhost:3000/auth/login/organization \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@testa.local", "password": "BankAPass123", "organizationId": 3}'
```

### **Test 2: Verify Data Isolation**
```bash
# After logging in, check your context
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Check organization-specific data
curl -X GET http://localhost:3000/users/branches \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **Test 3: Domain-Based Login**
```bash
# Login using domain
curl -X POST http://localhost:3000/auth/login/domain \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bank.co.ke", "password": "admin123", "domain": "default.local"}'
```

---

## 📋 **Available Test Users**

| Email | Password | Organization | Organization ID |
|-------|----------|--------------|-----------------|
| admin@bank.co.ke | admin123 | Default Organization | 1 |
| manager@bank.co.ke | manager123 | Default Organization | 1 |
| admin@testa.local | BankAPass123 | Test Bank A | 3 |
| admin@testb.local | BankBPass123 | Test Bank B | 4 |

---

## 🎯 **Frontend Implementation**

### **Organization Switcher Component**
```typescript
// Organization switcher in frontend
const switchOrganization = async (organizationId: number) => {
  const response = await fetch('/auth/login/organization', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: currentUser.email,
      password: currentUser.password, // Store securely
      organizationId: organizationId
    })
  });
  
  const { accessToken } = await response.json();
  // Update token and redirect
};
```

### **Domain-Based Routing**
```typescript
// Route based on subdomain
const getOrganizationFromDomain = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('equitybank.com')) return 'equitybank.com';
  if (hostname.includes('bankofkenya.com')) return 'bankofkenya.com';
  return 'default.local';
};
```

---

## ✅ **Summary**

The multitenancy system now supports:

1. **✅ Standard Login** - Default organization
2. **✅ Organization-Specific Login** - By organization ID
3. **✅ Domain-Based Login** - By organization domain
4. **✅ Complete Data Isolation** - Organization-scoped access
5. **✅ JWT Token Context** - Includes organization information
6. **✅ Security** - Cross-organization access prevention

**Ready for production deployment with multiple banking organizations!** 🚀
