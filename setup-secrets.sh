#!/bin/bash

# Setup script for Google Secret Manager
# This script helps you create the necessary secrets for email functionality

echo "🔐 Setting up Google Secret Manager for Portfolio Email Notifications"
echo "=================================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ You are not authenticated with gcloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

# Set project ID (replace with your actual project ID)
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
echo "📋 Using project: $PROJECT_ID"

# Enable Secret Manager API
echo "🔧 Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID

echo ""
echo "📧 Now we'll create the email secrets..."
echo ""

# Create Zoho email secret
echo "1️⃣ Creating email secret..."
echo "Enter your email address (e.g., your-email@domain.com):"
read -r EMAIL_ADDRESS

if [ -z "$EMAIL_ADDRESS" ]; then
    echo "❌ Email address cannot be empty"
    exit 1
fi

echo "$EMAIL_ADDRESS" | gcloud secrets create email-credentials \
    --data-file=- \
    --project=$PROJECT_ID

if [ $? -eq 0 ]; then
    echo "✅ Email credentials secret created successfully"
else
    echo "⚠️  Secret might already exist, continuing..."
fi

# Create password secret
echo ""
echo "2️⃣ Creating password secret..."
echo "Enter your email app password (not your regular password):"
echo "💡 If you don't have an app password, create one in your email provider's security settings"
read -s EMAIL_PASSWORD

if [ -z "$EMAIL_PASSWORD" ]; then
    echo "❌ Password cannot be empty"
    exit 1
fi

echo "$EMAIL_PASSWORD" | gcloud secrets create email-password \
    --data-file=- \
    --project=$PROJECT_ID

if [ $? -eq 0 ]; then
    echo "✅ Email password secret created successfully"
else
    echo "⚠️  Secret might already exist, continuing..."
fi

echo ""
echo "🔑 Granting Cloud Functions access to secrets..."

# Grant access to Cloud Functions service account
CLOUD_FUNCTIONS_SA="${PROJECT_ID}@appspot.gserviceaccount.com"

gcloud secrets add-iam-policy-binding email-credentials \
    --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --project=$PROJECT_ID

gcloud secrets add-iam-policy-binding email-password \
    --member="serviceAccount:${CLOUD_FUNCTIONS_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --project=$PROJECT_ID

echo "✅ Permissions granted to Cloud Functions service account"
echo ""
echo "🎉 Setup complete! Your secrets are now securely stored in Google Secret Manager."
echo ""
echo "📋 Summary:"
echo "   • Email: $EMAIL_ADDRESS"
echo "   • Recipients: your-primary-email@domain.com (CC: your-cc-email@domain.com)"
echo "   • SMTP: smtp.your-provider.com:465"
echo ""
echo "🚀 Next steps:"
echo "   1. Install dependencies: cd functions && npm install"
echo "   2. Deploy the function: gcloud functions deploy submitContactForm --runtime nodejs20 --trigger-http --allow-unauthenticated"
echo "   3. Test the contact form on your website"
echo ""
echo "🔒 Security: Your email credentials are now encrypted and only accessible by your Cloud Functions."
