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
            <footer className="bg-gray-900 text-gray-300 py-8 text-center mt-auto rounded-t-xl">
                <div className="max-w-6xl mx-auto">
                    <p>&copy; {new Date().getFullYear()} Sudharsana Rajasekaran. All rights reserved.</p>
                    <div className="mt-4">
                        <button onClick={handleOpenFeedbackModal} className="text-purple-400 hover:text-purple-300 underline">Feedback</button>
                    </div>
                </div>
            </footer>
            {isFeedbackModalOpen && <Feedback onClose={handleCloseFeedbackModal} />}
        </>
    );
};

export default Footer;
