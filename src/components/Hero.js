import React from 'react';

const Hero = ({ scrollToSection }) => {
    return (
        <section id="home" className="hero-section">
            <div className="hero-background-dots">
                <div className="animate-pulse-slow" style={{ top: 0, left: 0 }}></div>
                <div className="animate-pulse-slow delay-500" style={{ bottom: 0, right: 0 }}></div>
            </div>
            <div className="hero-content">
                <h2 className="hero-title animate-fade-in-up">
                    Hello, I'm <span style={{ color: 'var(--yellow-300)' }}>Sudharsana Rajasekaran</span>
                </h2>
                <p className="hero-subtitle animate-fade-in-up delay-200">
                    A <span style={{ fontWeight: '600' }}>Senior Data Engineer</span> passionate about building scalable data solutions and driving business insights.
                </p>
                <button
                    onClick={() => scrollToSection('experience')}
                    className="hero-button animate-fade-in-up delay-400"
                >
                    View My Projects
                </button>
            </div>
        </section>
    );
};

export default Hero;
