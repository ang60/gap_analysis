# Gap Analysis System - Complete Setup Guide

## 🎯 Project Overview

This is a comprehensive compliance & risk management platform designed specifically for the Kenyan banking sector. The system helps banks achieve ISO 27001:2022 certification through automated gap identification, real-time compliance tracking, and comprehensive reporting.

## 🏗️ Architecture

- **Backend**: NestJS with TypeScript, PostgreSQL, Prisma ORM
- **Frontend**: Next.js 15 with React 19, Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: JWT with refresh tokens
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer with SMTP integration
- **Scheduling**: Automated cron jobs for compliance tasks

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or pnpm

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env with your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT secrets
# - SMTP configuration

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed the database with initial data
npm run prisma:seed

# Start development server
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## 🔐 Default Credentials

After seeding, use these credentials:

- **Admin**: admin@bank.co.ke / AdminPass123
- **Manager**: manager@bank.co.ke / ManagerPass123
- **Officer**: officer@bank.co.ke / OfficerPass123

## 📊 Key Features Implemented

### Backend Features

✅ **User Management**
- Role-based access control (Admin, Manager, Compliance Officer, Staff)
- JWT authentication with refresh tokens
- Multi-branch user management

✅ **Requirements Management**
- Complete ISO 27001:2022 requirements (41 requirements)
- Clause-based organization
- Priority classification (Critical, High, Medium, Low)
- Compliance statistics and reporting

✅ **Gap Assessment**
- Automated gap identification
- Risk scoring (0-3 scale)
- Evidence linking and tracking
- Status monitoring

✅ **Action Plans**
- Task assignment and tracking
- Priority levels and deadlines
- Progress monitoring
- Completion tracking

✅ **Risk Management**
- Comprehensive risk register
- Impact and likelihood scoring
- Risk owner assignment
- Mitigation tracking

✅ **Schedule Management**
- Recurring compliance tasks
- Automated notifications
- Deadline management
- Cron job automation

✅ **Notifications & Email**
- Real-time system notifications
- Email notifications with templates
- SMTP integration
- Automated reminders

### Frontend Features

✅ **Modern Landing Page**
- Professional design with gradient backgrounds
- Feature showcase
- Statistics and trust indicators
- Call-to-action sections

✅ **Authentication System**
- Login and registration pages
- Form validation
- Demo credentials display
- Responsive design

✅ **Dashboard Layout**
- Responsive sidebar navigation
- Top navigation with search and notifications
- User profile management
- Mobile-friendly design

✅ **Main Dashboard**
- Key metrics and KPIs
- Quick action buttons
- Recent activity feed
- Upcoming schedules
- Compliance overview

## 🗄️ Database Schema

The system includes comprehensive models:

- **Users**: User management with roles and branches
- **Branches**: Multi-branch organization structure
- **Requirements**: ISO 27001:2022 compliance requirements
- **Gap Assessments**: Compliance gap tracking
- **Action Plans**: Remediation task management
- **Risks**: Risk register and management
- **Schedules**: Recurring compliance tasks
- **Notifications**: System and email notifications

## 🔄 Automated Tasks

The system includes several cron jobs:

- **Daily (9:00 AM)**: Check for overdue schedules
- **Daily (8:00 AM)**: Send reminders for schedules due tomorrow
- **Weekly (Monday 9:00 AM)**: Send weekly summary to branch managers
- **Monthly (1st at midnight)**: Generate monthly compliance reports

## 📚 API Documentation

All API endpoints are documented with Swagger/OpenAPI:

- **Swagger UI**: http://localhost:3000/api
- **Authentication**: JWT Bearer tokens
- **Endpoints**: Complete CRUD operations for all entities
- **Validation**: Request/response validation
- **Examples**: Sample requests and responses

## 🏦 Kenyan Banking Compliance

The system is specifically designed for:

- **CBK Prudential Guidelines** compliance
- **Basel III** requirements
- **Anti-Money Laundering (AML)** standards
- **Data Protection Act** compliance
- **ISO 27001:2022** information security management

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

## 📦 Available Scripts

### Backend Scripts
- `npm run start:dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:seed` - Seed database with initial data
- `npm run prisma:studio` - Open Prisma Studio

### Frontend Scripts
- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🌍 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gapanalysis?schema=public"

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET="your-super-secret-jwt-access-token-key"
JWT_REFRESH_TOKEN_SECRET="your-super-secret-jwt-refresh-token-key"
JWT_ACCESS_TOKEN_EXPIRATION_MS="900000"
JWT_REFRESH_TOKEN_EXPIRATION_MS="604800000"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Gap Analysis System <noreply@gapanalysis.co.ke>"

# Application
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:3001"
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Run `npm run prisma:push` to sync schema

2. **Authentication Issues**
   - Verify JWT secrets are set
   - Check token expiration settings
   - Ensure user exists in database

3. **Email Service Issues**
   - Verify SMTP configuration
   - Test email connection with `/email/test` endpoint
   - Check firewall settings

4. **Frontend Build Issues**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors

## 📈 Performance

- **Backend**: Optimized with Prisma connection pooling
- **Frontend**: Next.js 15 with App Router for optimal performance
- **Database**: Indexed queries and optimized schema
- **Caching**: Redis ready for session management

## 🔒 Security

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Validation**: Input validation and sanitization
- **CORS**: Configured for frontend integration
- **Rate Limiting**: Ready for implementation

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Vercel, Railway, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Configure environment variables

## 📞 Support

For technical support or questions:
- **Documentation**: http://localhost:3000/api
- **Issues**: Create an issue in the repository
- **Email**: support@gapanalysis.co.ke

## 🎉 Next Steps

1. **Test the System**: Use the demo credentials to explore all features
2. **Customize**: Modify requirements and schedules for your specific needs
3. **Integrate**: Connect with existing banking systems
4. **Deploy**: Set up production environment
5. **Train**: Provide user training for your team

---

**Gap Analysis System** - Comprehensive compliance & risk management for Kenyan banking sector.

Built with ❤️ for the Kenyan banking industry.
