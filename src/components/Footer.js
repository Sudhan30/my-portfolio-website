import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} Sudharsana Rajasekaran. All rights reserved.</p>
                {/* Removed "Built with React & Plain CSS" as requested */}
            </div>
        </footer>
    );
};

export default Footer;
