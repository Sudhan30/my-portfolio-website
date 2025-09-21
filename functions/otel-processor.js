/**
 * OpenTelemetry Data Processor Cloud Function
 * Processes telemetry data from Pub/Sub and stores it in BigQuery and Cloud Storage
 */

const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');

// Initialize clients
const bigquery = new BigQuery();
const storage = new Storage();
const pubsub = new PubSub();

// Configuration
const PROJECT_ID = 'sudhanportfoliowebsite';
const DATASET_ID = 'otel_data';
const BUCKET_NAME = 'otel-data-archive';

/**
 * HTTP Cloud Function entry point
 */
exports.processOtelData = async (req, res) => {
    try {
        // Handle CORS
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }

        const data = req.body;
        console.log('Processing telemetry data:', JSON.stringify(data, null, 2));

        // Process different types of telemetry data
        const results = await Promise.allSettled([
            processTraces(data),
            processMetrics(data),
            processLogs(data)
        ]);

        // Check for any failures
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
            console.error('Some processing failed:', failures);
            res.status(500).json({ 
                success: false, 
                message: 'Partial processing failure',
                errors: failures.map(f => f.reason)
            });
            return;
        }

        res.status(200).json({ 
            success: true, 
            message: 'Telemetry data processed successfully' 
        });

    } catch (error) {
        console.error('Error processing telemetry data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

/**
 * Process trace data
 */
async function processTraces(data) {
    if (!data.traces || !Array.isArray(data.traces)) {
        return;
    }

    const tableId = `${PROJECT_ID}.${DATASET_ID}.traces`;
    const rows = data.traces.map(trace => ({
        trace_id: trace.traceId,
        span_id: trace.spanId,
        parent_span_id: trace.parentSpanId || null,
        name: trace.name,
        start_time: new Date(trace.startTime),
        end_time: trace.endTime ? new Date(trace.endTime) : new Date(trace.startTime + (trace.duration || 0)),
        duration_ms: trace.duration || 0,
        status_code: trace.status?.code || 'OK',
        status_message: trace.status?.message || null,
        attributes: trace.attributes || {},
        events: trace.events && trace.events.length > 0 ? trace.events[0] : {},
        links: trace.links && trace.links.length > 0 ? trace.links[0] : {},
        resource_attributes: trace.resource?.attributes || {},
        instrumentation_scope_name: trace.instrumentationScope?.name || null,
        instrumentation_scope_version: trace.instrumentationScope?.version || null,
        created_at: new Date()
    }));

    const errors = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('traces').insert(rows);
    if (errors.length > 0) {
        console.error('BigQuery insert errors:', JSON.stringify(errors, null, 2));
        console.error('Rows being inserted:', JSON.stringify(rows, null, 2));
        throw new Error(`BigQuery insert errors: ${JSON.stringify(errors)}`);
    }

    console.log(`Inserted ${rows.length} trace records`);
}

/**
 * Process metrics data
 */
async function processMetrics(data) {
    if (!data.metrics || !Array.isArray(data.metrics) || data.metrics.length === 0) {
        console.log('No metrics to process');
        return;
    }

    const tableId = `${PROJECT_ID}.${DATASET_ID}.metrics`;
    const rows = data.metrics.map(metric => ({
        metric_name: metric.name,
        metric_type: metric.type,
        value: metric.value,
        timestamp: new Date(metric.timestamp),
        attributes: metric.attributes || {},
        resource_attributes: metric.resource?.attributes || {},
        created_at: new Date()
    }));

    const errors = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('metrics').insert(rows);
    if (errors.length > 0) {
        throw new Error(`BigQuery insert errors: ${JSON.stringify(errors)}`);
    }

    console.log(`Inserted ${rows.length} metric records`);
}

/**
 * Process logs data
 */
async function processLogs(data) {
    if (!data.logs || !Array.isArray(data.logs) || data.logs.length === 0) {
        console.log('No logs to process');
        return;
    }

    const tableId = `${PROJECT_ID}.${DATASET_ID}.logs`;
    const rows = data.logs.map(log => ({
        log_id: log.logId || generateId(),
        timestamp: new Date(log.timestamp),
        severity: log.severity || 'INFO',
        body: log.body || '',
        attributes: log.attributes || {},
        resource_attributes: log.resource?.attributes || {},
        trace_id: log.traceId || null,
        span_id: log.spanId || null,
        created_at: new Date()
    }));

    const errors = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('logs').insert(rows);
    if (errors.length > 0) {
        throw new Error(`BigQuery insert errors: ${JSON.stringify(errors)}`);
    }

    console.log(`Inserted ${rows.length} log records`);
}

/**
 * Generate a unique ID
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Pub/Sub triggered function for batch processing
 */
exports.processOtelDataBatch = async (event, context) => {
    try {
        const pubsubMessage = Buffer.from(event.data, 'base64').toString();
        const data = JSON.parse(pubsubMessage);

        console.log('Processing batch telemetry data from Pub/Sub');

        // Process the data
        await processTraces(data);
        await processMetrics(data);
        await processLogs(data);

        // Store raw data in Cloud Storage for archival
        const bucket = storage.bucket(BUCKET_NAME);
        const fileName = `telemetry/${context.timestamp}.json`;
        const file = bucket.file(fileName);
        
        await file.save(pubsubMessage, {
            metadata: {
                contentType: 'application/json',
                metadata: {
                    timestamp: context.timestamp,
                    eventId: context.eventId
                }
            }
        });

        console.log(`Stored raw data in Cloud Storage: ${fileName}`);

    } catch (error) {
        console.error('Error processing batch telemetry data:', error);
        throw error;
    }
};

