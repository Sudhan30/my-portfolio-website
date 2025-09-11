# 🔧 Environment Setup Guide

This guide explains how to set up environment variables to keep your project ID and other sensitive information secure in your public repository.

## 🔒 Security Overview

All sensitive information has been moved to environment variables to ensure your public repository remains secure:

- **Project ID**: No longer hardcoded in frontend files
- **Cloud Functions URLs**: Use environment variables
- **Email Credentials**: Stored in Google Secret Manager
- **Recipient Emails**: Stored in Google Secret Manager

## 📋 Required Environment Variables

### 1. Create `.env` File

Create a `.env` file in the root directory with the following variables:

```bash
# Google Cloud Project ID
REACT_APP_GCP_PROJECT_ID=your-actual-project-id

# Cloud Functions Base URL
REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-your-actual-project-id.cloudfunctions.net
```

### 2. Example `.env` File

```bash
# Example environment variables (replace with your actual values)
REACT_APP_GCP_PROJECT_ID=sudhanportfoliowebsite
REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-sudhanportfoliowebsite.cloudfunctions.net
```

## 🚀 Setup Instructions

### 1. Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit with your actual values
nano .env
```

### 2. Update Values

Replace the placeholder values with your actual:
- Google Cloud Project ID
- Cloud Functions base URL

### 3. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

## 🔍 Files Using Environment Variables

The following files now use environment variables instead of hardcoded values:

- `src/App.js` - Page view tracking
- `src/components/FloatingFeedback.js` - Feedback submission
- `src/components/ContactForm.js` - Contact form submission
- `src/components/JobDescriptionAnalyzer.js` - Job analysis
- `src/components/Feedback.js` - Feedback submission

## 🛡️ Security Features

### ✅ Implemented
- **Environment Variables**: All sensitive data externalized
- **Gitignore Protection**: `.env` files excluded from version control
- **Fallback Values**: Generic placeholders for public repository
- **Secret Manager**: Email credentials encrypted and secure

### 🔒 Protected Information
- **Project ID**: No longer exposed in public code
- **Cloud Functions URLs**: Use environment variables
- **Email Addresses**: Stored in Google Secret Manager
- **SMTP Credentials**: Encrypted in Google Secret Manager

## 📁 File Structure

```
my-portfolio-website/
├── .env                    # Your actual environment variables (gitignored)
├── .env.example           # Template for environment variables
├── .gitignore            # Excludes .env files
├── functions/
│   ├── config.js         # Your actual config (gitignored)
│   └── config.example.js # Template for config
└── src/
    └── components/       # All files use environment variables
```

## 🚨 Important Security Notes

### ✅ Safe to Commit
- `.env.example` - Template with placeholders
- `config.example.js` - Template with placeholders
- All source code files - Use environment variables

### ❌ Never Commit
- `.env` - Contains actual sensitive values
- `functions/config.js` - Contains actual configuration
- Any files with real credentials or project IDs

## 🔧 Development vs Production

### Development
- Uses `.env` file for local development
- Environment variables loaded by React
- Fallback to generic placeholders if not set

### Production
- Environment variables set in deployment platform
- No `.env` file needed in production
- All sensitive data in Google Secret Manager

## 🧪 Testing

### 1. Verify Environment Variables
```bash
# Check if variables are loaded
console.log(process.env.REACT_APP_GCP_PROJECT_ID);
console.log(process.env.REACT_APP_CLOUD_FUNCTIONS_URL);
```

### 2. Test Functionality
- Page view tracking
- Contact form submission
- Feedback submission
- Job description analysis

## 🚀 Deployment

### 1. Set Environment Variables
In your deployment platform (Vercel, Netlify, etc.), set:
- `REACT_APP_GCP_PROJECT_ID`
- `REACT_APP_CLOUD_FUNCTIONS_URL`

### 2. Deploy
```bash
npm run build
# Deploy the build folder
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
- Restart development server after creating `.env`
- Check variable names start with `REACT_APP_`
- Verify `.env` file is in root directory

#### 2. Functions Not Working
- Check Cloud Functions URLs in environment variables
- Verify project ID is correct
- Test Cloud Functions directly

#### 3. Build Errors
- Ensure all environment variables are set
- Check for typos in variable names
- Verify fallback values are generic

## 📞 Support

If you encounter issues:
1. Check environment variable setup
2. Verify Cloud Functions deployment
3. Test with generic fallback values
4. Check browser console for errors

---

**🔒 Remember**: Your `.env` file contains sensitive information and should never be committed to version control!
