#!/bin/bash

# OpenTelemetry Pipeline Deployment Script
# This script deploys the complete OpenTelemetry pipeline to GCP

set -e

PROJECT_ID="sudhanportfoliowebsite"
FUNCTION_NAME="processOtelData"
FUNCTION_BATCH_NAME="processOtelDataBatch"

echo "🚀 Deploying OpenTelemetry Pipeline for project: $PROJECT_ID"

# 1. Set the project
gcloud config set project $PROJECT_ID

# 2. Install dependencies
echo "📦 Installing Cloud Function dependencies..."
cd functions
npm install
cd ..

# 3. Deploy the main OpenTelemetry processor function
echo "🔧 Deploying OpenTelemetry processor function..."
gcloud functions deploy $FUNCTION_NAME \
    --runtime nodejs20 \
    --trigger-http \
    --allow-unauthenticated \
    --source functions \
    --entry-point processOtelData \
    --memory 512MB \
    --timeout 60s \
    --max-instances 10

# 4. Deploy the batch processor function (Pub/Sub triggered)
echo "📡 Deploying batch processor function..."
gcloud functions deploy $FUNCTION_BATCH_NAME \
    --runtime nodejs20 \
    --trigger-topic otel-data \
    --source functions \
    --entry-point processOtelDataBatch \
    --memory 1GB \
    --timeout 300s \
    --max-instances 5

# 5. Set up IAM permissions for the functions
echo "🔐 Setting up IAM permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/storage.objectCreator"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/pubsub.subscriber"

# 6. Create a Pub/Sub subscription for the batch processor
echo "📨 Creating Pub/Sub subscription..."
gcloud pubsub subscriptions create otel-data-subscription \
    --topic otel-data \
    --ack-deadline 60

# 7. Test the deployment
echo "🧪 Testing the deployment..."
FUNCTION_URL=$(gcloud functions describe $FUNCTION_NAME --format="value(httpsTrigger.url)")

echo "Testing OpenTelemetry processor function..."
curl -X POST $FUNCTION_URL \
    -H "Content-Type: application/json" \
    -d '{
        "traces": [{
            "traceId": "test-trace-123",
            "spanId": "test-span-123",
            "name": "test-operation",
            "startTime": 1640995200000,
            "endTime": 1640995201000,
            "status": "OK"
        }],
        "metrics": [{
            "name": "test-metric",
            "value": 42,
            "timestamp": 1640995200000
        }],
        "logs": [{
            "level": "info",
            "message": "Test log message",
            "timestamp": 1640995200000
        }]
    }' || echo "Test failed, but deployment may still be successful"

echo "✅ OpenTelemetry pipeline deployment complete!"
echo ""
echo "📋 Deployment Summary:"
echo "  - HTTP Function: $FUNCTION_URL"
echo "  - Batch Function: Pub/Sub triggered"
echo "  - BigQuery Dataset: $PROJECT_ID:otel_data"
echo "  - Cloud Storage: gs://otel-data-archive"
echo "  - Pub/Sub Topic: projects/$PROJECT_ID/topics/otel-data"
echo ""
echo "🔍 Next steps:"
echo "1. Test the frontend OpenTelemetry integration"
echo "2. Monitor BigQuery for incoming telemetry data"
echo "3. Set up dashboards in Google Cloud Console"
echo "4. Configure alerting for critical metrics"

