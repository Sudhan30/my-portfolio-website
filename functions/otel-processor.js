/**
 * OpenTelemetry Data Processor Cloud Function
 * Processes telemetry data from Pub/Sub and stores it in BigQuery and Cloud Storage
 */

const { BigQuery } = require('@google-cloud/bigquery');
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');

// Initialize clients
const bigquery = new BigQuery({ projectId: 'sudhanportfoliowebsite' });
const storage = new Storage({ projectId: 'sudhanportfoliowebsite' });
const pubsub = new PubSub({ projectId: 'sudhanportfoliowebsite' });

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
        processLogs(data),
        processConsolidatedMetrics(data) // Add consolidated metrics processing
    ]);

        // Check results and handle gracefully
        const processedResults = results.map((result, index) => {
            const type = ['traces', 'metrics', 'logs', 'consolidated_metrics'][index];
            if (result.status === 'fulfilled') {
                return { type, ...result.value };
            } else {
                console.error(`${type} processing failed:`, result.reason);
                return { type, success: false, error: result.reason.message };
            }
        });

        const failures = processedResults.filter(r => !r.success);
        const successes = processedResults.filter(r => r.success);

        console.log(`Processing complete: ${successes.length} successful, ${failures.length} failed`);

        // Always return success to prevent infinite loops
        res.status(200).json({
            success: true,
            message: 'Telemetry processing completed',
            results: {
                successful: successes.length,
                failed: failures.length,
                details: processedResults
            }
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
        attributes: JSON.stringify(trace.attributes || {}),
        events: trace.events && trace.events.length > 0 ? JSON.stringify(trace.events[0]) : null,
        links: trace.links && trace.links.length > 0 ? JSON.stringify(trace.links[0]) : null,
        resource_attributes: trace.resource?.attributes ? JSON.stringify(trace.resource.attributes) : null,
        instrumentation_scope_name: trace.instrumentationScope?.name || null,
        instrumentation_scope_version: trace.instrumentationScope?.version || null,
        created_at: new Date()
    }));

    try {
        const errors = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('traces').insert(rows);
        if (errors.length > 0) {
            console.error('BigQuery insert errors:', JSON.stringify(errors, null, 2));
            console.error('Rows being inserted:', JSON.stringify(rows, null, 2));
            // Don't throw error, just log it to prevent infinite loops
            console.log(`Warning: ${errors.length} trace insert errors occurred`);
            return { success: false, errors: errors.length };
        }
        console.log(`Successfully inserted ${rows.length} trace records`);
        return { success: true, count: rows.length };
    } catch (error) {
        console.error('BigQuery traces insert failed:', error.message);
        return { success: false, error: error.message };
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
        attributes: metric.attributes ? JSON.stringify(metric.attributes) : null,
        resource_attributes: metric.resource?.attributes ? JSON.stringify(metric.resource.attributes) : null,
        created_at: new Date()
    }));

    console.log(`Processing ${rows.length} metrics:`, JSON.stringify(rows, null, 2));

    try {
        console.log(`Attempting to insert ${rows.length} rows into BigQuery metrics table`);
        console.log(`Using project ID: ${PROJECT_ID}, dataset: ${DATASET_ID}`);
        const [insertErrors] = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('metrics').insert(rows);
        if (insertErrors && insertErrors.length > 0) {
            console.error('BigQuery metrics insert errors:', JSON.stringify(insertErrors, null, 2));
            console.log(`Warning: ${insertErrors.length} metric insert errors occurred`);
            return { success: false, errors: insertErrors.length };
        }
        console.log(`Successfully inserted ${rows.length} metrics into BigQuery`);
        return { success: true, count: rows.length };
    } catch (error) {
        console.error('BigQuery metrics insert failed:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Process consolidated metrics data
 */
async function processConsolidatedMetrics(data) {
    if (!data.consolidated_metrics) {
        console.log('No consolidated metrics to process');
        return { success: true, count: 0 };
    }

    const consolidatedMetrics = data.consolidated_metrics;
    const rows = [];

    // Store consolidated metrics as a single JSON object
    rows.push({
        metric_name: 'consolidated_metrics',
        metric_type: 'consolidated',
        value: JSON.stringify(consolidatedMetrics),
        timestamp: new Date(),
        attributes: JSON.stringify({ 
            total_categories: Object.keys(consolidatedMetrics).length,
            categories: Object.keys(consolidatedMetrics),
            consolidated: true 
        }),
        resource_attributes: null,
        created_at: new Date()
    });

    if (rows.length === 0) {
        console.log('No consolidated metrics to insert');
        return { success: true, count: 0 };
    }

    try {
        console.log(`Processing ${rows.length} consolidated metrics:`, JSON.stringify(rows, null, 2));
        console.log(`Attempting to insert ${rows.length} rows into BigQuery consolidated metrics table`);
        
        const [insertErrors] = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('metrics').insert(rows);
        if (insertErrors && insertErrors.length > 0) {
            console.error('BigQuery consolidated metrics insert errors:', JSON.stringify(insertErrors, null, 2));
            console.log(`Warning: ${insertErrors.length} consolidated metric insert errors occurred`);
            return { success: false, errors: insertErrors.length };
        }
        console.log(`Successfully inserted ${rows.length} consolidated metrics into BigQuery`);
        return { success: true, count: rows.length };
    } catch (error) {
        console.error('BigQuery consolidated metrics insert failed:', error.message);
        return { success: false, error: error.message };
    }
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
        attributes: log.attributes ? JSON.stringify(log.attributes) : null,
        resource_attributes: log.resource?.attributes ? JSON.stringify(log.resource.attributes) : null,
        trace_id: log.traceId || null,
        span_id: log.spanId || null,
        created_at: new Date()
    }));

    try {
        const errors = await bigquery.dataset(DATASET_ID, { projectId: PROJECT_ID }).table('logs').insert(rows);
        if (errors.length > 0) {
            console.error('BigQuery logs insert errors:', JSON.stringify(errors, null, 2));
            console.log(`Warning: ${errors.length} log insert errors occurred`);
            return { success: false, errors: errors.length };
        }
        console.log(`Successfully inserted ${rows.length} log records`);
        return { success: true, count: rows.length };
    } catch (error) {
        console.error('BigQuery logs insert failed:', error.message);
        return { success: false, error: error.message };
    }
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

