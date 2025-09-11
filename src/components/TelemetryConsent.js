import React, { useState, useEffect } from 'react';
import { X, Shield, Eye, Database, Settings } from 'lucide-react';
import telemetryService from '../services/telemetry';
import './TelemetryConsent.css';

const TelemetryConsent = () => {
    const [showBanner, setShowBanner] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [, setConsentGiven] = useState(false);

    useEffect(() => {
        // Check if user has already made a consent decision
        const hasConsentDecision = localStorage.getItem('telemetry_consent_decision_made');
        const consent = telemetryService.getConsentStatus();
        
        setConsentGiven(consent);
        
        // Show banner if no decision has been made
        if (!hasConsentDecision) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        telemetryService.setConsentStatus(true);
        setConsentGiven(true);
        setShowBanner(false);
        localStorage.setItem('telemetry_consent_decision_made', 'true');
        
        // Track the consent acceptance
        telemetryService.trackEvent('consent_accepted', {
            consentType: 'telemetry',
            timestamp: new Date().toISOString()
        });
    };

    const handleDecline = () => {
        telemetryService.setConsentStatus(false);
        setConsentGiven(false);
        setShowBanner(false);
        localStorage.setItem('telemetry_consent_decision_made', 'true');
        
        // Track the consent decline (this is the last event we'll track)
        telemetryService.trackEvent('consent_declined', {
            consentType: 'telemetry',
            timestamp: new Date().toISOString()
        });
    };

    const handleManageSettings = () => {
        setShowDetails(!showDetails);
    };

    const handleCloseBanner = () => {
        setShowBanner(false);
        // Don't set decision as made - user can still see banner later
    };

    if (!showBanner) {
        return null;
    }

    return (
        <div className="telemetry-consent-overlay">
            <div className="telemetry-consent-banner">
                <div className="consent-header">
                    <div className="consent-icon">
                        <Shield size={24} />
                    </div>
                    <div className="consent-title">
                        <h3>Privacy & Analytics</h3>
                        <p>We use analytics to improve your experience</p>
                    </div>
                    <button 
                        className="consent-close"
                        onClick={handleCloseBanner}
                        aria-label="Close consent banner"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="consent-content">
                    <p>
                        We collect anonymous usage data to understand how visitors interact with our portfolio. 
                        This helps us improve the user experience and identify areas for enhancement.
                    </p>

                    {showDetails && (
                        <div className="consent-details">
                            <h4>What we collect:</h4>
                            <ul>
                                <li>
                                    <Eye size={16} />
                                    <span>Page views and navigation patterns</span>
                                </li>
                                <li>
                                    <Database size={16} />
                                    <span>Button clicks and form interactions</span>
                                </li>
                                <li>
                                    <Settings size={16} />
                                    <span>Device and browser information</span>
                                </li>
                            </ul>
                            
                            <h4>What we don't collect:</h4>
                            <ul>
                                <li>Personal information (name, email, etc.)</li>
                                <li>Passwords or sensitive data</li>
                                <li>IP addresses or location data</li>
                                <li>Data that can identify you personally</li>
                            </ul>

                            <h4>Your rights (CCPA compliant):</h4>
                            <ul>
                                <li>Right to know what data is collected</li>
                                <li>Right to delete your data</li>
                                <li>Right to opt-out at any time</li>
                                <li>Right to non-discrimination</li>
                            </ul>
                        </div>
                    )}

                    <div className="consent-actions">
                        <button 
                            className="consent-button consent-accept"
                            onClick={handleAccept}
                        >
                            Accept Analytics
                        </button>
                        <button 
                            className="consent-button consent-decline"
                            onClick={handleDecline}
                        >
                            Decline
                        </button>
                        <button 
                            className="consent-button consent-details"
                            onClick={handleManageSettings}
                        >
                            {showDetails ? 'Hide Details' : 'Learn More'}
                        </button>
                    </div>
                </div>

                <div className="consent-footer">
                    <p>
                        By using this site, you agree to our privacy practices. 
                        You can change your preferences at any time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TelemetryConsent;
