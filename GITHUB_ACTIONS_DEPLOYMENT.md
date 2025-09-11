# 🚀 GitHub Actions Deployment Guide

This guide explains how to use your existing GitHub Actions workflow to automatically deploy your portfolio to Google Cloud Storage.

## 🔧 How It Works

Your `.github/workflows/deploy.yml` file automatically:
1. **Builds** your React app with environment variables
2. **Injects** environment variables into the HTML
3. **Deploys** to Google Cloud Storage
4. **Sets** optimal cache headers
5. **Invalidates** CDN cache

## 📋 Required GitHub Secrets

You need to set up these secrets in your GitHub repository:

### 1. Go to Repository Settings
- Navigate to your GitHub repository
- Click **Settings** → **Secrets and variables** → **Actions**

### 2. Add Required Secrets

#### **GCP_PROJECT_ID**
```
Name: GCP_PROJECT_ID
Value: sudhanportfoliowebsite
```

#### **GCP_BUCKET_NAME**
```
Name: GCP_BUCKET_NAME
Value: www.sudharsana.dev
```

#### **GCP_WIF_PROVIDER**
```
Name: GCP_WIF_PROVIDER
Value: projects/254598432060/locations/global/workloadIdentityPools/github/providers/github-provider
```

#### **GCP_SERVICE_ACCOUNT**
```
Name: GCP_SERVICE_ACCOUNT
Value: github-actions@sudhanportfoliowebsite.iam.gserviceaccount.com
```

## 🔐 Setting Up Workload Identity Federation

### 1. Enable Required APIs
```bash
gcloud services enable iamcredentials.googleapis.com
gcloud services enable storage.googleapis.com
```

### 2. Create Workload Identity Pool
```bash
gcloud iam workload-identity-pools create github \
  --location="global" \
  --description="GitHub Actions Pool" \
  --display-name="GitHub Actions Pool"
```

### 3. Create Workload Identity Provider
```bash
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location="global" \
  --workload-identity-pool="github" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

### 4. Create Service Account
```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account" \
  --description="Service account for GitHub Actions deployment"
```

### 5. Grant Permissions
```bash
# Allow GitHub Actions to impersonate the service account
gcloud iam service-accounts add-iam-policy-binding \
  github-actions@sudhanportfoliowebsite.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/254598432060/locations/global/workloadIdentityPools/github/attribute.repository/Sudhan30/my-portfolio-website"

# Grant Storage Admin role
gcloud projects add-iam-policy-binding sudhanportfoliowebsite \
  --member="serviceAccount:github-actions@sudhanportfoliowebsite.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Grant Cloud Functions Invoker role (if needed)
gcloud projects add-iam-policy-binding sudhanportfoliowebsite \
  --member="serviceAccount:github-actions@sudhanportfoliowebsite.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.invoker"
```

## 🚀 Deployment Process

### Automatic Deployment
The workflow automatically runs when you:
- **Push to main branch**
- **Merge a pull request to main**

### Manual Deployment
You can also trigger deployment manually:
1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to Google Cloud Storage** workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## 🔧 What the Workflow Does

### 1. **Environment Setup**
- Checks out your code
- Sets up Node.js 20
- Installs dependencies with caching

### 2. **Build Process**
- Builds React app with environment variables
- Injects environment variables into HTML
- Verifies build directory

### 3. **Google Cloud Authentication**
- Uses Workload Identity Federation
- Authenticates with Google Cloud
- Sets up Cloud SDK

### 4. **Deployment**
- Clears existing bucket contents
- Uploads new build files
- Sets optimal cache headers
- Invalidates CDN cache

## 🌐 Environment Variables

The workflow automatically injects these environment variables:

### **Build Time**
```yaml
env:
  REACT_APP_GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REACT_APP_CLOUD_FUNCTIONS_URL: https://us-central1-${{ secrets.GCP_PROJECT_ID }}.cloudfunctions.net
```

### **Runtime (Injected into HTML)**
```html
<script>
  window.env = {
    REACT_APP_GCP_PROJECT_ID: 'sudhanportfoliowebsite',
    REACT_APP_CLOUD_FUNCTIONS_URL: 'https://us-central1-sudhanportfoliowebsite.cloudfunctions.net'
  };
</script>
```

## 📊 Performance Optimization

### Cache Headers
- **Static Assets** (JS, CSS): 1 year cache
- **HTML Files**: 1 day cache
- **Images/Icons**: 1 year cache

### CDN Integration
- Automatically invalidates Cloud CDN cache
- Ensures users get the latest version

## 🔍 Monitoring

### GitHub Actions
- View deployment status in **Actions** tab
- Check logs for any errors
- Monitor deployment duration

### Google Cloud Console
- **Storage**: [View Bucket](https://console.cloud.google.com/storage)
- **Functions**: [View Functions](https://console.cloud.google.com/functions)
- **Logs**: [View Logs](https://console.cloud.google.com/logs)

## 🚨 Troubleshooting

### Common Issues

#### 1. "Authentication failed" Error
- Check Workload Identity Federation setup
- Verify service account permissions
- Ensure GitHub secrets are correct

#### 2. "Bucket not found" Error
- Verify `GCP_BUCKET_NAME` secret
- Check if bucket exists in Google Cloud Console
- Ensure service account has Storage Admin role

#### 3. "Build failed" Error
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

#### 4. "Environment variables not working" Error
- Verify secrets are set correctly
- Check if environment variables are injected into HTML
- Test in browser console: `console.log(window.env)`

### Debug Commands

```bash
# Check service account permissions
gcloud projects get-iam-policy sudhanportfoliowebsite \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:github-actions@sudhanportfoliowebsite.iam.gserviceaccount.com"

# Check workload identity pool
gcloud iam workload-identity-pools describe github \
  --location="global"

# Check bucket permissions
gsutil iam get gs://www.sudharsana.dev
```

## 🔄 Workflow Customization

### Adding New Environment Variables
1. Add to GitHub secrets
2. Update workflow environment section
3. Update HTML injection script

### Changing Deployment Branch
```yaml
on:
  push:
    branches:
      - main
      - production  # Add new branch
```

### Adding Build Steps
```yaml
- name: Run tests
  run: npm test

- name: Run linting
  run: npm run lint
```

## 📈 Benefits of GitHub Actions

### ✅ Advantages
- **Automatic Deployment**: No manual intervention needed
- **Version Control**: Every deployment is tracked
- **Rollback Capability**: Easy to revert to previous versions
- **Security**: Uses Workload Identity Federation
- **Scalability**: Handles multiple environments
- **Monitoring**: Built-in logs and status tracking

### 🔒 Security Features
- **No Hardcoded Credentials**: All secrets stored securely
- **Workload Identity**: No long-lived service account keys
- **Least Privilege**: Minimal required permissions
- **Audit Trail**: All actions logged

## 🎯 Next Steps

1. **Set up GitHub secrets** as described above
2. **Configure Workload Identity Federation**
3. **Push to main branch** to trigger deployment
4. **Monitor deployment** in GitHub Actions
5. **Test your website** functionality

---

**🎉 Your portfolio will automatically deploy to Google Cloud Storage every time you push to the main branch!**
