# 📧 Email Configuration Guide

This guide will help you configure SMTP email notifications for the Gap Analysis System.

## 🔧 Environment Variables

Add these variables to your `.env` file in the backend directory:

```env
# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Gap Analysis System <noreply@gapanalysis.com>"
```

## 📋 SMTP Provider Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `SMTP_PASS`

3. **Configuration**:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_SECURE="false"
   SMTP_USER="your-gmail@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   SMTP_FROM="Gap Analysis System <your-gmail@gmail.com>"
   ```

### Outlook/Hotmail Setup

```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
SMTP_FROM="Gap Analysis System <your-email@outlook.com>"
```

### Custom SMTP Server

```env
SMTP_HOST="your-smtp-server.com"
SMTP_PORT=587
SMTP_SECURE="false"  # or "true" for SSL
SMTP_USER="your-username"
SMTP_PASS="your-password"
SMTP_FROM="Gap Analysis System <noreply@yourdomain.com>"
```

## 🧪 Testing Email Configuration

### 1. Check Email Service Status

**Endpoint**: `GET /email/status`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response**:
```json
{
  "success": true,
  "message": "Email service is configured and ready",
  "status": "CONNECTED",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Test Email Connection

**Endpoint**: `POST /email/test-connection`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Response**:
```json
{
  "success": true,
  "message": "Email service connection successful",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Send Test Email

**Endpoint**: `POST /email/send-test`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "to": "test@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "recipient": "test@example.com",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Send Custom Email

**Endpoint**: `POST /email/send-custom`

**Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "to": "recipient@example.com",
  "subject": "Test Subject",
  "message": "<h1>Test Email</h1><p>This is a test email with HTML content.</p>"
}
```

## 🔄 Automatic Email Notifications

The system automatically sends emails for:

### 1. Gap Assessment Notifications
- **Trigger**: New gap assessment created
- **Recipients**: Branch managers, compliance officers
- **Content**: Assessment details, risk score, requirements

### 2. Action Plan Notifications
- **Trigger**: New action plan assigned
- **Recipients**: Assigned users
- **Content**: Action details, priority, deadline

### 3. Schedule Reminders
- **Trigger**: Upcoming due dates
- **Recipients**: Responsible users
- **Content**: Schedule details, due date, priority

### 4. Overdue Notifications
- **Trigger**: Items past due date
- **Recipients**: Responsible users, managers
- **Content**: Overdue item details, urgency

## 🛠️ Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check SMTP credentials
   - Verify app password (Gmail)
   - Ensure 2FA is enabled

2. **Connection Timeout**
   - Check SMTP host and port
   - Verify firewall settings
   - Try different port (465 for SSL)

3. **Emails Not Sending**
   - Check spam folder
   - Verify recipient email addresses
   - Check SMTP server logs

### Debug Steps

1. **Test Connection**:
   ```bash
   curl -X POST http://localhost:3000/email/test-connection \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Check Logs**:
   ```bash
   # Check backend logs for email errors
   tail -f logs/application.log
   ```

3. **Verify Configuration**:
   ```bash
   # Check environment variables
   echo $SMTP_HOST
   echo $SMTP_USER
   ```

## 📊 Email Templates

The system includes pre-built email templates for:

- **Gap Assessment Alerts**
- **Action Plan Assignments**
- **Schedule Reminders**
- **Overdue Notifications**
- **Payment Confirmations**
- **Subscription Updates**

## 🔒 Security Considerations

1. **Use App Passwords** instead of main account passwords
2. **Enable 2FA** on email accounts
3. **Use Environment Variables** for sensitive data
4. **Regularly Rotate** SMTP credentials
5. **Monitor Email Usage** for unusual activity

## 📈 Monitoring

Monitor email delivery through:

- **Application Logs**: Check for email send failures
- **SMTP Server Logs**: Verify delivery status
- **Email Analytics**: Track open rates and delivery
- **Error Alerts**: Set up monitoring for email failures

## 🚀 Production Setup

For production deployment:

1. **Use Dedicated SMTP Service** (SendGrid, Mailgun, etc.)
2. **Configure SPF/DKIM Records** for domain authentication
3. **Set Up Email Monitoring** and alerting
4. **Implement Rate Limiting** to prevent spam
5. **Use Email Templates** for consistent branding

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your SMTP configuration
3. Test with a simple email first
4. Check application logs for detailed error messages
5. Contact your system administrator

---

**Note**: Always test email configuration in a development environment before deploying to production.
