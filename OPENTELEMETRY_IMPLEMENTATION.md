# OpenTelemetry Implementation for Portfolio Website

This document describes the complete OpenTelemetry implementation for the portfolio website, including setup, configuration, and usage.

## 🏗️ Architecture Overview

The OpenTelemetry pipeline consists of the following components:

```
Frontend (React) → OpenTelemetry SDK → Cloud Function → Pub/Sub → BigQuery + Cloud Storage
```

### Components:

1. **Frontend OpenTelemetry SDK** - Custom implementation in `src/services/opentelemetry.js`
2. **Cloud Function Processor** - `functions/otel-processor.js` for data processing
3. **GCP Pub/Sub** - Message queue for telemetry data
4. **BigQuery** - Data warehouse for analytics and querying
5. **Cloud Storage** - Long-term archival storage

## 📊 Data Types Collected

### Traces
- Page views and navigation
- User interactions (clicks, form submissions)
- Performance metrics (Core Web Vitals)
- Error tracking and debugging

### Metrics
- Page load times
- Scroll depth
- Resource loading times
- Custom business metrics

### Logs
- JavaScript errors
- User actions
- System events
- Debug information

## 🚀 Setup Instructions

### 1. Prerequisites

- Google Cloud Platform project
- `gcloud` CLI installed and configured
- Node.js 20+ for Cloud Functions

### 2. Create GCP Resources

Run the setup script to create all necessary resources:

```bash
chmod +x setup-otel-gcp.sh
./setup-otel-gcp.sh
```

This creates:
- Pub/Sub topic: `otel-data`
- Cloud Storage bucket: `otel-data-archive`
- BigQuery dataset: `otel_data`
- BigQuery tables: `traces`, `metrics`, `logs`

### 3. Deploy Cloud Functions

Deploy the OpenTelemetry processing functions:

```bash
chmod +x deploy-otel-pipeline.sh
./deploy-otel-pipeline.sh
```

### 4. Configure Frontend

The OpenTelemetry service is automatically initialized in `src/App.js`:

```javascript
import otelService from './services/opentelemetry';

// Initialize OpenTelemetry
otelService.initialize();
```

## 🔧 Configuration

### OpenTelemetry Collector

The collector configuration is in `otel-collector-config.yaml`:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  googlecloudpubsub:
    project: sudhanportfoliowebsite
    topic: projects/sudhanportfoliowebsite/topics/otel-data

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [googlecloudpubsub]
```

### Cloud Function Configuration

The processor function handles:
- Data validation and sanitization
- BigQuery insertion
- Cloud Storage archival
- Error handling and retry logic

## 📈 Usage Examples

### Custom Traces

```javascript
import otelService from './services/opentelemetry';

// Start a custom trace
const { traceId, spanId } = otelService.startTrace('custom-operation', {
    'operation.type': 'user-action',
    'user.id': 'user123'
});

// Do some work...

// End the trace
otelService.endTrace(traceId, spanId, 'OK');
```

### Custom Metrics

```javascript
// Record a custom metric
otelService.recordMetric('button_clicks', 1, {
    'button.id': 'contact-form-submit',
    'page.section': 'contact'
});
```

### Custom Logs

```javascript
// Log an event
otelService.log('info', 'User completed contact form', {
    'form.id': 'contact-form',
    'user.email': 'user@example.com'
});
```

## 🔍 Monitoring and Analytics

### BigQuery Queries

#### Top Pages by Views
```sql
SELECT 
  JSON_EXTRACT_SCALAR(attributes, '$.page.url') as page_url,
  COUNT(*) as view_count
FROM `sudhanportfoliowebsite.otel_data.traces`
WHERE name = 'page_view'
GROUP BY page_url
ORDER BY view_count DESC
LIMIT 10;
```

#### Performance Metrics
```sql
SELECT 
  AVG(CAST(JSON_EXTRACT_SCALAR(attributes, '$.value') AS FLOAT64)) as avg_load_time,
  PERCENTILE_CONT(CAST(JSON_EXTRACT_SCALAR(attributes, '$.value') AS FLOAT64), 0.5) OVER() as median_load_time
FROM `sudhanportfoliowebsite.otel_data.metrics`
WHERE name = 'page_load_time';
```

#### Error Analysis
```sql
SELECT 
  JSON_EXTRACT_SCALAR(attributes, '$.error.message') as error_message,
  COUNT(*) as error_count
FROM `sudhanportfoliowebsite.otel_data.logs`
WHERE level = 'error'
GROUP BY error_message
ORDER BY error_count DESC;
```

### Cloud Storage Archival

Raw telemetry data is archived in Cloud Storage for long-term storage and compliance:

```
gs://otel-data-archive/telemetry/
├── 2024-01-01/
│   ├── 1640995200.json
│   └── 1640995260.json
└── 2024-01-02/
    └── ...
```

## 💰 Cost Optimization

### Free Tier Limits
- **Pub/Sub**: 10 GB messages/month
- **Cloud Functions**: 2M invocations/month
- **BigQuery**: 1 TB queries/month, 10 GB storage/month
- **Cloud Storage**: 5 GB-months Standard Storage

### Optimization Strategies

1. **Sampling**: 10% trace sampling to reduce data volume
2. **Batch Processing**: 5-second intervals for efficient data transmission
3. **Data Retention**: Automatic cleanup of old data
4. **Compression**: Efficient data formats to reduce storage costs

## 🔒 Security and Privacy

### Data Protection
- All personal data is anonymized
- IP addresses are hashed
- User consent is required for data collection
- CCPA compliance implemented

### Access Control
- IAM roles for secure access
- Service account permissions
- Audit logging enabled

## 🚨 Troubleshooting

### Common Issues

1. **Function Timeout**: Increase timeout in deployment script
2. **BigQuery Quota**: Check query limits and storage usage
3. **Pub/Sub Messages**: Monitor message backlog
4. **Frontend Errors**: Check browser console for telemetry errors

### Debug Commands

```bash
# Check function logs
gcloud functions logs read processOtelData --limit 50

# Check BigQuery data
bq query "SELECT COUNT(*) FROM \`sudhanportfoliowebsite.otel_data.traces\`"

# Check Pub/Sub messages
gcloud pubsub topics list
```

## 📊 Dashboard Setup

### Google Cloud Console
1. Navigate to BigQuery
2. Create custom dashboards
3. Set up alerts for critical metrics
4. Configure data exports

### Custom Analytics
- User behavior analysis
- Performance monitoring
- Error tracking and alerting
- Business intelligence reports

## 🔄 Maintenance

### Regular Tasks
- Monitor BigQuery costs
- Clean up old data
- Update dependencies
- Review and optimize queries

### Scaling Considerations
- Increase Cloud Function instances for high traffic
- Implement data partitioning for large datasets
- Consider data archiving strategies
- Monitor and adjust sampling rates

## 📚 Additional Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Google Cloud Monitoring](https://cloud.google.com/monitoring)
- [BigQuery Best Practices](https://cloud.google.com/bigquery/docs/best-practices)
- [Cloud Functions Performance](https://cloud.google.com/functions/docs/best-practices)

