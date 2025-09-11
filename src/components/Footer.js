import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} Sudharsana Rajasekaran. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
