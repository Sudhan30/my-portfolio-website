import React from 'react';
import { User } from 'lucide-react';

const Header = ({ scrollToSection, activeSection }) => {
    return (
        <header className="header">
            <div className="header-left">
                <User style={{ color: 'var(--purple-600)' }} size={28} />
                <h1 className="header-title">Sudharsana Rajasekaran</h1>
            </div>
            <nav className="header-nav">
                {['home', 'about', 'skills', 'experience', 'contact', 'interest'].map((section) => (
                    <button
                        key={section}
                        onClick={() => scrollToSection(section)}
                        className={`header-nav-button ${activeSection === section ? 'active' : ''}`}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}
            </nav>
            {/* Mobile Menu Button - Add a proper mobile menu if needed */}
            <div className="mobile-menu-button-wrapper">
                <button className="mobile-menu-button">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;
