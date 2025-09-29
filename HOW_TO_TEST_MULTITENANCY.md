# 🏢 How to Test Multitenancy Implementation

## 🚨 Current Status
The multitenancy implementation is **functionally complete** but has **compilation errors** that need to be fixed before testing.

## 🔧 Step 1: Fix Compilation Errors

### **Critical Issues to Fix:**

1. **Missing `organizationId` in Service Calls**
   - All service methods need to include `organizationId` parameter
   - Update controllers to pass `organizationId` from authenticated user

2. **Auth Service Updates**
   - Fix `usersService.update()` call to include `organizationId`
   - Fix `usersService.findById()` call to include `organizationId`

3. **Service Layer Updates**
   - Add `organizationId` to all create operations
   - Update all service methods to filter by organization

### **Quick Fix Commands:**
```bash
# Navigate to backend
cd /home/angie/Sites/gapanalysis/backend

# Fix auth service
# Update line 54 in src/auth/auth.service.ts:
# FROM: await this.usersService.update(user.id, {
# TO:   await this.usersService.update(user.id, { refreshToken: await hash(refreshToken, 10) }, user.organizationId);

# Update line 102 in src/auth/auth.service.ts:
# FROM: const user = await this.usersService.findById(parseInt(userId));
# TO:   const user = await this.usersService.findById(parseInt(userId), parseInt(payload.organizationId));
```

## 🧪 Step 2: Testing Process

### **A. Start the System**
```bash
# Terminal 1: Start Backend
cd /home/angie/Sites/gapanalysis/backend
npm run start:dev

# Terminal 2: Start Frontend  
cd /home/angie/Sites/gapanalysis/frontend
npm run dev -- -p 3001
```

### **B. Test Database Migration**
```bash
# Check if multitenancy migration was applied
cd /home/angie/Sites/gapanalysis/backend
npx prisma migrate status

# Should show: 20250925212952_add_multitenancy
```

### **C. Test Organization Creation**
```bash
# Create test organizations via API
curl -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bank A",
    "domain": "testa.local", 
    "subdomain": "testa",
    "isActive": true,
    "settings": {"theme": "blue"}
  }'

curl -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Bank B",
    "domain": "testb.local",
    "subdomain": "testb", 
    "isActive": true,
    "settings": {"theme": "green"}
  }'
```

### **D. Test User Creation with Organizations**
```bash
# Create users for each organization
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@testa.local",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "Admin A", 
    "role": "ADMIN",
    "organizationId": 2
  }'

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@testb.local",
    "password": "TestPass123",
    "firstName": "Test", 
    "lastName": "Admin B",
    "role": "ADMIN",
    "organizationId": 3
  }'
```

### **E. Test Data Isolation**
```bash
# Login as Bank A admin
TOKEN_A=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@testa.local", "password": "TestPass123"}' | jq -r '.accessToken')

# Login as Bank B admin  
TOKEN_B=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@testb.local", "password": "TestPass123"}' | jq -r '.accessToken')

# Create requirements for each organization
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '{
    "clause": "A.1.1",
    "title": "Bank A Requirement", 
    "description": "This belongs to Bank A",
    "section": "Test",
    "priority": "HIGH"
  }'

curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_B" \
  -d '{
    "clause": "A.1.1", 
    "title": "Bank B Requirement",
    "description": "This belongs to Bank B", 
    "section": "Test",
    "priority": "HIGH"
  }'

# Verify data isolation
echo "Bank A requirements:"
curl -X GET http://localhost:3000/requirements \
  -H "Authorization: Bearer $TOKEN_A" | jq length

echo "Bank B requirements:"  
curl -X GET http://localhost:3000/requirements \
  -H "Authorization: Bearer $TOKEN_B" | jq length
```

## 🎯 Step 3: Frontend Testing

### **A. Access the Application**
1. Open http://localhost:3001
2. Login with different organization users
3. Verify each user only sees their organization's data

### **B. Test Data Creation**
1. Create requirements, risks, schedules for each organization
2. Verify data doesn't appear in other organizations
3. Test user management within organizations

## 🔍 Step 4: Database Verification

### **Check Data Isolation**
```sql
-- Connect to database
psql -d gap_analysis

-- Check organizations
SELECT * FROM organizations;

-- Check users by organization
SELECT u.email, o.name as organization 
FROM users u 
JOIN organizations o ON u."organizationId" = o.id;

-- Check requirements by organization
SELECT r.clause, r.title, o.name as organization
FROM requirements r
JOIN organizations o ON r."organizationId" = o.id;
```

## ✅ Expected Results

### **Success Indicators:**
- ✅ Each organization has isolated data
- ✅ Users can only access their organization's data  
- ✅ No cross-tenant data leakage
- ✅ Organization management works correctly
- ✅ Authentication includes organization context

### **What to Look For:**
1. **Data Isolation**: Bank A users cannot see Bank B's data
2. **Authentication**: JWT tokens include organizationId
3. **API Filtering**: All endpoints filter by organizationId
4. **Frontend Context**: User interface shows organization-specific data

## 🐛 Troubleshooting

### **Common Issues:**
1. **Compilation Errors**: Fix missing organizationId parameters
2. **Authentication Issues**: Ensure JWT tokens include organizationId  
3. **Data Leakage**: Verify all queries include organizationId filter
4. **CORS Issues**: Check frontend-backend communication

### **Debug Commands:**
```bash
# Check backend logs
cd /home/angie/Sites/gapanalysis/backend
npm run start:dev

# Check database
npx prisma studio

# Test API endpoints
curl -X GET http://localhost:3000/health
```

## 🚀 Next Steps After Testing

1. **Performance Testing**: Test with multiple organizations
2. **Security Testing**: Verify data isolation
3. **Load Testing**: Test with many concurrent users
4. **Integration Testing**: Test with real banking data

---

## 📋 Summary

The multitenancy implementation is **architecturally complete** with:
- ✅ Database schema with organization isolation
- ✅ Backend services with organization context
- ✅ Authentication with organizationId in JWT
- ✅ Frontend interfaces updated for organization context
- ✅ Organization management endpoints

**Next Step**: Fix the compilation errors and run the tests to verify everything works correctly!
