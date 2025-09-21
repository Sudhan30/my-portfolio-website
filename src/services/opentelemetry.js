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
        this.batchSize = 20; // Increased batch size to reduce frequency
        this.minFlushInterval = 30000; // Minimum 30 seconds between flushes
        this.lastFlushTime = 0;
        this.isInitialized = false;
        this.userId = this.getOrCreateUserId();
        this.sessionId = this.getOrCreateSessionId();
        this.consentGiven = this.getConsentStatus();
    }

    /**
     * Get consent status from localStorage
     */
    getConsentStatus() {
        const consent = localStorage.getItem('telemetry_consent');
        return consent === 'true';
    }

    /**
     * Set consent status
     */
    setConsentStatus(consent) {
        localStorage.setItem('telemetry_consent', consent.toString());
        this.consentGiven = consent;
        
        if (consent) {
            // Initialize if consent is given
            if (!this.isInitialized) {
                this.initialize();
            }
        } else {
            // Clear data if consent is withdrawn
            this.clearStoredData();
        }
    }

    /**
     * Initialize OpenTelemetry service
     */
    initialize() {
        if (this.isInitialized) return;
        
        // Only initialize if consent is given
        if (!this.consentGiven) {
            console.log('🔍 OpenTelemetry service not initialized - no consent given');
            return;
        }
        
        console.log('🔍 Initializing OpenTelemetry service');
        
        // Set up automatic instrumentation
        this.setupAutomaticInstrumentation();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Set up error tracking
        this.setupErrorTracking();
        
        // Flush data on page unload
        this.setupPageUnloadFlush();
        
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
        if (!this.consentGiven) return null;
        
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
        this.checkBatchSize();
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
        if (!this.consentGiven) return;
        
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
        this.checkBatchSize();
    }

    /**
     * Log an event
     */
    log(level, message, attributes = {}) {
        if (!this.consentGiven) return;
        
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
        this.checkBatchSize();
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
        
        // Track scroll depth (throttled to prevent spam)
        let maxScrollDepth = 0;
        let scrollTimeout = null;
        
        window.addEventListener('scroll', () => {
            // Throttle scroll events to prevent spam
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) { // Only track at 25%, 50%, 75%, 100%
                    maxScrollDepth = scrollDepth;
                    this.recordMetric('scroll_depth', scrollDepth, {
                        'page.url': window.location.href
                    });
                }
                scrollTimeout = null;
            }, 2000); // Throttle to once every 2 seconds
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
     * Track Core Web Vitals (throttled to prevent spam)
     */
    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP) - only track once
        let lcpTracked = false;
        new PerformanceObserver((list) => {
            if (lcpTracked) return;
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.recordMetric('lcp', lastEntry.startTime, {
                'page.url': window.location.href
            });
            lcpTracked = true;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID) - only track once
        let fidTracked = false;
        new PerformanceObserver((list) => {
            if (fidTracked) return;
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.recordMetric('fid', entry.processingStart - entry.startTime, {
                    'page.url': window.location.href
                });
                fidTracked = true;
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS) - throttled
        let clsValue = 0;
        let clsTimeout = null;
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            // Throttle CLS updates
            if (clsTimeout) return;
            clsTimeout = setTimeout(() => {
                this.recordMetric('cls', clsValue, {
                    'page.url': window.location.href
                });
                clsTimeout = null;
            }, 5000); // Update CLS every 5 seconds max
        }).observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Set up performance monitoring (disabled to prevent spam)
     */
    setupPerformanceMonitoring() {
        // Resource loading monitoring disabled to prevent continuous data sending
        // Only track essential performance metrics, not every resource
        console.log('Performance monitoring setup (resource tracking disabled)');
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
     * Set up page unload flush
     */
    setupPageUnloadFlush() {
        // Flush data when page is about to unload
        window.addEventListener('beforeunload', () => {
            if (this.consentGiven && (this.traces.length > 0 || this.metrics.length > 0 || this.logs.length > 0)) {
                // Use sendBeacon for reliable data sending on page unload
                this.sendBeaconFlush();
            }
        });
    }

    /**
     * Send data using sendBeacon for page unload
     */
    sendBeaconFlush() {
        const data = {
            traces: this.traces,
            metrics: this.metrics,
            logs: this.logs
        };

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(`${config.cloudFunctionsUrl}/processOtelData`, blob);
    }


    /**
     * Clear stored data
     */
    clearStoredData() {
        this.traces = [];
        this.metrics = [];
        this.logs = [];
    }

    /**
     * Flush all telemetry data (only when explicitly called or when batch size is reached)
     */
    async flush() {
        if (!this.consentGiven) return;
        
        if (this.traces.length === 0 && this.metrics.length === 0 && this.logs.length === 0) {
            return;
        }
        
        const now = Date.now();
        
        // Check minimum interval
        if ((now - this.lastFlushTime) < this.minFlushInterval) {
            console.log('Flush skipped - minimum interval not reached');
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
        
        // Update last flush time
        this.lastFlushTime = now;
        
        // Send to Cloud Function
        try {
            await this.sendTelemetryData(data);
            console.log('Telemetry data flushed successfully');
        } catch (error) {
            console.error('Failed to send telemetry data:', error);
            // Re-add data to arrays for retry
            this.traces.push(...data.traces);
            this.metrics.push(...data.metrics);
            this.logs.push(...data.logs);
        }
    }

    /**
     * Check if batch size is reached and flush if needed (with minimum interval)
     */
    checkBatchSize() {
        if (!this.consentGiven) return;
        
        const totalItems = this.traces.length + this.metrics.length + this.logs.length;
        const now = Date.now();
        
        // Only flush if we have enough items AND enough time has passed
        if (totalItems >= this.batchSize && (now - this.lastFlushTime) >= this.minFlushInterval) {
            this.flush();
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

    /**
     * Track button click (from telemetry.js)
     */
    trackButtonClick(buttonText, buttonContext = '') {
        const trace = this.startTrace('button_click', {
            'button.text': buttonText.substring(0, 50),
            'button.context': buttonContext,
            'page.url': window.location.href
        });
        
        if (trace) {
            this.endTrace(trace.traceId, trace.spanId);
        }
    }

    /**
     * Track dropdown interaction (from telemetry.js)
     */
    trackDropdown(action, element, additionalData = {}) {
        const trace = this.startTrace('dropdown_interaction', {
            'dropdown.action': action,
            'element.tag': element?.tagName || 'unknown',
            'element.id': element?.id || '',
            'element.class': element?.className || '',
            'page.url': window.location.href,
            ...additionalData
        });
        
        if (trace) {
            this.endTrace(trace.traceId, trace.spanId);
        }
    }

    /**
     * Track form submission (from telemetry.js)
     */
    trackFormSubmit(form, additionalData = {}) {
        const formData = this.extractFormData(form);
        const trace = this.startTrace('form_submit', {
            'form.id': form?.id || '',
            'form.class': form?.className || '',
            'form.action': form?.action || '',
            'form.method': form?.method || 'POST',
            'form.fieldCount': formData.fieldCount,
            'page.url': window.location.href,
            ...additionalData
        });
        
        if (trace) {
            this.endTrace(trace.traceId, trace.spanId);
        }
    }

    /**
     * Track close button click (from telemetry.js)
     */
    trackClose(element, additionalData = {}) {
        const trace = this.startTrace('close_action', {
            'element.tag': element?.tagName || 'unknown',
            'element.id': element?.id || '',
            'element.class': element?.className || '',
            'page.url': window.location.href,
            ...additionalData
        });
        
        if (trace) {
            this.endTrace(trace.traceId, trace.spanId);
        }
    }

    /**
     * Track navigation (from telemetry.js)
     */
    trackNavigationCompat(fromSection, toSection) {
        const trace = this.startTrace('navigation', {
            'navigation.from': fromSection,
            'navigation.to': toSection,
            'page.url': window.location.href
        });
        
        if (trace) {
            this.endTrace(trace.traceId, trace.spanId);
        }
    }

    /**
     * Extract form data helper (from telemetry.js)
     */
    extractFormData(form) {
        const formData = new FormData(form);
        const data = {};
        let fieldCount = 0;
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
            fieldCount++;
        }
        
        return { ...data, fieldCount };
    }

    /**
     * Get consent status (compatibility method)
     */
    getConsentStatusCompat() {
        return this.consentGiven;
    }

    /**
     * Set consent status (compatibility method)
     */
    setConsentStatusCompat(consent) {
        this.setConsentStatus(consent);
    }
}

// Create singleton instance
const otelService = new OpenTelemetryService();

export default otelService;

