# Gap Analysis System - Quick Reference Guide
## Kenyan Banking Compliance Platform

---

## 🚀 **Quick Start**

### **System Access**
- **Swagger UI**: `http://localhost:3000/api`
- **API Base URL**: `http://localhost:3000`
- **Database**: PostgreSQL (gapanalysis)
- **Authentication**: JWT Bearer Token

### **Default Credentials**
- **Admin User**: admin@bank.co.ke / AdminPass123
- **Manager User**: manager@bank.co.ke / ManagerPass123
- **Officer User**: officer@bank.co.ke / OfficerPass123

---

## 📋 **Core API Endpoints**

### **Authentication**
```bash
# Register new user
POST /auth/register
{
  "email": "user@bank.co.ke",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Mwangi",
  "role": "COMPLIANCE_OFFICER",
  "branchId": 1
}

# Login
POST /auth/login
{
  "email": "user@bank.co.ke",
  "password": "SecurePass123"
}
```

### **Branch Management**
```bash
# Get all branches
GET /users/branches

# Create new branch
POST /branches
{
  "name": "Nairobi CBD Branch",
  "region": "Central Region",
  "managerId": 1
}
```

### **Requirements Management**
```bash
# Get all requirements
GET /requirements

# Create new requirement
POST /requirements
{
  "clause": "CBK-PG-001",
  "description": "Maintain minimum capital adequacy ratio of 12%"
}
```

### **Gap Assessment**
```bash
# Get all gap assessments
GET /gap-assessments

# Create gap assessment
POST /gap-assessments
{
  "requirementId": 1,
  "branchId": 1,
  "status": 2,
  "description": "Capital adequacy ratio below 12%",
  "evidenceLink": "https://evidence.bank.co.ke/capital-ratio.pdf",
  "createdById": 1
}
```

### **Action Plans**
```bash
# Get all action plans
GET /action-plans

# Create action plan
POST /action-plans
{
  "gapId": 1,
  "actionText": "Increase capital reserves to meet 12% ratio",
  "responsibleId": 2,
  "priority": "HIGH",
  "deadline": "2024-02-15T00:00:00.000Z"
}
```

### **Risk Management**
```bash
# Get all risks
GET /risks

# Create risk entry
POST /risks
{
  "description": "Regulatory non-compliance risk",
  "likelihood": 3,
  "impact": 4,
  "ownerId": 1,
  "status": "ACTIVE"
}
```

### **Incident Reporting**
```bash
# Get all incidents
GET /incidents

# Create incident
POST /incidents
{
  "reporterId": 1,
  "branchId": 1,
  "description": "System outage affecting customer transactions",
  "priority": "HIGH",
  "category": "Technical"
}
```

### **Notifications**
```bash
# Get user notifications
GET /notifications/user/1

# Send notification
POST /notifications
{
  "userId": 1,
  "message": "New compliance gap identified",
  "type": "EMAIL"
}
```

### **Email Service**
```bash
# Test email connection
POST /email/test

# Send test email
POST /email/send-test
{
  "to": "demo@bank.co.ke",
  "subject": "Test Notification",
  "message": "This is a test notification"
}
```

---

## 🏦 **Kenyan Banking Scenarios**

### **Scenario 1: CBK Prudential Guidelines Compliance**

**Step 1: Create CBK Requirement**
```bash
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -d '{
    "clause": "CBK-PG-001",
    "description": "Maintain minimum capital adequacy ratio of 12%"
  }'
```

**Step 2: Identify Gap**
```bash
curl -X POST http://localhost:3000/gap-assessments \
  -H "Content-Type: application/json" \
  -d '{
    "requirementId": 1,
    "branchId": 1,
    "status": 2,
    "description": "Capital adequacy ratio currently at 10.5%",
    "createdById": 1
  }'
```

**Step 3: Create Action Plan**
```bash
curl -X POST http://localhost:3000/action-plans \
  -H "Content-Type: application/json" \
  -d '{
    "gapId": 1,
    "actionText": "Increase capital reserves by KES 50M",
    "responsibleId": 2,
    "priority": "HIGH",
    "deadline": "2024-02-15T00:00:00.000Z"
  }'
```

### **Scenario 2: AML Compliance**

**Step 1: Create AML Requirement**
```bash
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -d '{
    "clause": "AML-001",
    "description": "Implement customer due diligence procedures"
  }'
```

**Step 2: Identify Gap**
```bash
curl -X POST http://localhost:3000/gap-assessments \
  -H "Content-Type: application/json" \
  -d '{
    "requirementId": 2,
    "branchId": 1,
    "status": 1,
    "description": "Missing CDD procedures for high-risk customers",
    "createdById": 1
  }'
```

**Step 3: Create Action Plan**
```bash
curl -X POST http://localhost:3000/action-plans \
  -H "Content-Type: application/json" \
  -d '{
    "gapId": 2,
    "actionText": "Develop and implement CDD procedures",
    "responsibleId": 3,
    "priority": "CRITICAL",
    "deadline": "2024-01-30T00:00:00.000Z"
  }'
```

### **Scenario 3: Data Protection Act Compliance**

**Step 1: Create DPA Requirement**
```bash
curl -X POST http://localhost:3000/requirements \
  -H "Content-Type: application/json" \
  -d '{
    "clause": "DPA-001",
    "description": "Implement data protection impact assessments"
  }'
```

**Step 2: Identify Gap**
```bash
curl -X POST http://localhost:3000/gap-assessments \
  -H "Content-Type: application/json" \
  -d '{
    "requirementId": 3,
    "branchId": 1,
    "status": 2,
    "description": "No DPIA process for new data processing activities",
    "createdById": 1
  }'
```

**Step 3: Create Action Plan**
```bash
curl -X POST http://localhost:3000/action-plans \
  -H "Content-Type: application/json" \
  -d '{
    "gapId": 3,
    "actionText": "Develop DPIA template and process",
    "responsibleId": 4,
    "priority": "HIGH",
    "deadline": "2024-02-28T00:00:00.000Z"
  }'
```

---

## 📊 **System Status Check**

### **Health Check**
```bash
# Check if system is running
curl http://localhost:3000

# Check API documentation
curl http://localhost:3000/api

# Check database connectivity
curl http://localhost:3000/users/branches
```

### **Service Status**
```bash
# Check email service
curl -X POST http://localhost:3000/email/test

# Check notification service
curl http://localhost:3000/notifications

# Check risk management
curl http://localhost:3000/risks
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Authentication Errors**
```bash
# Check if user exists
curl http://localhost:3000/users

# Verify JWT token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3000/users/profile
```

#### **2. Database Connection Issues**
```bash
# Check database status
curl http://localhost:3000/users/branches

# Verify Prisma connection
npx prisma db push
```

#### **3. Email Service Issues**
```bash
# Test SMTP connection
curl -X POST http://localhost:3000/email/test

# Check email configuration
cat .env | grep SMTP
```

#### **4. File Upload Issues**
```bash
# Check evidence service
curl http://localhost:3000/gap-assessments/evidence/statistics

# Verify file upload endpoint
curl -X POST http://localhost:3000/gap-assessments/1/evidence
```

---

## 📈 **Performance Metrics**

### **Response Times**
- **API Calls**: < 2 seconds
- **Database Queries**: < 500ms
- **File Uploads**: < 5 seconds
- **Email Sending**: < 10 seconds

### **System Capacity**
- **Concurrent Users**: 1000+
- **Branches**: 1000+
- **Gap Assessments**: 10,000+
- **Action Plans**: 50,000+
- **Notifications**: 100,000+

---

## 🔐 **Security Features**

### **Authentication**
- JWT-based authentication
- Role-based access control
- Password encryption (bcrypt)
- Session management

### **Data Protection**
- End-to-end encryption
- Secure file storage
- Audit logging
- Data backup

### **API Security**
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

---

## 📞 **Support Information**

### **Technical Support**
- **Email**: support@gapanalysis.co.ke
- **Phone**: +254 700 000 000
- **Hours**: 24/7

### **Documentation**
- **API Docs**: http://localhost:3000/api
- **User Guide**: Available in system
- **Video Tutorials**: Available on request

### **Training**
- **Online Training**: Available
- **On-site Training**: Available
- **Certification**: Available

---

## 🎯 **Next Steps**

### **Immediate Actions**
1. **System Testing**: Test all features
2. **User Training**: Train key users
3. **Data Migration**: Migrate existing data
4. **Go Live**: Deploy to production

### **Long-term Goals**
1. **Full Implementation**: Rollout to all branches
2. **Integration**: Connect with existing systems
3. **Customization**: Add bank-specific features
4. **Optimization**: Performance improvements

---

*This quick reference guide provides essential information for technical users to effectively use the Gap Analysis System.*
