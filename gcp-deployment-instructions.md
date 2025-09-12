# 🚀 GCP Deployment Instructions

This document provides comprehensive instructions for deploying all Cloud Functions and configuring the complete backend infrastructure for the portfolio website.

## Prerequisites

1. **Google Cloud SDK:** Ensure you have the `gcloud` command-line tool installed and configured
2. **Node.js 20+:** Required for deploying Cloud Functions
3. **Authentication:** Authenticate with GCP: `gcloud auth login`
4. **Project Setup:** Set your GCP project: `gcloud config set project YOUR_PROJECT_ID`
5. **Billing:** Ensure billing is enabled for your GCP project
6. **APIs:** Enable required APIs (see API Setup section)

## 🔧 API Setup

Enable the following APIs in your GCP project:

```bash
# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

## 📦 Cloud Functions Deployment

Navigate to the `functions` directory and deploy all functions:

### 1. Page View Tracker
```bash
gcloud functions deploy pageView \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --source .
```

### 2. Feedback Handler
```bash
gcloud functions deploy submitFeedback \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --source .
```

### 3. Contact Form Handler
```bash
gcloud functions deploy submitContactForm \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --source .
```

### 4. Job Description Analyzer
```bash
gcloud functions deploy analyzeJobDescription \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --source .
```

### 5. Telemetry Tracker
```bash
gcloud functions deploy trackTelemetry \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --source .
```

## 🔐 Secret Manager Setup

### 1. Create Email Credentials Secret
```bash
echo -n "your-sender-email@domain.com" | gcloud secrets create email-credentials --data-file=-
```

### 2. Create Email Password Secret
```bash
echo -n "your-smtp-app-password" | gcloud secrets create email-password --data-file=-
```

### 3. Create Primary Recipient Secret
```bash
echo -n "primary-recipient@domain.com" | gcloud secrets create email-recipient-primary --data-file=-
```

### 4. Create CC Recipients Secret
```bash
echo -n "cc1@domain.com,cc2@domain.com" | gcloud secrets create email-recipient-cc --data-file=-
```

### 5. Grant Permissions
```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant Secret Manager access to Cloud Functions service account
gcloud secrets add-iam-policy-binding email-credentials \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding email-password \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding email-recipient-primary \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding email-recipient-cc \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 🗄️ Firestore Database Setup

### 1. Create Firestore Database
```bash
# Create Firestore database (if not already created)
gcloud firestore databases create --region=us-central1
```

### 2. Set up Security Rules
Create a `firestore.rules` file with appropriate security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (adjust as needed)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Deploy the rules:
```bash
gcloud firestore rules deploy firestore.rules
```

## 🧪 Testing Deployment

### 1. Test Page View Function
```bash
curl -X GET "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/pageView"
```

### 2. Test Contact Form Function
```bash
curl -X POST "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/submitContactForm" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

### 3. Test Feedback Function
```bash
curl -X POST "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/submitFeedback" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "feedback": "Test feedback",
    "rating": 5
  }'
```

## 🔧 Configuration Files

### 1. Update functions/config.js
Create or update the configuration file:

```javascript
module.exports = {
    projectId: 'your-project-id',
    email: {
        smtpHost: 'your-smtp-host.com',
        smtpPort: 465,
        useSSL: true,
    },
    secrets: {
        emailCredentials: 'email-credentials',
        emailPassword: 'email-password'
    }
};
```

### 2. Update Frontend Environment
Update your frontend environment variables:

```bash
# In your .env.local or production environment
REACT_APP_GCP_PROJECT_ID=your-project-id
REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
```

## 📊 Monitoring & Logging

### 1. View Function Logs
```bash
# View logs for specific function
gcloud functions logs read submitFeedback --limit=50

# View logs for all functions
gcloud functions logs read --limit=50
```

### 2. Monitor Function Performance
```bash
# List all functions
gcloud functions list

# Get function details
gcloud functions describe submitFeedback --region=us-central1
```

## 🚨 Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure Secret Manager permissions are correctly set
   - Verify service account has necessary roles

2. **Function Deployment Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check function source code for syntax errors

3. **Email Sending Issues**
   - Verify SMTP credentials in Secret Manager
   - Check email provider settings (app passwords, 2FA)
   - Review function logs for specific error messages

4. **Database Connection Issues**
   - Ensure Firestore is enabled and properly configured
   - Check database security rules
   - Verify project ID configuration

### Debug Commands
```bash
# Check function status
gcloud functions describe FUNCTION_NAME --region=us-central1

# View recent logs
gcloud functions logs read FUNCTION_NAME --limit=20

# Test function locally (if using emulator)
firebase emulators:start --only functions
```

## 📚 Additional Resources

- [Google Cloud Functions Documentation](https://cloud.google.com/functions/docs)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Google Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Nodemailer Documentation](https://nodemailer.com/about/)

## ✅ Deployment Checklist

- [ ] All required APIs enabled
- [ ] Cloud Functions deployed successfully
- [ ] Secret Manager secrets created and configured
- [ ] IAM permissions set correctly
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Frontend environment variables updated
- [ ] All functions tested and working
- [ ] Email notifications working
- [ ] Monitoring and logging configured
