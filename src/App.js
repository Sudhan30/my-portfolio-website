import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import Swal from 'sweetalert2';

import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import JobFitEvaluator from './components/JobFitEvaluator';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingFeedback from './components/FloatingFeedback';
import TelemetryConsent from './components/TelemetryConsent';
import otelService from './services/opentelemetry';
import { config } from './utils/env';

const App = () => {
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('home');
    // const [viewCount, setViewCount] = useState(0); // Unused for now
    const [specialMessage, setSpecialMessage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        const fetchViewCount = async () => {
            try {
                // The URL for the pageView function.
                // For local development, this points to the Firebase emulator.
                // Use environment configuration for Cloud Functions URL
                const response = await fetch(config.pageViewUrl, { method: 'POST' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // setViewCount(data.count);
                if (data.message) {
                    setSpecialMessage(data.message);
                }
            } catch (error) {
                console.error("Could not fetch page view count:", error);
            }
        };

        fetchViewCount();

        // Don't initialize OpenTelemetry here - let TelemetryConsent handle it
        // otelService.initialize();

        return () => clearTimeout(timer);
    }, []);

    // Add scroll detection to update activeSection
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'skills', 'experience', 'ai-job-fit', 'contact'];
            const scrollPosition = window.scrollY + 100; // Offset for header height

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(sections[i]);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (specialMessage) {
            Swal.fire({
                title: 'Welcome!',
                html: `
                    <div style="text-align: center; padding: 1rem 0;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
                        <p style="color: #374151; font-size: 1.1rem; line-height: 1.6; margin: 0; font-weight: 500;">
                            ${specialMessage}
                        </p>
                    </div>
                `,
                width: '420px',
                padding: '2.5rem',
                background: '#ffffff',
                color: '#1f2937',
                backdrop: false,
                allowOutsideClick: true,
                allowEscapeKey: true,
                showConfirmButton: true,
                confirmButtonText: 'Continue',
                confirmButtonColor: '#fb923c', // accent-orange-400
                customClass: {
                    popup: 'swal-light-popup',
                    confirmButton: 'swal-light-button',
                    title: 'swal-light-title',
                    closeButton: 'swal-light-close'
                },
                buttonsStyling: false,
                showCloseButton: true,
                closeButtonHtml: `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `
            });
            setShowConfetti(true);
            const confettiTimer = setTimeout(() => {
                setShowConfetti(false);
            }, 8000); // Confetti lasts for 8 seconds
            return () => clearTimeout(confettiTimer);
        }
    }, [specialMessage]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);

            // Track navigation
            otelService.trackNavigationCompat(activeSection, id);
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="app-container">
            {showConfetti && <ReactConfetti />}
            <Header scrollToSection={scrollToSection} activeSection={activeSection} />
            <main className="main-content">
                <Hero scrollToSection={scrollToSection} />
                <About />
                <Skills />
                <Experience />
                <section id="ai-job-fit" className="section-padding" style={{ backgroundColor: 'var(--neutral-50)' }}>
                    <JobFitEvaluator />
                </section>
                <Contact />
            </main>
            <Footer />
            <FloatingFeedback />
            <TelemetryConsent />
        </div>
    );
};

export default App;
