# Gap Analysis System - Backend

A comprehensive compliance & risk management platform for Kenyan banking sector built with NestJS, PostgreSQL, and Prisma.

## 🚀 Features

- **User Management**: Role-based access control (Admin, Manager, Compliance Officer, Staff)
- **Branch Management**: Multi-branch support with regional grouping
- **Requirements Management**: ISO 27001:2022 compliance tracking
- **Gap Assessment**: Automated gap identification and scoring
- **Action Plans**: Task assignment and progress tracking
- **Risk Management**: Risk register with impact and likelihood scoring
- **Schedule Management**: Recurring compliance tasks with automated notifications
- **Notifications**: Real-time email and system notifications
- **Email Service**: SMTP integration for automated communications

## 🛠️ Technology Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer with SMTP
- **Scheduling**: NestJS Schedule with cron jobs
- **Validation**: Class-validator and class-transformer

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- npm or pnpm

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gapanalysis/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   - Database connection string
   - JWT secrets
   - SMTP configuration
   - Other application settings

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Push schema to database
   npm run prisma:push
   
   # Seed the database with initial data
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:
- **Swagger UI**: http://localhost:3000/api
- **API Base URL**: http://localhost:3000

## 🔐 Default Credentials

After seeding, you can use these default credentials:

- **Admin**: admin@bank.co.ke / AdminPass123
- **Manager**: manager@bank.co.ke / ManagerPass123  
- **Officer**: officer@bank.co.ke / OfficerPass123

## 📊 Database Schema

The system includes the following main entities:

- **Users**: User management with role-based access
- **Branches**: Multi-branch organization structure
- **Requirements**: ISO 27001:2022 compliance requirements
- **Gap Assessments**: Compliance gap identification and tracking
- **Action Plans**: Remediation task management
- **Risks**: Risk register and management
- **Schedules**: Recurring compliance tasks
- **Notifications**: System and email notifications

## 🔄 Automated Tasks

The system includes several automated cron jobs:

- **Daily (9:00 AM)**: Check for overdue schedules
- **Daily (8:00 AM)**: Send reminders for schedules due tomorrow
- **Weekly (Monday 9:00 AM)**: Send weekly summary to branch managers
- **Monthly (1st at midnight)**: Generate monthly compliance reports

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database
- `npm run prisma:studio` - Open Prisma Studio

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_ACCESS_TOKEN_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_TOKEN_SECRET` | JWT refresh token secret | Required |
| `JWT_ACCESS_TOKEN_EXPIRATION_MS` | Access token expiration (ms) | 900000 |
| `JWT_REFRESH_TOKEN_EXPIRATION_MS` | Refresh token expiration (ms) | 604800000 |
| `SMTP_HOST` | SMTP server host | Required |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | Required |
| `SMTP_PASS` | SMTP password | Required |
| `PORT` | Application port | 3000 |
| `NODE_ENV` | Environment | development |

## 🏦 Kenyan Banking Compliance

The system is specifically designed for Kenyan banking sector compliance:

- **CBK Prudential Guidelines** compliance tracking
- **Basel III** requirements management
- **Anti-Money Laundering (AML)** standards
- **Data Protection Act** compliance
- **ISO 27001:2022** information security management

## 📈 Key Features for Banking

- **Multi-branch Management**: Centralized control across all branches
- **Regulatory Reporting**: Automated compliance reports
- **Risk Assessment**: Comprehensive risk management
- **Audit Trail**: Complete activity logging
- **Evidence Management**: Document and evidence tracking
- **Real-time Notifications**: Instant alerts and reminders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:
- Email: support@gapanalysis.co.ke
- Documentation: http://localhost:3000/api
- Issues: Create an issue in the repository

---

**Gap Analysis System** - Comprehensive compliance & risk management for Kenyan banking sector.