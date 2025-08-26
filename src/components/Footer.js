import React, { useState } from 'react';
import Feedback from './Feedback'; // Import the Feedback component

const Footer = () => {
    const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

    const handleOpenFeedbackModal = () => {
        setFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setFeedbackModalOpen(false);
    };

    return (
        <>
            <footer className="footer">
                <div className="footer-container">
                    <p>&copy; {new Date().getFullYear()} Sudharsana Rajasekaran. All rights reserved.</p>
                    <div className="footer-links">
                        <button onClick={handleOpenFeedbackModal} className="feedback-link">Feedback</button>
                    </div>
                </div>
            </footer>
            {isFeedbackModalOpen && <Feedback onClose={handleCloseFeedbackModal} />}
        </>
    );
};

export default Footer;
