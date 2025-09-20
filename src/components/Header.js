import React, { useState, useEffect } from 'react';
import { User, Menu, X } from 'lucide-react';

const Header = ({ scrollToSection, activeSection }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Determine header theme based on active section
    // Light sections (light background) need dark header
    // Dark sections (dark background) need light header
    const lightSections = ['skills', 'experience', 'job-analyzer', 'contact'];
    const isLightSection = lightSections.includes(activeSection);
    const headerClass = isLightSection ? 'header header-dark' : 'header header-light';
    
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    const handleMobileNavClick = (section) => {
        scrollToSection(section);
        setIsMobileMenuOpen(false);
    };
    
    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu-overlay') && !event.target.closest('.mobile-menu-button')) {
                setIsMobileMenuOpen(false);
            }
        };
        
        if (isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isMobileMenuOpen]);
    
    return (
        <header className={headerClass}>
            <div className="header-left">
                <User 
                    style={{ 
                        color: isLightSection ? 'var(--accent-orange-400)' : 'var(--accent-orange-400)' 
                    }} 
                    size={28} 
                />
                <h1 className="header-title">Sudharsana Rajasekaran</h1>
            </div>
            <div className="header-right">
                <nav className="header-nav">
                    {['home', 'about', 'skills', 'experience', 'job-analyzer', 'contact'].map((section) => (
                        <button
                            key={section}
                            onClick={() => scrollToSection(section)}
                            className={`header-nav-button ${activeSection === section ? 'active' : ''}`}
                        >
                            {section === 'job-analyzer' ? 'Job Matcher' : section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </nav>
                {/* Mobile Menu Button */}
                <div className="mobile-menu-button-wrapper">
                    <button 
                        className="mobile-menu-button"
                        onClick={handleMobileMenuToggle}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                        <div className="mobile-menu-overlay">
                            <nav className="mobile-menu-nav">
                                {['home', 'about', 'skills', 'experience', 'job-analyzer', 'contact'].map((section) => (
                                    <button
                                        key={section}
                                        onClick={() => handleMobileNavClick(section)}
                                        className={`mobile-menu-nav-button ${activeSection === section ? 'active' : ''}`}
                                    >
                                        {section === 'job-analyzer' ? 'Job Matcher' : section.charAt(0).toUpperCase() + section.slice(1)}
                                    </button>
                                ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
