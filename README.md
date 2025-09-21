# Personal Portfolio Website

A modern, responsive portfolio website showcasing professional experience, skills, and projects. Built with React and deployed on Google Cloud Platform with comprehensive email notifications and analytics.

## 🌟 Live Website
**https://www.sudharsana.dev**

## Technologies Used

### Frontend
*   **React.js 18:** Modern JavaScript library for building user interfaces
*   **CSS3:** Custom responsive styling with mobile-first design
*   **Lucide React:** Beautiful and consistent icon library
*   **SweetAlert2:** Elegant alerts and notifications
*   **React Confetti:** Celebratory effects for special interactions
*   **UUID:** Unique identifier generation for telemetry

### Backend & Infrastructure
*   **Google Cloud Functions (Node.js 20 Gen 2):** Serverless backend functions with dedicated service account
*   **Firebase Firestore:** NoSQL document database
*   **Google Secret Manager:** Secure credential storage
*   **Nodemailer:** Email delivery system
*   **CORS:** Cross-origin resource sharing
*   **Rate Limiting:** API abuse prevention
*   **OpenTelemetry:** Industry-standard observability and monitoring pipeline
*   **BigQuery:** Data warehouse for analytics and telemetry storage
*   **Cloud Storage:** Long-term data archival
*   **Pub/Sub:** Message queuing for telemetry data processing
*   **Dedicated Service Account:** Principle of least privilege security model

### Deployment & DevOps
*   **Google Cloud Platform:** Complete cloud infrastructure
*   **Firebase Hosting:** Static website hosting with CDN
*   **GitHub Actions:** Automated CI/CD pipeline
*   **Cloudflare:** DNS and security proxy

## ✨ Features

### Core Functionality
*   **Responsive Single-Page Application:** Seamless navigation with smooth scrolling
*   **Professional Portfolio Sections:** Hero, About, Skills, Experience, Contact
*   **Interactive UI Elements:** Animated components and hover effects
*   **Mobile-First Design:** Optimized for all device sizes

### Contact & Communication
*   **Contact Form:** "Get in Touch" form with email notifications
*   **Floating Feedback Button:** Star-rated feedback system with email alerts
*   **Email Notifications:** Automatic emails to multiple recipients
*   **Rate Limiting:** Protection against spam and abuse

### Analytics & Tracking
*   **OpenTelemetry System:** Industry-standard comprehensive observability with traces, metrics, and logs
*   **Page View Counter:** Dynamic visitor tracking with special milestone messages
*   **User Interaction Tracking:** CCPA-compliant tracking of clicks, navigation, form submissions
*   **Privacy-First Analytics:** Optional consent-based data collection with user control
*   **BigQuery Integration:** Advanced analytics and data warehousing for insights
*   **Performance Monitoring:** Core Web Vitals, page load times, and custom metrics
*   **Session Management:** Unique user and session identification with smart batching
*   **Consolidated Metrics:** Efficient batching of telemetry data for optimal performance
*   **Real-time Processing:** Pub/Sub-based data pipeline for immediate analytics

### Job Analysis Tool
*   **Job Description Analyzer:** AI-powered job matching system
*   **Resume Integration:** Personalized analysis based on professional profile
*   **Interest Scoring:** Intelligent matching with qualification reasons
*   **Firestore Storage:** Secure job description storage

### SEO & Performance
*   **SEO Optimized:** Meta tags, structured data, sitemap
*   **Fast Loading:** CDN-accelerated static hosting
*   **Security Headers:** CSP, security best practices
*   **Accessibility:** WCAG compliant design

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[React App]
        B[OpenTelemetry Service]
        C[Contact Form]
        D[Feedback Form]
        E[Job Analyzer]
        F[Privacy Consent]
    end

    subgraph "Firebase Hosting"
        G[Firebase CDN]
        H[Static Assets]
    end

    subgraph "Google Cloud Platform"
        subgraph "Cloud Functions (Node.js 20 Gen 2)"
            I[Page View Tracker]
            J[Contact Form Handler]
            K[Feedback Handler]
            L[Job Analyzer]
            M[OpenTelemetry Processor]
            N[Telemetry Batch Processor]
        end
        
        O[Firestore Database]
        P[Secret Manager]
        Q[BigQuery Data Warehouse]
        R[Cloud Storage]
        S[Pub/Sub Messaging]
        T[SMTP Service]
    end

    subgraph "External Services"
        U[Cloudflare DNS]
        V[GitHub Actions]
        W[Email Recipients]
    end

    A --> G
    F --> B
    B --> M
    C --> J
    D --> K
    E --> L
    
    G --> H
    U --> G
    
    J --> O
    J --> P
    J --> T
    K --> O
    K --> P
    K --> T
    L --> O
    M --> Q
    M --> S
    N --> Q
    S --> R
    
    T --> W
    V --> G
```

## 🔄 User Interaction Flow

```mermaid
graph TD
    A[User visits website] --> B[Privacy Consent Banner]
    B --> C{User accepts/declines}
    C --> D[Page loads with telemetry]
    C --> E[Page loads without tracking]
    
    D --> F[Special visit check]
    E --> F
    F --> G{Is milestone visit?}
    G -- "Yes" --> H[Show confetti + special message]
    G -- "No" --> I[Regular welcome]
    
    H --> J[User explores sections]
    I --> J
    
    J --> K{User action}
    K -- "Contact Form" --> L[Submit contact form]
    K -- "Feedback" --> M[Submit feedback with rating]
    K -- "Job Analysis" --> N[Analyze job description]
    K -- "Navigation" --> O[Track navigation]
    
    L --> P[Email notification sent]
    M --> Q[Email notification sent]
    N --> R[Analysis stored in Firestore]
    O --> S[Telemetry data collected]
    
    P --> T[Success message]
    Q --> T
    R --> T
    S --> T
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+ and npm
- Google Cloud SDK (for backend functions)
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sudhan30/my-portfolio-website.git
   cd my-portfolio-website
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   Create `.env.local` file in the root directory:
   ```bash
   REACT_APP_GCP_PROJECT_ID=your-project-id
   REACT_APP_CLOUD_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

### Backend Development
For local backend testing, use the Firebase emulator suite:
```bash
npm install -g firebase-tools
firebase init
firebase emulators:start
```

## 🚀 Deployment

### Frontend Deployment
Automated deployment via GitHub Actions on push to `main` branch:

1. **Build Process:** React app built for production
2. **Environment Injection:** Dynamic environment variables injected
3. **Firebase Hosting:** Static files deployed to Firebase Hosting
4. **CDN Acceleration:** Global CDN for fast content delivery
5. **Security Headers:** CSP and security headers applied
6. **Custom Domain:** Automatic SSL certificate management

### Backend Deployment
Deploy Cloud Functions using Firebase CLI:

```bash
# Deploy all functions (Node.js 20 Gen 2)
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:pageView
firebase deploy --only functions:submitContactForm
firebase deploy --only functions:processOtelData
```

**Security Note:** All functions use a dedicated service account (`portfolio-functions-sa`) with minimal permissions following the principle of least privilege.

## 🔧 Backend Architecture

### Cloud Functions

| Function | Purpose | Features |
|----------|---------|----------|
| `pageView` | Track website visits | Milestone messages, rate limiting |
| `submitFeedback` | Handle feedback submissions | Email notifications, Firestore storage |
| `submitContactForm` | Process contact form | Email notifications, validation |
| `analyzeJobDescription` | AI job analysis | Resume matching, scoring system |
| `trackTelemetry` | User interaction tracking | CCPA compliance, batched events |
| `processOtelData` | OpenTelemetry data processing | BigQuery storage, real-time analytics |
| `processOtelDataBatch` | Batch telemetry processing | Efficient data batching, Pub/Sub integration |

### Security Features
- **Dedicated Service Account:** Principle of least privilege with minimal permissions
- **Rate Limiting:** Prevents API abuse
- **Secret Manager:** Secure credential storage
- **CORS Protection:** Cross-origin security
- **Input Validation:** Sanitized user inputs
- **Email Security:** SMTP with authentication
- **Node.js 20 Gen 2:** Latest runtime with enhanced security

### Database Collections
- `pageViews`: Visitor counter and milestones
- `feedbackCollect`: User feedback submissions
- `contactSubmissions`: Contact form data
- `jobAnalyses`: Job description analyses
- `telemetry`: User interaction events
- `telemetry_sessions`: Session metadata

### BigQuery Tables
- `otel_data.traces`: OpenTelemetry trace data
- `otel_data.metrics`: Performance and engagement metrics
- `otel_data.logs`: Application logs and events
- `otel_data.consolidated_metrics`: Batched telemetry data

## 📧 Email System

### Configuration
- **SMTP Provider:** Configurable email service
- **Sender:** Configurable sender email
- **Recipients:** Configurable primary and CC recipients

### Email Types
1. **Contact Form:** Professional inquiry notifications
2. **Feedback:** Star-rated feedback with detailed formatting
3. **Security:** All credentials stored in Google Secret Manager

## 📊 OpenTelemetry System

### Industry-Standard Observability
The portfolio website implements a comprehensive OpenTelemetry system for monitoring, analytics, and performance tracking:

#### **Data Collection**
- **Traces:** User session tracking with unique trace IDs
- **Metrics:** Performance metrics, engagement tracking, and custom KPIs
- **Logs:** Application events and error tracking
- **Consolidated Metrics:** Efficient batching for optimal performance

#### **Privacy & Compliance**
- **CCPA Compliant:** Optional consent-based tracking
- **Privacy-First:** No PII collection, anonymized data
- **User Control:** Easy opt-out mechanism with consent banner
- **Data Minimization:** Only essential data collected

#### **Data Pipeline**
- **Real-time Processing:** Pub/Sub-based data pipeline
- **BigQuery Storage:** Data warehouse for analytics and insights
- **Session Management:** Unique user and session IDs
- **Performance Monitoring:** Core Web Vitals and custom metrics

#### **Technical Implementation**
- **Frontend SDK:** Custom OpenTelemetry service for React
- **Cloud Functions:** Node.js 20 Gen 2 processors
- **Dedicated Service Account:** Principle of least privilege
- **Batch Processing:** Efficient data batching and consolidation

### Privacy Features
- **Consent Banner:** Clear privacy options with CCPA compliance
- **Data Minimization:** Only essential data collected
- **User Control:** Easy opt-out mechanism
- **Transparency:** Clear data usage policies

## 🛠️ Configuration Files

### Environment Setup
- `.env.local`: Local development variables
- `functions/config.js`: Backend configuration
- `functions/config.example.js`: Configuration template

### Documentation
- `EMAIL_SETUP.md`: Email system setup guide
- `ENVIRONMENT_SETUP.md`: Environment configuration
- `GITHUB_ACTIONS_DEPLOYMENT.md`: CI/CD documentation
- `TELEMETRY_SYSTEM.md`: Analytics system details
- `HERO_IMAGE_SETUP.md`: Image configuration guide

## 🔒 Security

### Implemented Security Measures
- **Dedicated Service Account:** Principle of least privilege with minimal IAM permissions
- **Content Security Policy (CSP):** XSS protection
- **Rate Limiting:** API abuse prevention
- **Input Validation:** Sanitized user inputs
- **Secret Management:** Encrypted credential storage
- **CORS Protection:** Cross-origin security
- **HTTPS Only:** Secure data transmission
- **Node.js 20 Gen 2:** Latest runtime with enhanced security features

### Compliance
- **CCPA:** California Consumer Privacy Act compliance
- **GDPR Ready:** European privacy regulation support
- **Security Headers:** Modern web security standards

## 📈 Performance

### Optimization Features
- **CDN Acceleration:** Global content delivery
- **Static Hosting:** Fast loading times
- **Image Optimization:** Compressed and responsive images
- **Code Splitting:** Efficient bundle loading
- **Caching Strategy:** Optimized cache headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Portfolio Owner** - Data Engineer
- Website: [www.sudharsana.dev](https://www.sudharsana.dev)
- LinkedIn: [linkedin.com/in/sudhan-raj](https://linkedin.com/in/sudhan-raj)
- Contact: Available through website contact form

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Google Cloud Platform for robust infrastructure
- Lucide React for beautiful icons
- All contributors and testers
