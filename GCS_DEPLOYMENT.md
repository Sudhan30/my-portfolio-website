# 🚀 Google Cloud Storage Deployment Guide

This guide explains how to deploy your portfolio website to Google Cloud Storage (GCS) bucket for static hosting.

## 🔧 Prerequisites

### Required Tools
- **gcloud CLI**: [Install Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- **Node.js & npm**: [Install Node.js](https://nodejs.org/)
- **Google Cloud Project**: With billing enabled

### Required Permissions
- **Storage Admin**: To create and manage GCS buckets
- **Project Editor**: To set up bucket permissions

## 🚀 Quick Deployment

### 1. Set Environment Variables
```bash
# Set your project ID
export GCP_PROJECT_ID="your-actual-project-id"

# Optional: Set custom bucket name (defaults to PROJECT_ID-portfolio)
export GCS_BUCKET_NAME="your-custom-bucket-name"

# Optional: Set region (defaults to us-central1)
export GCS_REGION="us-central1"
```

### 2. Run Deployment Script
```bash
# Make script executable (if not already)
chmod +x deploy-to-gcs.sh

# Deploy to GCS
./deploy-to-gcs.sh
```

## 📋 What the Deployment Script Does

### 1. **Environment Setup**
- Checks for required tools (gcloud, npm)
- Verifies authentication
- Sets Google Cloud project

### 2. **Bucket Management**
- Creates GCS bucket if it doesn't exist
- Sets public read permissions
- Configures bucket for website hosting
- Sets up custom error pages (404.html)

### 3. **Build Process**
- Installs npm dependencies
- Creates production environment file
- Builds React application with optimizations
- Injects environment variables into build

### 4. **File Upload**
- Uploads all build files to GCS bucket
- Sets optimal cache headers for performance
- Configures MIME types for different file types

### 5. **Performance Optimization**
- Sets cache headers for static assets (1 year)
- Sets cache headers for HTML files (1 day)
- Configures proper MIME types

## 🔧 Manual Deployment Steps

If you prefer to deploy manually:

### 1. Create GCS Bucket
```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Create bucket
gsutil mb -l us-central1 gs://YOUR_BUCKET_NAME

# Set public permissions
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME

# Configure for website hosting
gsutil web set -m index.html -e 404.html gs://YOUR_BUCKET_NAME
```

### 2. Build Application
```bash
# Install dependencies
npm install

# Create production environment file
cat > .env.production << EOF
REACT_APP_GCP_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net
EOF

# Build for production
npm run build
```

### 3. Upload Files
```bash
# Upload all files
gsutil -m cp -r build/* gs://YOUR_BUCKET_NAME/

# Set cache headers
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://YOUR_BUCKET_NAME/static/**/*.js
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://YOUR_BUCKET_NAME/static/**/*.css
gsutil -m setmeta -h "Cache-Control:public, max-age=86400" gs://YOUR_BUCKET_NAME/*.html
```

## 🌐 Environment Variables in Production

### How It Works
The deployment script injects environment variables directly into the HTML file:

```html
<script>
  window.env = {
    REACT_APP_GCP_PROJECT_ID: 'your-project-id',
    REACT_APP_CLOUD_FUNCTIONS_URL: 'https://us-central1-your-project-id.cloudfunctions.net'
  };
</script>
```

### Environment Configuration
The `src/utils/env.js` file handles both development and production environments:

- **Development**: Uses `process.env` variables from `.env` file
- **Production**: Uses `window.env` variables injected at build time

## 🔒 Security Features

### ✅ Implemented
- **No Hardcoded Credentials**: All sensitive data in Google Secret Manager
- **Environment Variables**: Injected at build time, not in source code
- **Public Repository Safe**: No sensitive information exposed
- **CSP Headers**: Content Security Policy configured

### 🔐 Protected Information
- **Project ID**: Injected via environment variables
- **Cloud Functions URLs**: Dynamic configuration
- **Email Credentials**: Stored in Google Secret Manager
- **SMTP Settings**: Encrypted in Secret Manager

## 📊 Performance Optimization

### Cache Headers
- **Static Assets** (JS, CSS, images): 1 year cache
- **HTML Files**: 1 day cache
- **Favicons**: 1 year cache

### Build Optimizations
- **Code Splitting**: Automatic code splitting by React
- **Minification**: JavaScript and CSS minified
- **Tree Shaking**: Unused code removed
- **Asset Optimization**: Images and fonts optimized

## 🧪 Testing Deployment

### 1. Verify Website Access
```bash
# Check if website is accessible
curl -I https://YOUR_BUCKET_NAME.storage.googleapis.com/
```

### 2. Test Functionality
- **Page View Tracking**: Should increment counter
- **Contact Form**: Should send emails
- **Feedback Form**: Should store feedback
- **Job Analyzer**: Should analyze job descriptions

### 3. Check Console Logs
```javascript
// In browser console, check environment variables
console.log(window.env);
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Bucket not found" Error
```bash
# Check if bucket exists
gsutil ls -b gs://YOUR_BUCKET_NAME

# Create bucket if missing
gsutil mb -l us-central1 gs://YOUR_BUCKET_NAME
```

#### 2. "Access denied" Error
```bash
# Check bucket permissions
gsutil iam get gs://YOUR_BUCKET_NAME

# Set public read access
gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME
```

#### 3. "Website not loading" Error
```bash
# Check website configuration
gsutil web get gs://YOUR_BUCKET_NAME

# Configure for website hosting
gsutil web set -m index.html -e 404.html gs://YOUR_BUCKET_NAME
```

#### 4. "Functions not working" Error
- Check environment variables in browser console
- Verify Cloud Functions are deployed
- Check CORS configuration in Cloud Functions

### Debug Commands

```bash
# Check bucket contents
gsutil ls -la gs://YOUR_BUCKET_NAME/

# Check specific file
gsutil cat gs://YOUR_BUCKET_NAME/index.html

# Check bucket permissions
gsutil iam get gs://YOUR_BUCKET_NAME

# Check website configuration
gsutil web get gs://YOUR_BUCKET_NAME
```

## 🚀 Advanced Configuration

### Custom Domain Setup
```bash
# Upload your SSL certificate
gsutil cp your-cert.pem gs://YOUR_BUCKET_NAME/
gsutil cp your-key.pem gs://YOUR_BUCKET_NAME/

# Configure custom domain in Google Cloud Console
# Go to: Cloud Storage > Buckets > YOUR_BUCKET_NAME > Website
```

### CDN Configuration
```bash
# Enable Cloud CDN for better performance
gcloud compute url-maps create portfolio-cdn \
  --default-backend-bucket=YOUR_BUCKET_NAME

# Create global forwarding rule
gcloud compute forwarding-rules create portfolio-rule \
  --global \
  --target-http-proxy=portfolio-proxy \
  --ports=80
```

## 📈 Monitoring

### Cloud Console Links
- **Storage**: [View Bucket](https://console.cloud.google.com/storage)
- **Functions**: [View Functions](https://console.cloud.google.com/functions)
- **Logs**: [View Logs](https://console.cloud.google.com/logs)

### Performance Monitoring
- **Page Speed**: Use Google PageSpeed Insights
- **Analytics**: Google Analytics integration
- **Error Tracking**: Cloud Functions logs

## 🔄 Updates and Maintenance

### Updating Website
```bash
# Simply run the deployment script again
./deploy-to-gcs.sh
```

### Updating Cloud Functions
```bash
# Deploy updated functions
cd functions
gcloud functions deploy FUNCTION_NAME --runtime nodejs20 --trigger-http --allow-unauthenticated
```

### Monitoring Costs
- **Storage**: Monitor bucket storage usage
- **Functions**: Monitor function invocations
- **Bandwidth**: Monitor data transfer costs

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Check Google Cloud Console for errors
4. Review Cloud Functions logs

---

**🎉 Your portfolio website is now live on Google Cloud Storage with enterprise-grade security and performance!**
