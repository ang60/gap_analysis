# 🏢 Multitenancy Testing Guide

## Overview
This guide will help you test the multitenancy implementation to ensure that multiple banking organizations can operate independently with complete data isolation.

## 🚀 Quick Start Testing

### 1. **Start the Backend**
```bash
cd /home/angie/Sites/gapanalysis/backend
npm run start:dev
```

### 2. **Start the Frontend**
```bash
cd /home/angie/Sites/gapanalysis/frontend
npm run dev -- -p 3001
```

### 3. **Access the Application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

## 🧪 Testing Scenarios

### **Scenario 1: Create Multiple Organizations**

#### Step 1: Create Test Organizations
```bash
# Create Organization 1 - Bank A
curl -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bank A",
    "domain": "banka.local",
    "subdomain": "banka",
    "isActive": true,
    "settings": {"theme": "blue", "logo": "banka-logo.png"}
  }'

# Create Organization 2 - Bank B
curl -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bank B",
    "domain": "bankb.local", 
    "subdomain": "bankb",
    "isActive": true,
    "settings": {"theme": "green", "logo": "bankb-logo.png"}
  }'
```

#### Step 2: Create Users for Each Organization
```bash
# Create user for Bank A
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@banka.local",
    "password": "BankAPass123",
    "firstName": "Bank A",
    "lastName": "Admin",
    "role": "ADMIN",
    "organizationId": 2
  }'

# Create user for Bank B
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bankb.local",
    "password": "BankBPass123", 
    "firstName": "Bank B",
    "lastName": "Admin",
    "role": "ADMIN",
    "organizationId": 3
  }'
```

### **Scenario 2: Test Data Isolation**

#### Step 1: Login as Bank A Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@banka.local",
    "password": "BankAPass123"
  }'
```

#### Step 2: Create Requirements for Bank A
```bash
# Use the JWT token from login response
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "clause": "A.5.1",
    "title": "Bank A Specific Requirement",
    "description": "This requirement belongs to Bank A only",
    "section": "Access Control",
    "priority": "HIGH"
  }'
```

#### Step 3: Login as Bank B Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bankb.local", 
    "password": "BankBPass123"
  }'
```

#### Step 4: Verify Data Isolation
```bash
# List requirements - should only show Bank B's requirements
curl -X GET http://localhost:3000/requirements \
  -H "Authorization: Bearer BANK_B_JWT_TOKEN"
```

### **Scenario 3: Test Organization Management**

#### Step 1: List All Organizations
```bash
curl -X GET http://localhost:3000/organizations \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### Step 2: Get Organization Statistics
```bash
curl -X GET http://localhost:3000/organizations/1/stats \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

#### Step 3: Update Organization Settings
```bash
curl -X PUT http://localhost:3000/organizations/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "settings": {
      "theme": "dark",
      "logo": "new-logo.png",
      "customFields": ["field1", "field2"]
    }
  }'
```

## 🔍 Automated Testing Script

### **Create Test Script**
```bash
# Create test script
cat > test_multitenancy.sh << 'EOF'
#!/bin/bash

echo "🧪 Starting Multitenancy Tests..."

# Test 1: Create Organizations
echo "📝 Creating test organizations..."
ORG_A=$(curl -s -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Bank A", "domain": "testa.local", "subdomain": "testa", "isActive": true}' | jq -r '.id')

ORG_B=$(curl -s -X POST http://localhost:3000/organizations \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Bank B", "domain": "testb.local", "subdomain": "testb", "isActive": true}' | jq -r '.id')

echo "✅ Created organizations: A=$ORG_A, B=$ORG_B"

# Test 2: Create Users
echo "👥 Creating test users..."
curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"admin@testa.local\", \"password\": \"TestPass123\", \"firstName\": \"Test\", \"lastName\": \"Admin A\", \"role\": \"ADMIN\", \"organizationId\": $ORG_A}"

curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"admin@testb.local\", \"password\": \"TestPass123\", \"firstName\": \"Test\", \"lastName\": \"Admin B\", \"role\": \"ADMIN\", \"organizationId\": $ORG_B}"

echo "✅ Created test users"

# Test 3: Login and Test Data Isolation
echo "🔐 Testing data isolation..."

# Login as Bank A
TOKEN_A=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@testa.local", "password": "TestPass123"}' | jq -r '.accessToken')

# Login as Bank B  
TOKEN_B=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@testb.local", "password": "TestPass123"}' | jq -r '.accessToken')

echo "✅ Login successful for both organizations"

# Test 4: Create Requirements for Each Organization
echo "📋 Creating requirements for each organization..."

# Create requirement for Bank A
curl -s -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '{"clause": "A.1.1", "title": "Bank A Requirement", "description": "This belongs to Bank A", "section": "Test", "priority": "HIGH"}'

# Create requirement for Bank B
curl -s -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_B" \
  -d '{"clause": "A.1.1", "title": "Bank B Requirement", "description": "This belongs to Bank B", "section": "Test", "priority": "HIGH"}'

echo "✅ Created requirements for both organizations"

# Test 5: Verify Data Isolation
echo "🔍 Verifying data isolation..."

REQ_A=$(curl -s -X GET http://localhost:3000/requirements \
  -H "Authorization: Bearer $TOKEN_A" | jq length)

REQ_B=$(curl -s -X GET http://localhost:3000/requirements \
  -H "Authorization: Bearer $TOKEN_B" | jq length)

echo "📊 Bank A requirements: $REQ_A"
echo "📊 Bank B requirements: $REQ_B"

if [ "$REQ_A" -eq 1 ] && [ "$REQ_B" -eq 1 ]; then
  echo "✅ Data isolation working correctly!"
else
  echo "❌ Data isolation failed!"
fi

echo "🎉 Multitenancy tests completed!"
EOF

chmod +x test_multitenancy.sh
```

## 🎯 Manual Testing Steps

### **Step 1: Frontend Testing**
1. Open http://localhost:3001
2. Register/login with different organization users
3. Verify that each user only sees their organization's data
4. Test creating requirements, risks, schedules for each organization
5. Verify data doesn't leak between organizations

### **Step 2: API Testing with Postman/Insomnia**
1. Import the API collection
2. Test organization CRUD operations
3. Test user management within organizations
4. Test data isolation across all endpoints

### **Step 3: Database Verification**
```sql
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

## 📊 Expected Results

### **✅ Success Indicators:**
- Each organization has isolated data
- Users can only access their organization's data
- No cross-tenant data leakage
- Organization management works correctly
- Authentication includes organization context

### **❌ Failure Indicators:**
- Users can see other organizations' data
- Data creation doesn't include organizationId
- Authentication doesn't include organization context
- API endpoints don't filter by organization

## 🚀 Next Steps

1. **Fix Compilation Errors**: Update all services to include organizationId
2. **Run Automated Tests**: Execute the test script
3. **Manual Verification**: Test through frontend
4. **Performance Testing**: Test with multiple organizations
5. **Security Testing**: Verify data isolation

---

**Note**: This testing guide assumes the backend compilation errors are fixed. The multitenancy implementation is complete but needs the service layer updates to be fully functional.
