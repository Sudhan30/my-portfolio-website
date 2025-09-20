#!/bin/bash

# OpenTelemetry GCP Pipeline Setup Script
# This script sets up the necessary GCP resources for OpenTelemetry data collection

set -e

# Configuration
PROJECT_ID="sudhanportfoliowebsite"
DATASET_ID="otel_data"
TABLE_ID="traces"
TOPIC_NAME="otel-data"
BUCKET_NAME="otel-data-archive"

echo "🚀 Setting up OpenTelemetry GCP Pipeline for project: $PROJECT_ID"

# 1. Create Pub/Sub topic
echo "📡 Creating Pub/Sub topic: $TOPIC_NAME"
gcloud pubsub topics create $TOPIC_NAME --project=$PROJECT_ID

# 2. Create Cloud Storage bucket
echo "🗄️ Creating Cloud Storage bucket: $BUCKET_NAME"
gsutil mb gs://$BUCKET_NAME

# 3. Create BigQuery dataset
echo "📊 Creating BigQuery dataset: $DATASET_ID"
bq mk --dataset $PROJECT_ID:$DATASET_ID

# 4. Create BigQuery table with comprehensive schema
echo "📋 Creating BigQuery table: $TABLE_ID"
bq mk --table $PROJECT_ID:$DATASET_ID.$TABLE_ID '
{
  "fields": [
    {"name": "trace_id", "type": "STRING"},
    {"name": "span_id", "type": "STRING"},
    {"name": "parent_span_id", "type": "STRING"},
    {"name": "name", "type": "STRING"},
    {"name": "start_time", "type": "TIMESTAMP"},
    {"name": "end_time", "type": "TIMESTAMP"},
    {"name": "duration_ms", "type": "INTEGER"},
    {"name": "status_code", "type": "STRING"},
    {"name": "status_message", "type": "STRING"},
    {"name": "attributes", "type": "JSON"},
    {"name": "events", "type": "JSON"},
    {"name": "links", "type": "JSON"},
    {"name": "resource_attributes", "type": "JSON"},
    {"name": "instrumentation_scope_name", "type": "STRING"},
    {"name": "instrumentation_scope_version", "type": "STRING"},
    {"name": "created_at", "type": "TIMESTAMP", "mode": "REQUIRED"}
  ]
}'

# 5. Create additional tables for metrics and logs
echo "📈 Creating metrics table"
bq mk --table $PROJECT_ID:$DATASET_ID.metrics '
{
  "fields": [
    {"name": "metric_name", "type": "STRING"},
    {"name": "metric_type", "type": "STRING"},
    {"name": "value", "type": "FLOAT"},
    {"name": "timestamp", "type": "TIMESTAMP"},
    {"name": "attributes", "type": "JSON"},
    {"name": "resource_attributes", "type": "JSON"},
    {"name": "created_at", "type": "TIMESTAMP", "mode": "REQUIRED"}
  ]
}'

echo "📝 Creating logs table"
bq mk --table $PROJECT_ID:$DATASET_ID.logs '
{
  "fields": [
    {"name": "log_id", "type": "STRING"},
    {"name": "timestamp", "type": "TIMESTAMP"},
    {"name": "severity", "type": "STRING"},
    {"name": "body", "type": "STRING"},
    {"name": "attributes", "type": "JSON"},
    {"name": "resource_attributes", "type": "JSON"},
    {"name": "trace_id", "type": "STRING"},
    {"name": "span_id", "type": "STRING"},
    {"name": "created_at", "type": "TIMESTAMP", "mode": "REQUIRED"}
  ]
}'

# 6. Enable required APIs
echo "🔧 Enabling required APIs"
gcloud services enable pubsub.googleapis.com --project=$PROJECT_ID
gcloud services enable storage.googleapis.com --project=$PROJECT_ID
gcloud services enable bigquery.googleapis.com --project=$PROJECT_ID
gcloud services enable cloudfunctions.googleapis.com --project=$PROJECT_ID

# 7. Set up IAM permissions for Cloud Functions
echo "🔐 Setting up IAM permissions"
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/bigquery.dataEditor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/storage.objectCreator"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$PROJECT_ID@appspot.gserviceaccount.com" \
    --role="roles/pubsub.subscriber"

echo "✅ OpenTelemetry GCP resources setup complete!"
echo ""
echo "📋 Summary of created resources:"
echo "  - Pub/Sub Topic: projects/$PROJECT_ID/topics/$TOPIC_NAME"
echo "  - Cloud Storage Bucket: gs://$BUCKET_NAME"
echo "  - BigQuery Dataset: $PROJECT_ID:$DATASET_ID"
echo "  - BigQuery Tables: traces, metrics, logs"
echo ""
echo "Next steps:"
echo "1. Configure OpenTelemetry Collector (config.yaml)"
echo "2. Deploy Cloud Function for data processing"
echo "3. Implement OpenTelemetry SDK in your application"

