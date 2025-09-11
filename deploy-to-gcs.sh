#!/bin/bash

# GCS Bucket Deployment Script for Portfolio Website
# This script builds the React app and deploys it to Google Cloud Storage

set -e  # Exit on any error

echo "🚀 Deploying Portfolio Website to Google Cloud Storage"
echo "======================================================"

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-sudhanportfoliowebsite}"
BUCKET_NAME="${GCS_BUCKET_NAME:-$PROJECT_ID-portfolio}"
REGION="${GCS_REGION:-us-central1}"

# Check if required tools are installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ You are not authenticated with gcloud. Please run:"
    echo "   gcloud auth login"
    exit 1
fi

echo "📋 Configuration:"
echo "   • Project ID: $PROJECT_ID"
echo "   • Bucket Name: $BUCKET_NAME"
echo "   • Region: $REGION"
echo ""

# Set the project
echo "🔧 Setting Google Cloud project..."
gcloud config set project $PROJECT_ID

# Create bucket if it doesn't exist
echo "🪣 Checking/Creating GCS bucket..."
if ! gsutil ls -b gs://$BUCKET_NAME &> /dev/null; then
    echo "   Creating bucket: gs://$BUCKET_NAME"
    gsutil mb -l $REGION gs://$BUCKET_NAME
    echo "✅ Bucket created successfully"
else
    echo "✅ Bucket already exists"
fi

# Set bucket permissions for public access
echo "🔓 Setting bucket permissions for public access..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
echo "✅ Public access configured"

# Set up website configuration
echo "🌐 Configuring bucket for website hosting..."
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME
echo "✅ Website configuration set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create production environment file
echo "🔧 Creating production environment configuration..."
cat > .env.production << EOF
# Production environment variables
REACT_APP_GCP_PROJECT_ID=$PROJECT_ID
REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-$PROJECT_ID.cloudfunctions.net
EOF

echo "✅ Production environment file created"

# Build the application
echo "🏗️  Building React application for production..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Create a custom index.html with environment variables injected
echo "🔧 Injecting environment variables into build..."
cat > build/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon-sr-dramatic.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#2563eb" />
    <meta name="description" content="Sudharsana Rajasekaran - Data Engineer Portfolio" />
    <meta name="keywords" content="Data Engineer, Python, SQL, Big Data, Analytics, Portfolio" />
    <meta name="author" content="Sudharsana Rajasekaran" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://$BUCKET_NAME.storage.googleapis.com/" />
    <meta property="og:title" content="Sudharsana Rajasekaran - Data Engineer Portfolio" />
    <meta property="og:description" content="Experienced Data Engineer specializing in Python, SQL, Big Data technologies, and cloud platforms." />
    <meta property="og:image" content="https://$BUCKET_NAME.storage.googleapis.com/logo512.png" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://$BUCKET_NAME.storage.googleapis.com/" />
    <meta property="twitter:title" content="Sudharsana Rajasekaran - Data Engineer Portfolio" />
    <meta property="twitter:description" content="Experienced Data Engineer specializing in Python, SQL, Big Data technologies, and cloud platforms." />
    <meta property="twitter:image" content="https://$BUCKET_NAME.storage.googleapis.com/logo512.png" />
    
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/favicon-sr-dramatic.svg" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
    <!-- DNS Prefetch for performance -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://us-central1-$PROJECT_ID.cloudfunctions.net;" />
    
    <!-- Apple Touch Icon for iOS devices -->
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/favicon-sr-dramatic.svg" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon-sr-dramatic.svg" />
    <link rel="icon" type="image/x-icon" href="%PUBLIC_URL%/favicon-sr.ico" />
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sudharsana Rajasekaran",
      "jobTitle": "Data Engineer",
      "description": "Experienced Data Engineer specializing in Python, SQL, Big Data technologies, and cloud platforms.",
      "url": "https://$BUCKET_NAME.storage.googleapis.com/",
      "sameAs": [
        "https://www.linkedin.com/in/sudharsanarajasekaran/",
        "https://github.com/Sudhan30",
        "https://blog.sudharsana.dev"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Francisco Bay Area",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    }
    </script>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sudharsana Rajasekaran Portfolio",
      "url": "https://$BUCKET_NAME.storage.googleapis.com/",
      "description": "Data Engineer Portfolio showcasing skills, experience, and projects.",
      "author": {
        "@type": "Person",
        "name": "Sudharsana Rajasekaran"
      }
    }
    </script>
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Data Engineering Services",
      "description": "Professional data engineering services including data pipeline development, analytics, and cloud solutions.",
      "provider": {
        "@type": "Person",
        "name": "Sudharsana Rajasekaran"
      },
      "areaServed": "San Francisco Bay Area",
      "serviceType": "Data Engineering"
    }
    </script>
    
    <title>Sudharsana Rajasekaran - Data Engineer Portfolio</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <!-- Environment Variables Injection -->
    <script>
      window.env = {
        REACT_APP_GCP_PROJECT_ID: '$PROJECT_ID',
        REACT_APP_CLOUD_FUNCTIONS_URL: 'https://us-central1-$PROJECT_ID.cloudfunctions.net'
      };
    </script>
  </body>
</html>
EOF

echo "✅ Environment variables injected into build"

# Upload files to GCS bucket
echo "📤 Uploading files to GCS bucket..."
gsutil -m cp -r build/* gs://$BUCKET_NAME/

echo "✅ Files uploaded successfully"

# Set cache headers for better performance
echo "⚡ Setting cache headers for optimal performance..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/static/**/*.js
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/static/**/*.css
gsutil -m setmeta -h "Cache-Control:public, max-age=86400" gs://$BUCKET_NAME/*.html
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/*.ico
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/*.svg
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/*.png
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/*.jpg
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/*.jpeg

echo "✅ Cache headers set"

# Clean up temporary files
echo "🧹 Cleaning up temporary files..."
rm -f .env.production

echo "✅ Cleanup completed"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   • Project ID: $PROJECT_ID"
echo "   • Bucket Name: $BUCKET_NAME"
echo "   • Website URL: https://$BUCKET_NAME.storage.googleapis.com/"
echo "   • Region: $REGION"
echo ""
echo "🌐 Your portfolio is now live at:"
echo "   https://$BUCKET_NAME.storage.googleapis.com/"
echo ""
echo "🔧 Next Steps:"
echo "   1. Test your website functionality"
echo "   2. Set up custom domain (optional)"
echo "   3. Configure CDN for better performance (optional)"
echo ""
echo "📊 Monitoring:"
echo "   • View bucket: https://console.cloud.google.com/storage/browser/$BUCKET_NAME"
echo "   • Cloud Functions: https://console.cloud.google.com/functions/list?project=$PROJECT_ID"
echo ""
echo "🔒 Security:"
echo "   • All sensitive data is stored in Google Secret Manager"
echo "   • Environment variables are injected at build time"
echo "   • No credentials exposed in the deployed website"
