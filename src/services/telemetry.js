import { v4 as uuidv4 } from 'uuid';
import { getEnvConfig } from '../utils/env';

class TelemetryService {
    constructor() {
        this.userId = this.getOrCreateUserId();
        this.sessionId = this.getOrCreateSessionId();
        this.consentGiven = this.getConsentStatus();
        this.eventQueue = [];
        this.isOnline = navigator.onLine;
        this.batchSize = 10;
        this.flushInterval = 30000; // 30 seconds
        
        // Initialize event listeners
        this.initializeEventListeners();
        this.startBatchFlush();
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.flushEvents();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Generate or retrieve user ID (persistent across sessions)
    getOrCreateUserId() {
        let userId = localStorage.getItem('telemetry_user_id');
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem('telemetry_user_id', userId);
        }
        return userId;
    }

    // Generate or retrieve session ID (new for each browser session)
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('telemetry_session_id');
        if (!sessionId) {
            sessionId = uuidv4();
            sessionStorage.setItem('telemetry_session_id', sessionId);
        }
        return sessionId;
    }

    // CCPA-compliant consent management
    getConsentStatus() {
        const consent = localStorage.getItem('telemetry_consent');
        return consent === 'true';
    }

    setConsentStatus(consent) {
        localStorage.setItem('telemetry_consent', consent.toString());
        this.consentGiven = consent;
        
        if (consent) {
            this.flushEvents(); // Send queued events if consent is given
        } else {
            this.clearStoredData(); // Clear data if consent is withdrawn
        }
    }

    // Clear all stored telemetry data (CCPA compliance)
    clearStoredData() {
        this.eventQueue = [];
        // Note: We keep userId and sessionId for legitimate business purposes
        // but clear event data when consent is withdrawn
    }

    // Track user interaction events
    trackEvent(eventType, eventData = {}) {
        if (!this.consentGiven) {
            return; // Don't track if no consent
        }

        const event = {
            id: uuidv4(),
            userId: this.userId,
            sessionId: this.sessionId,
            eventType,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            ...eventData
        };

        this.eventQueue.push(event);

        // Flush immediately if batch size reached
        if (this.eventQueue.length >= this.batchSize) {
            this.flushEvents();
        }
    }

    // Track clicks on interactive elements
    trackClick(element, additionalData = {}) {
        const eventData = {
            elementType: element.tagName.toLowerCase(),
            elementId: element.id || null,
            elementClass: element.className || null,
            elementText: element.textContent?.trim().substring(0, 100) || null,
            elementHref: element.href || null,
            clickPosition: this.getClickPosition(),
            ...additionalData
        };

        this.trackEvent('click', eventData);
    }

    // Track dropdown interactions
    trackDropdown(action, element, additionalData = {}) {
        const eventData = {
            action, // 'open', 'close', 'select'
            elementType: element.tagName.toLowerCase(),
            elementId: element.id || null,
            elementClass: element.className || null,
            selectedValue: element.value || null,
            selectedText: element.selectedOptions?.[0]?.text || null,
            ...additionalData
        };

        this.trackEvent('dropdown', eventData);
    }

    // Track form submissions
    trackFormSubmit(form, additionalData = {}) {
        const formData = this.extractFormData(form);
        const eventData = {
            formId: form.id || null,
            formClass: form.className || null,
            formAction: form.action || null,
            formMethod: form.method || 'get',
            fieldCount: form.elements.length,
            hasFileUpload: Array.from(form.elements).some(el => el.type === 'file'),
            ...formData,
            ...additionalData
        };

        this.trackEvent('form_submit', eventData);
    }

    // Track close button clicks
    trackClose(element, additionalData = {}) {
        const eventData = {
            elementType: element.tagName.toLowerCase(),
            elementId: element.id || null,
            elementClass: element.className || null,
            closeContext: this.getCloseContext(element),
            ...additionalData
        };

        this.trackEvent('close', eventData);
    }

    // Track page views
    trackPageView() {
        const eventData = {
            referrer: document.referrer || null,
            pageTitle: document.title,
            pageLoadTime: performance.timing ? 
                performance.timing.loadEventEnd - performance.timing.navigationStart : null
        };

        this.trackEvent('page_view', eventData);
    }

    // Helper methods
    getClickPosition() {
        // This would be populated by the click event handler
        return null; // Will be set by the event listener
    }

    getCloseContext(element) {
        // Determine what's being closed
        if (element.closest('.modal')) return 'modal';
        if (element.closest('.dropdown')) return 'dropdown';
        if (element.closest('.popup')) return 'popup';
        if (element.closest('.notification')) return 'notification';
        return 'unknown';
    }

    extractFormData(form) {
        const data = {};
        const formData = new FormData(form);
        
        // Extract non-sensitive form data (avoid passwords, etc.)
        for (let [key, value] of formData.entries()) {
            if (key.toLowerCase().includes('password') || 
                key.toLowerCase().includes('secret') ||
                key.toLowerCase().includes('token')) {
                data[key] = '[REDACTED]';
            } else {
                data[key] = value.toString().substring(0, 100); // Limit length
            }
        }
        
        return data;
    }

    // Initialize event listeners for automatic tracking
    initializeEventListeners() {
        // Track clicks
        document.addEventListener('click', (event) => {
            if (this.consentGiven) {
                const element = event.target;
                const clickData = {
                    clickX: event.clientX,
                    clickY: event.clientY,
                    clickPosition: `${event.clientX},${event.clientY}`
                };
                this.trackClick(element, clickData);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            if (this.consentGiven) {
                this.trackFormSubmit(event.target);
            }
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (this.consentGiven) {
                this.trackEvent('visibility_change', {
                    hidden: document.hidden,
                    visibilityState: document.visibilityState
                });
            }
        });
    }

    // Batch flush events to server
    startBatchFlush() {
        setInterval(() => {
            if (this.consentGiven && this.isOnline) {
                this.flushEvents();
            }
        }, this.flushInterval);
    }

    // Send events to server
    async flushEvents() {
        if (this.eventQueue.length === 0 || !this.isOnline) {
            return;
        }

        const eventsToSend = [...this.eventQueue];
        this.eventQueue = [];

        try {
            const config = getEnvConfig();
            const response = await fetch(`${config.REACT_APP_CLOUD_FUNCTIONS_URL}/trackTelemetry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    events: eventsToSend,
                    userId: this.userId,
                    sessionId: this.sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`Telemetry: Sent ${eventsToSend.length} events successfully`);
        } catch (error) {
            console.error('Telemetry: Failed to send events:', error);
            // Re-queue events for retry (limit to prevent memory issues)
            this.eventQueue = [...eventsToSend, ...this.eventQueue].slice(0, 100);
        }
    }

    // Manual event tracking methods for specific use cases
    trackButtonClick(buttonText, buttonContext = '') {
        this.trackEvent('button_click', {
            buttonText: buttonText.substring(0, 50),
            buttonContext
        });
    }

    trackNavigation(fromSection, toSection) {
        this.trackEvent('navigation', {
            fromSection,
            toSection
        });
    }

    trackScroll(depth, section) {
        this.trackEvent('scroll', {
            scrollDepth: depth,
            section
        });
    }

    trackHover(element, duration) {
        this.trackEvent('hover', {
            elementType: element.tagName.toLowerCase(),
            elementId: element.id || null,
            elementClass: element.className || null,
            hoverDuration: duration
        });
    }

    // Get telemetry status for debugging
    getStatus() {
        return {
            userId: this.userId,
            sessionId: this.sessionId,
            consentGiven: this.consentGiven,
            queuedEvents: this.eventQueue.length,
            isOnline: this.isOnline
        };
    }
}

// Create singleton instance
const telemetryService = new TelemetryService();

export default telemetryService;
