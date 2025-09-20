/**
 * OpenTelemetry Implementation for Portfolio Website
 * Custom telemetry service that sends data to GCP Pub/Sub via Cloud Functions
 */

import { config } from '../utils/env';

class OpenTelemetryService {
    constructor() {
        this.traces = [];
        this.metrics = [];
        this.logs = [];
        this.batchSize = 10;
        this.flushInterval = 5000; // 5 seconds
        this.isInitialized = false;
        this.userId = this.getOrCreateUserId();
        this.sessionId = this.getOrCreateSessionId();
        
        // Start batch processing
        this.startBatchProcessor();
    }

    /**
     * Initialize OpenTelemetry service
     */
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🔍 Initializing OpenTelemetry service');
        
        // Set up automatic instrumentation
        this.setupAutomaticInstrumentation();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Set up error tracking
        this.setupErrorTracking();
        
        this.isInitialized = true;
        console.log('✅ OpenTelemetry service initialized');
    }

    /**
     * Get or create user ID
     */
    getOrCreateUserId() {
        let userId = localStorage.getItem('otel_user_id');
        if (!userId) {
            userId = this.generateId();
            localStorage.setItem('otel_user_id', userId);
        }
        return userId;
    }

    /**
     * Get or create session ID
     */
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('otel_session_id');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('otel_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    /**
     * Start a new trace
     */
    startTrace(name, attributes = {}) {
        const traceId = this.generateId();
        const spanId = this.generateId();
        
        const trace = {
            traceId,
            spanId,
            name,
            startTime: Date.now(),
            attributes: {
                ...attributes,
                'service.name': 'portfolio-website',
                'service.version': '1.0.0',
                'user.id': this.userId,
                'session.id': this.sessionId
            }
        };
        
        this.traces.push(trace);
        return { traceId, spanId };
    }

    /**
     * End a trace
     */
    endTrace(traceId, spanId, status = 'OK', statusMessage = null) {
        const trace = this.traces.find(t => t.traceId === traceId && t.spanId === spanId);
        if (!trace) return;
        
        trace.endTime = Date.now();
        trace.duration = trace.endTime - trace.startTime;
        trace.status = status;
        trace.statusMessage = statusMessage;
        
        // Send trace immediately for important operations
        if (trace.name.includes('error') || trace.name.includes('critical')) {
            this.sendTraces([trace]);
        }
    }

    /**
     * Record a metric
     */
    recordMetric(name, value, attributes = {}) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            attributes: {
                ...attributes,
                'service.name': 'portfolio-website',
                'user.id': this.userId,
                'session.id': this.sessionId
            }
        };
        
        this.metrics.push(metric);
    }

    /**
     * Log an event
     */
    log(level, message, attributes = {}) {
        const log = {
            level,
            message,
            timestamp: Date.now(),
            attributes: {
                ...attributes,
                'service.name': 'portfolio-website',
                'user.id': this.userId,
                'session.id': this.sessionId
            }
        };
        
        this.logs.push(log);
    }

    /**
     * Set up automatic instrumentation
     */
    setupAutomaticInstrumentation() {
        // Track page views
        this.trackPageView();
        
        // Track navigation
        this.trackNavigation();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track performance
        this.trackPerformance();
    }

    /**
     * Track page view
     */
    trackPageView() {
        const trace = this.startTrace('page_view', {
            'page.url': window.location.href,
            'page.title': document.title,
            'page.referrer': document.referrer
        });
        
        this.endTrace(trace.traceId, trace.spanId);
    }

    /**
     * Track navigation
     */
    trackNavigation() {
        // Track navigation changes
        let lastUrl = window.location.href;
        
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                this.trackPageView();
                lastUrl = window.location.href;
            }
        });
        
        observer.observe(document, { subtree: true, childList: true });
    }

    /**
     * Track user interactions
     */
    trackUserInteractions() {
        // Track clicks
        document.addEventListener('click', (event) => {
            const trace = this.startTrace('user_click', {
                'element.tag': event.target.tagName,
                'element.id': event.target.id,
                'element.class': event.target.className,
                'element.text': event.target.textContent?.substring(0, 100),
                'click.x': event.clientX,
                'click.y': event.clientY
            });
            
            this.endTrace(trace.traceId, trace.spanId);
        });
        
        // Track form submissions
        document.addEventListener('submit', (event) => {
            const trace = this.startTrace('form_submit', {
                'form.id': event.target.id,
                'form.class': event.target.className,
                'form.action': event.target.action,
                'form.method': event.target.method
            });
            
            this.endTrace(trace.traceId, trace.spanId);
        });
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.recordMetric('scroll_depth', scrollDepth, {
                    'page.url': window.location.href
                });
            }
        });
    }

    /**
     * Track performance metrics
     */
    trackPerformance() {
        // Track page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.recordMetric('page_load_time', loadTime, {
                'page.url': window.location.href
            });
        });
        
        // Track Core Web Vitals
        this.trackCoreWebVitals();
    }

    /**
     * Track Core Web Vitals
     */
    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.recordMetric('lcp', lastEntry.startTime, {
                'page.url': window.location.href
            });
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.recordMetric('fid', entry.processingStart - entry.startTime, {
                    'page.url': window.location.href
                });
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.recordMetric('cls', clsValue, {
                'page.url': window.location.href
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor resource loading
        const resourceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.recordMetric('resource_load_time', entry.duration, {
                    'resource.name': entry.name,
                    'resource.type': entry.initiatorType
                });
            });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
    }

    /**
     * Set up error tracking
     */
    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.log('error', 'JavaScript Error', {
                'error.message': event.message,
                'error.filename': event.filename,
                'error.lineno': event.lineno,
                'error.colno': event.colno,
                'error.stack': event.error?.stack
            });
        });
        
        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.log('error', 'Unhandled Promise Rejection', {
                'error.reason': event.reason?.toString(),
                'error.stack': event.reason?.stack
            });
        });
    }

    /**
     * Start batch processor
     */
    startBatchProcessor() {
        setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }

    /**
     * Flush all telemetry data
     */
    async flush() {
        if (this.traces.length === 0 && this.metrics.length === 0 && this.logs.length === 0) {
            return;
        }
        
        const data = {
            traces: [...this.traces],
            metrics: [...this.metrics],
            logs: [...this.logs]
        };
        
        // Clear local arrays
        this.traces = [];
        this.metrics = [];
        this.logs = [];
        
        // Send to Cloud Function
        try {
            await this.sendTelemetryData(data);
        } catch (error) {
            console.error('Failed to send telemetry data:', error);
            // Re-add data to arrays for retry
            this.traces.push(...data.traces);
            this.metrics.push(...data.metrics);
            this.logs.push(...data.logs);
        }
    }

    /**
     * Send telemetry data to Cloud Function
     */
    async sendTelemetryData(data) {
        const response = await fetch(`${config.cloudFunctionsUrl}/processOtelData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    /**
     * Send traces immediately
     */
    async sendTraces(traces) {
        const data = { traces, metrics: [], logs: [] };
        await this.sendTelemetryData(data);
    }

    /**
     * Send metrics immediately
     */
    async sendMetrics(metrics) {
        const data = { traces: [], metrics, logs: [] };
        await this.sendTelemetryData(data);
    }

    /**
     * Send logs immediately
     */
    async sendLogs(logs) {
        const data = { traces: [], metrics: [], logs };
        await this.sendTelemetryData(data);
    }
}

// Create singleton instance
const otelService = new OpenTelemetryService();

export default otelService;

