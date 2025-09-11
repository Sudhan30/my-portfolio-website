import React, { useState } from 'react';
import './Feedback.css';
import { config } from '../utils/env';

const Feedback = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedback) {
            setError('Feedback message is required.');
            return;
        }
        setError(null);
        setSubmitting(true);

        try {
            const response = await fetch(config.submitFeedbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, feedback }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            setSuccess(true);
        } catch (err) {
            setError('Failed to submit feedback. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="feedback-modal-overlay">
                <div className="feedback-modal">
                    <button onClick={onClose} className="close-button">&times;</button>
                    <h2>Thank you!</h2>
                    <p>Your feedback has been submitted successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-modal-overlay">
            <div className="feedback-modal">
                <button onClick={onClose} className="close-button">&times;</button>
                <h2>Submit Feedback</h2>
                <p>We value your feedback for site improvement.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name (Optional)</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email (Optional)</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="feedback">Feedback (Required)</label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            maxLength="1000"
                            required
                        />
                        <div className="char-counter">{feedback.length} / 1000</div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
