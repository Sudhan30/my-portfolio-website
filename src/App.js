import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import Swal from 'sweetalert2';

import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import InterestSection from './components/InterestSection';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('home');
    const [viewCount, setViewCount] = useState(0);
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
                // In a production environment, this should be replaced with the actual cloud function URL,
                // ideally using environment variables.
                const response = await fetch('https://us-central1-sudhanportfoliowebsite.cloudfunctions.net/pageView', { method: 'POST' });
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
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (specialMessage) {
            Swal.fire({
                title: 'Special Visit!',
                text: specialMessage,
                icon: 'success',
                confirmButtonText: 'Awesome!'
            });
            setShowConfetti(true);
            const confettiTimer = setTimeout(() => {
                setShowConfetti(false);
            }, 10000); // Confetti lasts for 10 seconds
            return () => clearTimeout(confettiTimer);
        }
    }, [specialMessage]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
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
                <InterestSection />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default App;
