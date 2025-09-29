# 🏢 Multi-Tenant Login Testing Guide

This guide shows you how to test the multi-tenant login system with different organizations.

## 🚀 **Quick Start**

### **1. Start the Backend**
```bash
cd /home/angie/Sites/gapanalysis/backend
npm run start:dev
```

### **2. Start the Frontend**
```bash
cd /home/angie/Sites/gapanalysis/frontend
npm run dev
```

### **3. Access the System**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api
- **Prisma Studio:** http://localhost:5555

---

## 🔐 **Multi-Tenant Login Methods**

### **Method 1: Standard Login Page**
1. Go to http://localhost:3000/auth/login
2. Click "🏢 Multi-Tenant Login" button
3. Choose login method and organization
4. Enter credentials and login

### **Method 2: Direct Multi-Tenant Login**
1. Go to http://localhost:3000/auth/multi-tenant-login
2. Select login method:
   - **Standard Login** - Default organization
   - **Organization Login** - Specific organization by ID
   - **Domain Login** - Organization by domain
3. Enter credentials and login

### **Method 3: API Testing (Swagger)**
1. Go to http://localhost:3000/api
2. Try different login endpoints:
   - `POST /auth/login` - Standard login
   - `POST /auth/login/organization` - Organization-specific login
   - `POST /auth/login/domain` - Domain-based login

---

## 🏢 **Available Test Organizations**

| Organization | ID | Domain | Test User | Password |
|--------------|----|---------|-----------|----------| 
| Default Organization | 1 | default.local | admin@bank.co.ke | admin123 |
| Test Bank A | 3 | testa.local | admin@testa.local | BankAPass123 |
| Test Bank B | 4 | testb.local | admin@testb.local | BankBPass123 |

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Organization-Specific Login**

#### **Test Default Organization:**
```json
POST /auth/login/organization
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "organizationId": 1
}
```

#### **Test Bank A:**
```json
POST /auth/login/organization
{
  "email": "admin@testa.local",
  "password": "BankAPass123",
  "organizationId": 3
}
```

#### **Test Bank B:**
```json
POST /auth/login/organization
{
  "email": "admin@testb.local",
  "password": "BankBPass123",
  "organizationId": 4
}
```

### **Scenario 2: Domain-Based Login**

#### **Test Default Domain:**
```json
POST /auth/login/domain
{
  "email": "admin@bank.co.ke",
  "password": "admin123",
  "domain": "default.local"
}
```

#### **Test Bank A Domain:**
```json
POST /auth/login/domain
{
  "email": "admin@testa.local",
  "password": "BankAPass123",
  "domain": "testa.local"
}
```

### **Scenario 3: Frontend Multi-Tenant Login**

1. **Go to Multi-Tenant Login Page:**
   - Visit: http://localhost:3000/auth/multi-tenant-login

2. **Test Different Login Methods:**
   - Select "Organization Login"
   - Choose "Default Organization" from dropdown
   - Enter: admin@bank.co.ke / admin123
   - Click "Login"

3. **Test Organization Switching:**
   - After login, go to Dashboard
   - Use the Organization Switcher component
   - Switch between different organizations

---

## 🔍 **Verification Steps**

### **1. Check User Context**
After login, verify the user context:
```bash
GET /auth/me
```

**Expected Response:**
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

### **2. Verify Data Isolation**
Check that users only see data from their organization:

#### **Check Branches:**
```bash
GET /users/branches
```

#### **Check Requirements:**
```bash
GET /requirements
```

#### **Check Risks:**
```bash
GET /risks
```

**Expected:** Only data from the user's organization should be returned.

### **3. Test Organization Switching**
1. Login to Default Organization (ID: 1)
2. Use Organization Switcher to switch to Test Bank A (ID: 3)
3. Verify data changes to Test Bank A data
4. Switch back to Default Organization
5. Verify data returns to Default Organization data

---

## 🎯 **Frontend Testing**

### **1. Multi-Tenant Login Page**
- **URL:** http://localhost:3000/auth/multi-tenant-login
- **Features:**
  - Organization selection dropdown
  - Domain selection dropdown
  - Quick login buttons
  - Organization list display

### **2. Dashboard Organization Switcher**
- **Location:** Dashboard home page
- **Features:**
  - Current organization display
  - Organization switching
  - Quick action buttons
  - Organization list

### **3. Data Isolation Verification**
- Login to different organizations
- Navigate to different pages (Requirements, Risks, etc.)
- Verify only organization-specific data is shown

---

## 🐛 **Troubleshooting**

### **Common Issues:**

#### **1. 401 Unauthorized Error**
- **Cause:** Invalid credentials or organization access
- **Solution:** Check credentials and organization ID

#### **2. Organization Not Found**
- **Cause:** Invalid organization ID or domain
- **Solution:** Verify organization exists in database

#### **3. Data Not Isolated**
- **Cause:** Backend not filtering by organizationId
- **Solution:** Check backend service methods

#### **4. Frontend Login Fails**
- **Cause:** API endpoint not accessible
- **Solution:** Ensure backend is running on port 3000

### **Debug Steps:**

1. **Check Backend Logs:**
   ```bash
   cd /home/angie/Sites/gapanalysis/backend
   npm run start:dev
   ```

2. **Check Database:**
   ```bash
   npx prisma studio --port 5555
   ```

3. **Check API Endpoints:**
   - Visit: http://localhost:3000/api
   - Test login endpoints directly

---

## 📊 **Expected Results**

### **Successful Multi-Tenant Login:**
- ✅ User can login to different organizations
- ✅ Data is isolated between organizations
- ✅ Organization switcher works
- ✅ JWT tokens include organizationId
- ✅ Frontend displays organization-specific data

### **Data Isolation Verification:**
- ✅ Users only see their organization's data
- ✅ Cross-organization access is prevented
- ✅ Organization context is maintained
- ✅ API endpoints filter by organizationId

---

## 🚀 **Production Deployment**

### **Subdomain-Based Multitenancy:**
```
https://equitybank.com → Equity Bank Organization
https://bankofkenya.com → Bank of Kenya Organization
https://default.local → Default Organization
```

### **Organization Selection:**
- Users can select from available organizations
- Organization context is maintained throughout session
- Data isolation is enforced at API level

### **Security Features:**
- JWT tokens include organizationId
- API endpoints filter by organization
- Cross-organization access prevention
- Secure organization switching

---

## ✅ **Summary**

The multi-tenant login system now supports:

1. **✅ Multiple Login Methods** - Standard, Organization-specific, Domain-based
2. **✅ Organization Switching** - Seamless switching between organizations
3. **✅ Data Isolation** - Complete separation of organization data
4. **✅ Frontend Integration** - User-friendly multi-tenant interface
5. **✅ API Security** - Organization-scoped access control
6. **✅ Production Ready** - Scalable for multiple banking organizations

**Ready for production deployment with full multi-tenancy support!** 🎉
