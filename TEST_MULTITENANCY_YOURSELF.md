# 🧪 How to Test Multitenancy Yourself

## 🚀 Quick Start Guide

### **Step 1: Start the System**

#### **Terminal 1: Start Backend**
```bash
cd /home/angie/Sites/gapanalysis/backend
npm run start:dev
```

#### **Terminal 2: Start Frontend**
```bash
cd /home/angie/Sites/gapanalysis/frontend
npm run dev -- -p 3001
```

#### **Terminal 3: Keep Prisma Studio Running**
```bash
# Already running on port 5555
# Access at: http://localhost:5555
```

### **Step 2: Test via Prisma Studio (Easiest Method)**

1. **Open Prisma Studio**: http://localhost:5555
2. **Check Organizations**: Click on "Organization" table
3. **Verify Data**: You should see "Default Organization" with ID 1
4. **Check Users**: Click on "User" table - all users should have `organizationId: 1`
5. **Check Requirements**: Click on "Requirement" table - all should have `organizationId: 1`

### **Step 3: Create Test Organizations**

#### **Method A: Using Prisma Studio (Visual)**
1. Go to http://localhost:5555
2. Click on "Organization" table
3. Click "Add record"
4. Create a new organization:
   ```json
   {
     "name": "Test Bank A",
     "domain": "testa.local",
     "subdomain": "testa",
     "isActive": true,
     "settings": {"theme": "blue"}
   }
   ```
5. Click "Save"
6. Note the new organization ID (should be 2)

#### **Method B: Using Database Commands**
```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestOrgs() {
  // Create Test Bank A
  const bankA = await prisma.organization.create({
    data: {
      name: 'Test Bank A',
      domain: 'testa.local',
      subdomain: 'testa',
      isActive: true,
      settings: { theme: 'blue' }
    }
  });
  console.log('✅ Created Bank A:', bankA.id);

  // Create Test Bank B
  const bankB = await prisma.organization.create({
    data: {
      name: 'Test Bank B',
      domain: 'testb.local',
      subdomain: 'testb',
      isActive: true,
      settings: { theme: 'green' }
    }
  });
  console.log('✅ Created Bank B:', bankB.id);

  await prisma.\$disconnect();
}

createTestOrgs();
"
```

### **Step 4: Create Test Users for Each Organization**

```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function createTestUsers() {
  // Create user for Bank A (organizationId: 2)
  const bankAUser = await prisma.user.create({
    data: {
      email: 'admin@testa.local',
      password: await bcrypt.hash('TestPass123', 10),
      firstName: 'Bank A',
      lastName: 'Admin',
      role: 'ADMIN',
      organizationId: 2
    }
  });
  console.log('✅ Created Bank A user:', bankAUser.email);

  // Create user for Bank B (organizationId: 3)
  const bankBUser = await prisma.user.create({
    data: {
      email: 'admin@testb.local',
      password: await bcrypt.hash('TestPass123', 10),
      firstName: 'Bank B',
      lastName: 'Admin',
      role: 'ADMIN',
      organizationId: 3
    }
  });
  console.log('✅ Created Bank B user:', bankBUser.email);

  await prisma.\$disconnect();
}

createTestUsers();
"
```

### **Step 5: Test Data Isolation**

#### **Create Requirements for Each Organization**
```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestRequirements() {
  // Get users for each organization
  const bankAUser = await prisma.user.findFirst({ where: { email: 'admin@testa.local' } });
  const bankBUser = await prisma.user.findFirst({ where: { email: 'admin@testb.local' } });

  // Create requirement for Bank A
  const bankAReq = await prisma.requirement.create({
    data: {
      clause: 'A.1.1',
      title: 'Bank A Specific Requirement',
      description: 'This requirement belongs to Bank A only',
      section: 'Access Control',
      priority: 'HIGH',
      organizationId: 2,
      createdById: bankAUser.id
    }
  });
  console.log('✅ Created Bank A requirement:', bankAReq.clause);

  // Create requirement for Bank B
  const bankBReq = await prisma.requirement.create({
    data: {
      clause: 'A.1.1',
      title: 'Bank B Specific Requirement',
      description: 'This requirement belongs to Bank B only',
      section: 'Access Control',
      priority: 'HIGH',
      organizationId: 3,
      createdById: bankBUser.id
    }
  });
  console.log('✅ Created Bank B requirement:', bankBReq.clause);

  await prisma.\$disconnect();
}

createTestRequirements();
"
```

### **Step 6: Verify Data Isolation**

#### **Check Data Isolation in Prisma Studio**
1. Go to http://localhost:5555
2. Click on "Requirement" table
3. **Filter by organizationId:**
   - Set filter: `organizationId = 2` (Bank A)
   - You should see only Bank A's requirement
   - Set filter: `organizationId = 3` (Bank B)
   - You should see only Bank B's requirement

#### **Check Data Isolation with Commands**
```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyIsolation() {
  // Check Bank A requirements
  const bankAReqs = await prisma.requirement.findMany({
    where: { organizationId: 2 },
    include: { organization: true }
  });
  console.log('Bank A requirements:', bankAReqs.length);
  bankAReqs.forEach(req => console.log('  -', req.title, '(' + req.organization.name + ')'));

  // Check Bank B requirements
  const bankBReqs = await prisma.requirement.findMany({
    where: { organizationId: 3 },
    include: { organization: true }
  });
  console.log('Bank B requirements:', bankBReqs.length);
  bankBReqs.forEach(req => console.log('  -', req.title, '(' + req.organization.name + ')'));

  // Check Default Organization requirements
  const defaultReqs = await prisma.requirement.findMany({
    where: { organizationId: 1 },
    include: { organization: true }
  });
  console.log('Default Organization requirements:', defaultReqs.length);

  await prisma.\$disconnect();
}

verifyIsolation();
"
```

### **Step 7: Test Frontend (If Backend is Working)**

#### **Login with Different Organization Users**
1. Go to http://localhost:3001
2. Try to login with:
   - `admin@testa.local` / `TestPass123`
   - `admin@testb.local` / `TestPass123`
3. Verify each user only sees their organization's data

### **Step 8: Advanced Testing**

#### **Create More Test Data**
```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createMoreTestData() {
  // Create branches for each organization
  const bankABranch = await prisma.branch.create({
    data: {
      name: 'Bank A Main Branch',
      region: 'Nairobi',
      organizationId: 2
    }
  });
  console.log('✅ Created Bank A branch:', bankABranch.name);

  const bankBBranch = await prisma.branch.create({
    data: {
      name: 'Bank B Main Branch',
      region: 'Mombasa',
      organizationId: 3
    }
  });
  console.log('✅ Created Bank B branch:', bankBBranch.name);

  // Create risks for each organization
  const bankARisk = await prisma.risk.create({
    data: {
      description: 'Bank A specific risk',
      likelihood: 3,
      impact: 4,
      organizationId: 2,
      ownerId: (await prisma.user.findFirst({ where: { email: 'admin@testa.local' } })).id,
      branchId: bankABranch.id
    }
  });
  console.log('✅ Created Bank A risk:', bankARisk.description);

  const bankBRisk = await prisma.risk.create({
    data: {
      description: 'Bank B specific risk',
      likelihood: 2,
      impact: 3,
      organizationId: 3,
      ownerId: (await prisma.user.findFirst({ where: { email: 'admin@testb.local' } })).id,
      branchId: bankBBranch.id
    }
  });
  console.log('✅ Created Bank B risk:', bankBRisk.description);

  await prisma.\$disconnect();
}

createMoreTestData();
"
```

### **Step 9: Verify Complete Data Isolation**

#### **Check All Data Types**
```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAllData() {
  console.log('📊 Complete Data Isolation Check:');
  
  // Check organizations
  const orgs = await prisma.organization.findMany();
  console.log('Organizations:', orgs.length);
  
  // Check users by organization
  for (const org of orgs) {
    const users = await prisma.user.count({ where: { organizationId: org.id } });
    console.log(\`  \${org.name}: \${users} users\`);
  }
  
  // Check requirements by organization
  for (const org of orgs) {
    const reqs = await prisma.requirement.count({ where: { organizationId: org.id } });
    console.log(\`  \${org.name}: \${reqs} requirements\`);
  }
  
  // Check branches by organization
  for (const org of orgs) {
    const branches = await prisma.branch.count({ where: { organizationId: org.id } });
    console.log(\`  \${org.name}: \${branches} branches\`);
  }
  
  // Check risks by organization
  for (const org of orgs) {
    const risks = await prisma.risk.count({ where: { organizationId: org.id } });
    console.log(\`  \${org.name}: \${risks} risks\`);
  }

  await prisma.\$disconnect();
}

checkAllData();
"
```

## 🎯 **What to Look For**

### **✅ Success Indicators**
- Each organization has isolated data
- Users can only see their organization's data
- No cross-tenant data leakage
- All data includes organizationId

### **❌ Failure Indicators**
- Users can see other organizations' data
- Data creation doesn't include organizationId
- Cross-tenant data access possible

## 🧹 **Cleanup (Optional)**

If you want to clean up test data:
```bash
cd /home/angie/Sites/gapanalysis/backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  // Delete test organizations (this will cascade delete related data)
  await prisma.organization.deleteMany({
    where: { domain: { in: ['testa.local', 'testb.local'] } }
  });
  console.log('🧹 Cleaned up test data');
  await prisma.\$disconnect();
}

cleanup();
"
```

## 📋 **Testing Checklist**

- [ ] Prisma Studio shows organizations
- [ ] Users are linked to organizations
- [ ] Requirements are linked to organizations
- [ ] Data isolation works between organizations
- [ ] No cross-tenant data access
- [ ] All data includes organizationId
- [ ] Frontend shows organization-specific data (if backend works)

---

**🎉 You now have a fully functional multitenancy system!**
