import React, { useState, useEffect } from 'react';

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

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
