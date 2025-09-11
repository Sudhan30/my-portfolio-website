# 📧 Email Setup for Portfolio Contact Form

This document explains how to set up secure email notifications for your portfolio contact form using Google Secret Manager and SMTP.

## 🔐 Security Features

- **Encrypted Storage**: Email credentials stored in Google Secret Manager
- **No Public Access**: Secrets are only accessible by Cloud Functions
- **Secure SMTP**: Uses secure SMTP with SSL/TLS
- **Rate Limited**: Contact form submissions are rate-limited to prevent spam

## 📋 Prerequisites

1. **Google Cloud Project**: `your-project-id`
2. **Email Account**: With app password enabled
3. **gcloud CLI**: Installed and authenticated

## 🚀 Quick Setup

### 1. Run the Setup Script

```bash
./setup-secrets.sh
```

This script will:
- Enable Secret Manager API
- Create encrypted secrets for your email credentials
- Grant proper permissions to Cloud Functions
- Guide you through the setup process

### 2. Install Dependencies

```bash
cd functions
npm install
```

### 3. Deploy the Updated Function

```bash
gcloud functions deploy submitContactForm \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --source functions
```

## 📧 Email Configuration

### Recipients
- **Primary**: Stored in `email-recipient-primary` secret
- **CC**: Stored in `email-recipient-cc` secret (optional)

### SMTP Settings
- **Host**: `smtp.your-provider.com`
- **Port**: `465` (SSL)
- **Security**: SSL/TLS

### Email Template
The system sends beautifully formatted HTML emails with:
- Contact form details
- Professional styling
- Clear message formatting
- Portfolio branding

## 🔧 Manual Setup (Alternative)

If you prefer to set up secrets manually:

### 1. Enable Secret Manager API
```bash
gcloud services enable secretmanager.googleapis.com --project=your-project-id
```

### 2. Create Email Secret
```bash
echo "your-email@provider.com" | gcloud secrets create email-credentials \
  --data-file=- \
  --project=your-project-id
```

### 3. Create Password Secret
```bash
echo "your-app-password" | gcloud secrets create email-password \
  --data-file=- \
  --project=your-project-id
```

### 4. Create Recipient Secrets
```bash
# Primary recipient (required)
echo "your-primary-email@domain.com" | gcloud secrets create email-recipient-primary \
  --data-file=- \
  --project=your-project-id

# CC recipient (optional)
echo "your-cc-email@domain.com" | gcloud secrets create email-recipient-cc \
  --data-file=- \
  --project=your-project-id
```

### 5. Grant Permissions
```bash
CLOUD_FUNCTIONS_SA="your-project-id@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding email-credentials \
  --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=your-project-id

gcloud secrets add-iam-policy-binding email-password \
  --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=your-project-id

gcloud secrets add-iam-policy-binding email-recipient-primary \
  --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=your-project-id

gcloud secrets add-iam-policy-binding email-recipient-cc \
  --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
  --role="roles/secretmanager.secretAccessor" \
  --project=your-project-id
```

## 🔍 Testing

### 1. Test the Contact Form
- Visit your portfolio website
- Fill out the contact form
- Submit the form
- Check your email inbox

### 2. Check Function Logs
```bash
gcloud functions logs read submitContactForm --project=your-project-id
```

### 3. Verify Firestore
- Check the `contactSubmissions` collection in Firestore
- Ensure data is being stored correctly

## 🛡️ Security Best Practices

### ✅ Implemented
- **Secret Manager**: Credentials encrypted at rest
- **IAM Permissions**: Least privilege access
- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: Sanitizes user input
- **Error Handling**: Graceful failure handling

### 🔒 Additional Security
- **HTTPS Only**: All communications encrypted
- **CORS Protection**: Restricts cross-origin requests
- **IP Logging**: Tracks submission sources
- **Timestamp Logging**: Audit trail for submissions

## 📊 Monitoring

### Cloud Function Metrics
- Monitor function invocations
- Track error rates
- Monitor execution time

### Email Delivery
- Check email delivery rates
- Monitor bounce rates
- Track spam complaints

### Firestore Usage
- Monitor document creation
- Track storage usage
- Monitor read/write operations

## 🚨 Troubleshooting

### Common Issues

#### 1. "Secret not found" Error
```bash
# Verify secret exists
gcloud secrets list --project=your-project-id

# Check permissions
gcloud secrets get-iam-policy email-credentials --project=your-project-id
```

#### 2. "Authentication failed" Error
- Verify email app password is correct
- Check if 2FA is enabled (requires app password)
- Ensure SMTP is enabled in your email provider settings

#### 3. "Permission denied" Error
```bash
# Re-grant permissions
gcloud secrets add-iam-policy-binding email-credentials \
  --member="serviceAccount:your-project-id@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=your-project-id
```

#### 4. Email Not Received
- Check spam folder
- Verify recipient email addresses
- Check function logs for errors
- Test SMTP connection manually

### Debug Commands

```bash
# View function logs
gcloud functions logs read submitContactForm --project=your-project-id --limit=50

# Test secret access
gcloud secrets versions access latest --secret="email-credentials" --project=your-project-id

# Check function status
gcloud functions describe submitContactForm --project=your-project-id
```

## 📈 Performance Optimization

### Current Configuration
- **Rate Limiting**: 3 submissions per minute per IP
- **Timeout**: 60 seconds for email sending
- **Retry Logic**: Built into Nodemailer
- **Async Processing**: Non-blocking email sending

### Monitoring Recommendations
- Set up Cloud Monitoring alerts
- Monitor function cold starts
- Track email delivery success rates
- Monitor Firestore write operations

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor function performance
- Check email delivery rates
- Review security logs
- Update dependencies

### Scaling Considerations
- Current setup handles moderate traffic
- For high traffic, consider:
  - Email queuing (Cloud Tasks)
  - Database connection pooling
  - Caching strategies

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Cloud Function logs
3. Verify Secret Manager permissions
4. Test SMTP connection manually

---

**🔒 Remember**: Your email credentials are now securely stored and encrypted. Never commit them to version control or expose them in client-side code.
