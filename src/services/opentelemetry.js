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
        this.batchSize = 5; // Reduced batch size for testing
        this.minFlushInterval = 5000; // Reduced to 5 seconds for testing
        this.lastFlushTime = 0;
        this.pageLoadTime = Date.now();
        this.hasUserEngaged = false; // Track if user has actually interacted
        this.isInitialized = false;
        this.userId = this.getOrCreateUserId();
        this.sessionId = this.getOrCreateSessionId();
        this.sessionTraceId = this.getOrCreateSessionTraceId(); // One trace per session
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
     * Start a new session (call when page loads)
     */
    startNewSession() {
        // Generate new session ID and trace ID for new session
        this.sessionId = this.generateId();
        this.sessionTraceId = this.generateId();
        sessionStorage.setItem('otel_session_id', this.sessionId);
        sessionStorage.setItem('otel_session_trace_id', this.sessionTraceId);
        
        console.log(`New session started: ${this.sessionId}, trace: ${this.sessionTraceId}`);
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
        
        // Start new session for this page load
        this.startNewSession();
        
        // Only collect data if consent is given
        if (this.consentGiven) {
            // Collect essential browser/device info immediately
            this.collectEssentialInfo();
            
            // Set up automatic instrumentation
            this.setupAutomaticInstrumentation();
        } else {
            console.log('🔍 OpenTelemetry service initialized but no consent given - data collection disabled');
        }
        
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
     * Get or create session trace ID (one trace per session)
     */
    getOrCreateSessionTraceId() {
        let sessionTraceId = sessionStorage.getItem('otel_session_trace_id');
        if (!sessionTraceId) {
            sessionTraceId = this.generateId();
            sessionStorage.setItem('otel_session_trace_id', sessionTraceId);
        }
        return sessionTraceId;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    /**
     * Start a new span within the session trace
     */
    startTrace(name, attributes = {}) {
        if (!this.consentGiven) return null;
        
        // Use session trace ID (same for entire session)
        const traceId = this.sessionTraceId;
        // Generate new span ID for each action
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
            type: attributes['metric.type'] || 'custom', // Extract metric type from attributes
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
        console.log(`📊 Metric recorded: ${name} = ${value}, total metrics: ${this.metrics.length}`);
        
        // Force flush metrics immediately if we have enough (for page load metrics)
        if (this.metrics.length >= 3) {
            console.log('🚀 Force flushing metrics (3+ collected)');
            this.flush();
        } else {
            this.checkBatchSize();
        }
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
     * Set up automatic instrumentation (engagement-focused only)
     */
    setupAutomaticInstrumentation() {
        // Track page views (only once per page load)
        this.trackPageView();
        
        // Track navigation (only on actual navigation)
        this.trackNavigation();
        
        // Track meaningful user interactions only
        this.trackEngagementEvents();
        
        // Track essential performance metrics (once only)
        this.trackEssentialPerformance();
        
        // Track essential page load metrics
        this.trackPageLoadMetrics();
    }

    /**
     * Track page view (delayed to prevent immediate spam)
     */
    trackPageView() {
        // Delay page view tracking to prevent immediate spam
        setTimeout(() => {
            if (this.consentGiven) {
                const trace = this.startTrace('page_view', {
                    'page.url': window.location.href,
                    'page.title': document.title,
                    'page.referrer': document.referrer
                });
                
                if (trace) {
                    this.endTrace(trace.traceId, trace.spanId);
                }
            }
        }, 2000); // Wait 2 seconds after page load
    }

    /**
     * Track navigation (only on actual URL changes)
     */
    trackNavigation() {
        // Track navigation changes (only on actual URL changes, not DOM mutations)
        let lastUrl = window.location.href;
        
        // Use popstate for browser back/forward navigation
        window.addEventListener('popstate', () => {
            if (window.location.href !== lastUrl) {
                this.trackPageView();
                lastUrl = window.location.href;
            }
        });
        
        // Use pushstate/replacestate for programmatic navigation
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
        
        window.history.pushState = function(...args) {
            originalPushState.apply(window.history, args);
            if (window.location.href !== lastUrl) {
                setTimeout(() => {
                    if (window.location.href !== lastUrl) {
                        this.trackPageView();
                        lastUrl = window.location.href;
                    }
                }, 100);
            }
        }.bind(this);
        
        window.history.replaceState = function(...args) {
            originalReplaceState.apply(window.history, args);
            if (window.location.href !== lastUrl) {
                setTimeout(() => {
                    if (window.location.href !== lastUrl) {
                        this.trackPageView();
                        lastUrl = window.location.href;
                    }
                }, 100);
            }
        }.bind(this);
    }

    /**
     * Track engagement events only (meaningful interactions)
     */
    trackEngagementEvents() {
        // Track meaningful clicks (buttons, links, forms)
        document.addEventListener('click', (event) => {
            const target = event.target;
            const isEngagement = target.tagName === 'BUTTON' || 
                               target.tagName === 'A' || 
                               target.closest('form') ||
                               target.closest('[role="button"]') ||
                               target.closest('.btn') ||
                               target.closest('button');
            
            if (isEngagement) {
                this.hasUserEngaged = true;
                const trace = this.startTrace('user_engagement', {
                    'element.tag': target.tagName,
                    'element.id': target.id || 'no-id',
                    'element.text': target.textContent?.substring(0, 50) || 'no-text',
                    'engagement.type': 'click'
                });
                
                this.endTrace(trace.traceId, trace.spanId);
            }
        });
        
        // Track form submissions (meaningful engagement)
        document.addEventListener('submit', (event) => {
            this.hasUserEngaged = true;
            const trace = this.startTrace('form_submit', {
                'form.id': event.target.id || 'no-id',
                'form.action': event.target.action || 'no-action'
            });
            
            this.endTrace(trace.traceId, trace.spanId);
        });
        
        // Track scroll depth (only meaningful scroll milestones)
        let maxScrollDepth = 0;
        let scrollTimeout = null;
        
        window.addEventListener('scroll', () => {
            // Only track if user has engaged and throttle heavily
            if (!this.hasUserEngaged || scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollDepth > maxScrollDepth && scrollDepth % 50 === 0) { // Only track at 50%, 100%
                    maxScrollDepth = scrollDepth;
                    this.hasUserEngaged = true; // Mark engagement
                    this.recordMetric('scroll_depth', scrollDepth, {
                        'page.url': window.location.href
                    });
                }
                scrollTimeout = null;
            }, 5000); // Throttle to once every 5 seconds
        });
    }

    /**
     * Track essential performance metrics only (once per page load, delayed)
     */
    trackEssentialPerformance() {
        // Track page load time (once only, delayed)
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (this.consentGiven) {
                    const loadTime = performance.now();
                    this.recordMetric('page_load_time', loadTime, {
                        'page.url': window.location.href
                    });
                }
            }, 3000); // Wait 3 seconds after page load
        });
        
        // Track essential Core Web Vitals (once only, delayed)
        setTimeout(() => {
            if (this.consentGiven) {
                this.trackEssentialWebVitals();
            }
        }, 5000); // Wait 5 seconds after initialization
    }

    /**
     * Collect essential browser/device info immediately on page load
     */
    collectEssentialInfo() {
        if (!this.consentGiven) return;
        
        // Track browser info
        this.recordMetric('browser_name', this.getBrowserName(), {
            'page.url': window.location.href,
            'metric.type': 'browser'
        });
        
        // Track operating system
        this.recordMetric('operating_system', this.getOperatingSystem(), {
            'page.url': window.location.href,
            'metric.type': 'os'
        });
        
        // Track referrer (where user came from)
        this.recordMetric('referrer', document.referrer || 'direct', {
            'page.url': window.location.href,
            'metric.type': 'traffic'
        });
        
        // Track if user has JavaScript enabled (obvious, but good for analytics)
        this.recordMetric('javascript_enabled', true, {
            'page.url': window.location.href,
            'metric.type': 'capability'
        });
    }

    /**
     * Get browser name from user agent
     */
    getBrowserName() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }

    /**
     * Get operating system from user agent
     */
    getOperatingSystem() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    }

    /**
     * Track essential page load metrics (minimal, high-value metrics only)
     */
    trackPageLoadMetrics() {
        if (!this.consentGiven) return;
        
        // Track when page load starts
        const pageLoadStart = Date.now();
        
        // Track DOM Content Loaded (when HTML is fully parsed)
        document.addEventListener('DOMContentLoaded', () => {
            const domLoadTime = Date.now() - pageLoadStart;
            this.recordMetric('dom_content_loaded', domLoadTime, {
                'page.url': window.location.href,
                'metric.type': 'timing'
            });
        });
        
        // Track when page is fully loaded (all resources)
        window.addEventListener('load', () => {
            const fullLoadTime = Date.now() - pageLoadStart;
            this.recordMetric('page_full_load', fullLoadTime, {
                'page.url': window.location.href,
                'metric.type': 'timing'
            });
            
            // Track connection info (if available)
            if (navigator.connection) {
                this.recordMetric('connection_effective_type', navigator.connection.effectiveType, {
                    'page.url': window.location.href,
                    'metric.type': 'connection'
                });
            }
            
            // Track viewport size
            this.recordMetric('viewport_width', window.innerWidth, {
                'page.url': window.location.href,
                'metric.type': 'viewport'
            });
            
            this.recordMetric('viewport_height', window.innerHeight, {
                'page.url': window.location.href,
                'metric.type': 'viewport'
            });
        });
        
        // Track if user is on mobile/desktop
        const isMobile = window.innerWidth <= 768;
        this.recordMetric('device_type', isMobile ? 'mobile' : 'desktop', {
            'page.url': window.location.href,
            'metric.type': 'device'
        });
    }

    /**
     * Track essential Core Web Vitals (once per page load only, engagement-based)
     */
    trackEssentialWebVitals() {
        // Largest Contentful Paint (LCP) - only track once, only if user engaged
        let lcpTracked = false;
        new PerformanceObserver((list) => {
            if (lcpTracked || !this.hasUserEngaged) return;
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.recordMetric('lcp', lastEntry.startTime, {
                'page.url': window.location.href
            });
            lcpTracked = true;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (FID) - only track once, only if user actually interacts
        let fidTracked = false;
        new PerformanceObserver((list) => {
            if (fidTracked || !this.hasUserEngaged) return;
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.recordMetric('fid', entry.processingStart - entry.startTime, {
                    'page.url': window.location.href
                });
                fidTracked = true;
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift (CLS) - only track final value after engagement
        let clsValue = 0;
        let clsFinalValue = 0;
        let clsTimeout = null;
        
        new PerformanceObserver((list) => {
            if (!this.hasUserEngaged) return; // Only track if user has engaged
            
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            // Only track final CLS value after user engagement stops
            clearTimeout(clsTimeout);
            clsTimeout = setTimeout(() => {
                if (clsValue !== clsFinalValue && clsValue > 0) { // Only track if there's actual layout shift
                    clsFinalValue = clsValue;
                    this.recordMetric('cls_final', clsValue, {
                        'page.url': window.location.href
                    });
                }
            }, 15000); // Track final CLS after 15 seconds of no layout shifts
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
        navigator.sendBeacon(`${config.CLOUD_FUNCTIONS_URL}/processOtelData`, blob);
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
     * Flush all telemetry data (engagement-based only)
     */
    async flush() {
        if (!this.consentGiven) {
            console.log('Flush skipped - no consent given');
            return;
        }
        
        // Allow flush if user has engaged OR if we have metrics (page load data)
        if (!this.hasUserEngaged && this.metrics.length === 0) {
            console.log('Flush skipped - no user engagement and no metrics');
            return;
        }
        
        if (this.traces.length === 0 && this.metrics.length === 0 && this.logs.length === 0) {
            console.log('Flush skipped - no data to send');
            return;
        }
        
        console.log(`📤 Flushing data: ${this.traces.length} traces, ${this.metrics.length} metrics, ${this.logs.length} logs`);
        
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
            console.log('Telemetry data flushed successfully (engagement-based)');
        } catch (error) {
            console.error('Failed to send telemetry data:', error);
            // Re-add data to arrays for retry
            this.traces.push(...data.traces);
            this.metrics.push(...data.metrics);
            this.logs.push(...data.logs);
        }
    }

    /**
     * Check if batch size is reached and flush if needed (engagement-based only)
     */
    checkBatchSize() {
        if (!this.consentGiven) return;
        
        const totalItems = this.traces.length + this.metrics.length + this.logs.length;
        const now = Date.now();
        
        // Only flush if:
        // 1. User has actually engaged with the site OR we have metrics (collected on page load)
        // 2. We have enough items OR it's been a long time since last flush
        // 3. Minimum time interval has passed
        const timeSinceLastFlush = now - this.lastFlushTime;
        const hasMetrics = this.metrics.length > 0;
        const shouldFlush = (this.hasUserEngaged || hasMetrics) && 
                           timeSinceLastFlush >= this.minFlushInterval &&
                           (totalItems >= this.batchSize || timeSinceLastFlush >= 300000); // 5 minutes max
        
        if (shouldFlush) {
            this.flush();
        }
    }

    /**
     * Send telemetry data to Cloud Function
     */
    async sendTelemetryData(data) {
        const url = `${config.CLOUD_FUNCTIONS_URL}/processOtelData`;
        console.log('Sending telemetry data:', {
            traces: data.traces.length,
            metrics: data.metrics.length,
            logs: data.logs.length,
            url: url,
            config: config
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Telemetry send failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Telemetry data sent successfully:', result);
        return result;
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

    /**
     * Force flush data for testing (bypasses engagement requirements)
     */
    async forceFlush() {
        console.log('Force flushing telemetry data for testing...');
        this.hasUserEngaged = true; // Mark as engaged
        this.lastFlushTime = 0; // Reset flush time
        await this.flush();
    }

    /**
     * Get current data status for debugging
     */
    getDataStatus() {
        return {
            consentGiven: this.consentGiven,
            hasUserEngaged: this.hasUserEngaged,
            tracesCount: this.traces.length,
            metricsCount: this.metrics.length,
            logsCount: this.logs.length,
            lastFlushTime: this.lastFlushTime,
            timeSinceLastFlush: Date.now() - this.lastFlushTime,
            minFlushInterval: this.minFlushInterval
        };
    }
}

// Create singleton instance
const otelService = new OpenTelemetryService();

export default otelService;

