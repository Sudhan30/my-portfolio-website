import React from 'react';
import myProfPhoto from '../myProfPhoto.png';

const Hero = ({ scrollToSection }) => {
    return (
        <section id="home" className="hero-section">
            <div className="hero-background-pattern"></div>
            <div className="hero-content">
                <img src={myProfPhoto} alt="Sudharsana Rajasekaran" className="hero-avatar" />
                <h2 className="hero-title animate-fade-in-up">
                    Hello, I'm <span style={{ color: 'var(--accent-orange-400)' }}>Sudharsana Rajasekaran</span>
                </h2>
                <p className="hero-subtitle animate-fade-in-up delay-200">
                    A <span style={{ fontWeight: '600' }}>Data Engineer</span> passionate about building scalable data solutions and driving business insights.
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
