# 🎯 Role Distribution Diagram

## 📊 **System Modules by Role**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GAP ANALYSIS SYSTEM MODULES                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│      ADMIN      │  │     MANAGER     │  │ COMPLIANCE_OFF  │  │     STAFF       │
│ Support & Coord │  │ Direction & Dec │  │ Oversight & Reg │  │ Input & Impl    │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FULL ACCESS MODULES                               │
└─────────────────────────────────────────────────────────────────────────────────┘

ADMIN (Support & Coordination):
├── 👥 Users Management (Create, Update, Delete, Support)
├── 🏢 Organizations Management (Create, Configure, Maintain)
├── 🏪 Branches Management (Create, Configure, Maintain)
├── 🔔 Notifications Management (Configure, Troubleshoot)
└── 👤 Profile Management (Support, Recovery, Troubleshoot)

MANAGER (Direction & Decision-making):
├── 📋 Requirements Management (View, Prioritize, Allocate)
├── 📊 Gap Assessments Management (View, Approve, Allocate)
├── 📝 Action Plans Management (Create, Approve, Allocate)
├── 📁 Evidence Management (View, Decide, Allocate)
├── ⚠️ Risks Management (View, Decide, Allocate)
└── 📅 Schedules Management (View, Decide, Allocate)

COMPLIANCE_OFFICER (Oversight & Regulatory Assurance):
├── 📋 Requirements Management (Create, Manage, Review)
├── 📊 Gap Assessments Management (Create, Conduct, Analyze)
├── 📝 Action Plans Management (Create, Monitor, Update)
├── 📁 Evidence Management (Upload, Review, Organize)
├── ⚠️ Risks Management (Create, Monitor, Update)
└── 📅 Schedules Management (Create, Monitor, Update)

STAFF (Input & Implementation):
├── 📋 Requirements Management (View Assigned, Update Progress)
├── 📊 Gap Assessments Management (View Assigned, Input Data)
├── 📝 Action Plans Management (View Assigned, Update Progress)
├── 📁 Evidence Management (Upload, Organize, Maintain)
├── ⚠️ Risks Management (View Assigned, Input Data)
├── 📅 Schedules Management (View Assigned, Update Progress)
└── 👤 Profile Management (Update Own Profile)

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LIMITED ACCESS MODULES                            │
└─────────────────────────────────────────────────────────────────────────────────┘

ADMIN:
├── 📋 Requirements (View Only - for support)
├── 📊 Gap Assessments (View Only - for support)
├── 📝 Action Plans (View Only - for support)
├── 📁 Evidence (View Only - for support)
├── ⚠️ Risks (View Only - for support)
└── 📅 Schedules (View Only - for support)

MANAGER:
├── 👥 Users (View Only - for resource allocation)
├── 🏢 Organizations (View Only - for strategic planning)
├── 🏪 Branches (View Only - for resource allocation)
├── 🔔 Notifications (View Only - for monitoring)
└── 👤 Profile (Own Profile Only)

COMPLIANCE_OFFICER:
├── 👥 Users (View Only - for compliance monitoring)
├── 🏢 Organizations (View Only - for compliance oversight)
├── 🏪 Branches (View Only - for compliance monitoring)
├── 🔔 Notifications (View Only - for compliance alerts)
└── 👤 Profile (Own Profile Only)

STAFF:
├── 👥 Users (No Access)
├── 🏢 Organizations (No Access)
├── 🏪 Branches (View Only - for context)
└── 🔔 Notifications (View Only - for assigned tasks)

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              WORKFLOW EXAMPLES                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Requirements Workflow:
1. COMPLIANCE_OFFICER creates requirements
2. MANAGER sets priorities and allocates resources
3. STAFF implements and updates progress
4. ADMIN provides technical support

Gap Assessment Workflow:
1. COMPLIANCE_OFFICER conducts assessments
2. MANAGER reviews and approves strategies
3. STAFF provides data input and evidence
4. ADMIN ensures system functionality

Action Plan Workflow:
1. COMPLIANCE_OFFICER creates action plans
2. MANAGER approves and allocates resources
3. STAFF implements assigned tasks
4. ADMIN provides technical support

Evidence Workflow:
1. COMPLIANCE_OFFICER defines evidence requirements
2. MANAGER approves collection strategies
3. STAFF collects and uploads evidence
4. ADMIN maintains storage system

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ACCESS LEVELS                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

✅ Full Access    - Create, Read, Update, Delete
👁️ View Only      - Read only access
👁️ Assigned       - Read only assigned items
❌ No Access      - Cannot access module

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              KEY BENEFITS                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

🎯 Clear Role Boundaries    - Each role has specific modules they can fully access
🔄 Efficient Workflow       - Clear handoffs between roles in compliance process
🔒 Security                 - Users can only access modules relevant to their role
📈 Scalability              - Easy to add more users to each functional area
🎓 Specialization           - Users can focus on their specific area of expertise
⚖️ Separation of Concerns   - Strategic, operational, and technical functions separated
