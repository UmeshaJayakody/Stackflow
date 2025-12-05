# Email Setup Guide for Password Reset

## Overview
The password reset feature sends emails with secure reset links to users who forget their passwords.

## Configuration

### 1. Environment Variables
Add these variables to your `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Gmail Setup (Recommended)

#### Using Gmail App Password:

1. **Enable 2-Factor Authentication** on your Google account
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `EMAIL_PASSWORD` in your `.env` file

3. **Update .env**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=youremail@gmail.com
   ```

### 3. Other Email Providers

#### Outlook/Hotmail:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=youremail@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo:
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=youremail@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### SendGrid (Production):
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

## Testing

### 1. Test Password Reset Flow:

1. Go to login page: `http://localhost:3000/login`
2. Click "Forgot Password?"
3. Enter your email address
4. Check your email inbox
5. Click the reset link
6. Enter new password
7. Login with new password

### 2. Development Testing:

For development, you can use:
- **Mailtrap**: https://mailtrap.io (catches all emails)
- **MailHog**: Local email testing server

#### Mailtrap Setup:
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-password
```

## Features

- ✅ Secure token-based password reset
- ✅ Token expires after 1 hour
- ✅ Professional HTML email template
- ✅ Plain text fallback
- ✅ Security: Doesn't reveal if email exists
- ✅ Reset token cleared after successful reset

## Security Notes

1. Reset tokens are hashed and stored in database
2. Tokens expire after 1 hour
3. Tokens are single-use (cleared after password reset)
4. System doesn't reveal if email exists (prevents user enumeration)
5. Password must be at least 6 characters

## Troubleshooting

### Email not sending:
1. Check email credentials in `.env`
2. Verify 2FA and app password for Gmail
3. Check spam/junk folder
4. Check console for error messages
5. Ensure port 587 is not blocked by firewall

### Invalid/Expired token:
1. Token expires after 1 hour
2. Request new password reset
3. Check URL has complete token parameter

### Production Considerations:
1. Use a dedicated email service (SendGrid, AWS SES, etc.)
2. Set up proper SPF/DKIM records
3. Monitor email delivery rates
4. Implement rate limiting for forgot password requests
5. Use HTTPS for production URL

## Email Template Customization

Edit `lib/emailService.ts` to customize:
- Email subject
- HTML template
- Company branding
- Reset link styling
- Support contact information
