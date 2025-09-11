# Telemetry System Documentation

## Overview

This portfolio website includes a comprehensive telemetry system that tracks user interactions while maintaining CCPA compliance. The system collects anonymous usage data to understand how visitors interact with the portfolio and improve the user experience.

## Features

### ✅ **CCPA Compliant**
- **Consent Management**: Users must explicitly consent before any tracking begins
- **Data Transparency**: Clear disclosure of what data is collected and how it's used
- **User Rights**: Users can opt-out at any time and request data deletion
- **No Personal Data**: No collection of personally identifiable information

### ✅ **Comprehensive Tracking**
- **Page Views**: Automatic tracking of page visits and navigation
- **Click Events**: All button clicks, links, and interactive elements
- **Dropdown Interactions**: Open/close events for experience cards
- **Form Submissions**: Contact form and feedback form submissions
- **Close Button Clicks**: Modal and popup close interactions
- **Navigation**: Section-to-section navigation tracking
- **Scroll Events**: Page scroll depth and section visibility

### ✅ **Unique Identification**
- **User ID**: Persistent UUID stored in localStorage (survives browser sessions)
- **Session ID**: Unique UUID per browser session (stored in sessionStorage)
- **Anonymous**: No personal information linked to these IDs

## Architecture

### Frontend Components

#### 1. **TelemetryService** (`src/services/telemetry.js`)
- Core telemetry service with event tracking capabilities
- Automatic user/session ID generation and management
- Batch processing and offline support
- CCPA-compliant consent management

#### 2. **TelemetryConsent** (`src/components/TelemetryConsent.js`)
- CCPA-compliant consent banner
- Detailed privacy information
- User preference management
- Beautiful, responsive design

#### 3. **Integration Points**
- **App.js**: Page view tracking and navigation
- **Experience.js**: Dropdown interaction tracking
- **ContactForm.js**: Form submission tracking
- **FloatingFeedback.js**: Button clicks and close events

### Backend Infrastructure

#### 1. **Cloud Function** (`functions/index.js`)
- **trackTelemetry**: HTTP endpoint for receiving telemetry data
- Data validation and sanitization
- Firestore storage with batch operations
- Session metadata tracking

#### 2. **Firestore Collections**
- **telemetry**: Individual event records
- **telemetry_sessions**: Session metadata and statistics

## Data Collection

### What We Collect
- **Interaction Events**: Clicks, form submissions, dropdown interactions
- **Navigation Data**: Page views, section transitions, scroll depth
- **Technical Data**: Browser info, screen resolution, timezone, language
- **Context Data**: Element types, form field counts, interaction context

### What We DON'T Collect
- **Personal Information**: Names, emails, addresses, phone numbers
- **Sensitive Data**: Passwords, credit card info, social security numbers
- **Location Data**: IP addresses, GPS coordinates, precise location
- **Biometric Data**: Fingerprints, face recognition, voice data

### Data Storage
- **Firestore**: Secure cloud database with automatic backups
- **Retention**: Data retained for analytics purposes (configurable)
- **Access**: Only authorized personnel can access telemetry data
- **Encryption**: All data encrypted in transit and at rest

## CCPA Compliance

### User Rights
1. **Right to Know**: Users are informed about data collection practices
2. **Right to Delete**: Users can request deletion of their data
3. **Right to Opt-Out**: Users can withdraw consent at any time
4. **Right to Non-Discrimination**: No penalties for opting out

### Implementation
- **Consent Banner**: Appears on first visit, requires explicit action
- **Granular Control**: Users can accept or decline analytics
- **Persistent Choice**: User preference remembered across sessions
- **Easy Access**: Consent can be changed at any time

## Usage Analytics

### Event Types Tracked
```javascript
// Page and Navigation
- page_view: Initial page load
- navigation: Section-to-section movement
- scroll: Scroll depth and section visibility

// User Interactions
- click: Button clicks, link clicks, element interactions
- dropdown: Experience card open/close events
- form_submit: Contact and feedback form submissions
- close: Modal and popup close events

// System Events
- consent_accepted: User accepts analytics
- consent_declined: User declines analytics
- visibility_change: Tab focus/blur events
```

### Data Structure
```javascript
{
  id: "unique-event-id",
  userId: "persistent-user-uuid",
  sessionId: "session-uuid",
  eventType: "click|dropdown|form_submit|...",
  timestamp: "2025-09-11T09:30:00.000Z",
  url: "https://sudharsana.dev/",
  userAgent: "Mozilla/5.0...",
  screenResolution: "1920x1080",
  viewportSize: "1200x800",
  timezone: "America/Los_Angeles",
  language: "en-US",
  // Event-specific data
  elementType: "button",
  elementId: "contact-form-submit",
  elementClass: "btn-primary",
  elementText: "Send Message",
  // Additional context
  clickPosition: "150,200",
  formType: "contact",
  // Metadata
  ip: "anonymized-ip",
  receivedAt: "server-timestamp"
}
```

## Configuration

### Environment Variables
```javascript
// Frontend
REACT_APP_GCP_PROJECT_ID=sudhanportfoliowebsite
REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-sudhanportfoliowebsite.cloudfunctions.net

// Cloud Function
GCP_PROJECT=sudhanportfoliowebsite
```

### Telemetry Settings
```javascript
// Configurable parameters
batchSize: 10,           // Events per batch
flushInterval: 30000,    // 30 seconds
maxQueueSize: 100,       // Prevent memory issues
consentRequired: true,   // CCPA compliance
```

## Privacy by Design

### Data Minimization
- Only collect data necessary for analytics
- No personal information stored
- Automatic data sanitization
- Limited text field lengths

### Security Measures
- HTTPS encryption for all data transmission
- Firestore security rules
- No client-side data persistence beyond consent
- Regular security audits

### Transparency
- Clear privacy policy
- Detailed consent information
- User control over data
- Regular privacy reviews

## Monitoring and Analytics

### Firestore Queries
```javascript
// Recent events
db.collection('telemetry')
  .orderBy('timestamp', 'desc')
  .limit(100)

// User journey
db.collection('telemetry')
  .where('userId', '==', 'user-uuid')
  .orderBy('timestamp', 'asc')

// Popular interactions
db.collection('telemetry')
  .where('eventType', '==', 'click')
  .orderBy('timestamp', 'desc')
```

### Key Metrics
- **Page Views**: Total and unique visitors
- **Engagement**: Time on site, scroll depth
- **Interactions**: Most clicked elements, form completion rates
- **Navigation**: Popular sections, user flow patterns
- **Technical**: Browser/device statistics, performance metrics

## Deployment

### Frontend
- Telemetry system automatically initializes on page load
- Consent banner appears for new users
- Events tracked and batched for efficient transmission

### Backend
- Cloud Function deployed and accessible
- Firestore collections created automatically
- Rate limiting and error handling included

### Monitoring
- Cloud Function logs for debugging
- Firestore metrics for data volume
- Error tracking and alerting

## Future Enhancements

### Planned Features
- **Heatmaps**: Visual representation of user interactions
- **A/B Testing**: Framework for testing different layouts
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: JavaScript error collection
- **User Segmentation**: Anonymous user behavior analysis

### Privacy Improvements
- **Data Anonymization**: Enhanced privacy protection
- **Retention Policies**: Automatic data cleanup
- **Audit Logs**: Track data access and modifications
- **Privacy Dashboard**: User control panel

## Support and Maintenance

### Regular Tasks
- Monitor data collection accuracy
- Review privacy compliance
- Update consent language as needed
- Analyze user behavior patterns
- Optimize performance and costs

### Troubleshooting
- Check browser console for telemetry errors
- Verify Cloud Function deployment
- Review Firestore security rules
- Monitor consent banner functionality

## Contact

For questions about the telemetry system or privacy practices, please contact the site administrator through the contact form.

---

**Last Updated**: September 11, 2025  
**Version**: 1.0.0  
**Compliance**: CCPA, GDPR-ready
