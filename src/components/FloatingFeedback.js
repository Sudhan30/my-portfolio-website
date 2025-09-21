import React, { useState, useEffect } from 'react';
import { MessageCircle, Star, X } from 'lucide-react';
import './FloatingFeedback.css';
import { config } from '../utils/env';
import otelService from '../services/opentelemetry';

const FloatingFeedback = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isNearFooter, setIsNearFooter] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('.footer');
            const aboutSection = document.querySelector('#about');
            const windowHeight = window.innerHeight;
            
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const threshold = 200; // Distance from footer to trigger change
                
                // Check if footer is near the bottom of the viewport
                setIsNearFooter(footerRect.top <= windowHeight + threshold);
            }
            
            // Check if user has scrolled past the hero section (about section is visible)
            if (aboutSection) {
                const aboutRect = aboutSection.getBoundingClientRect();
                const isAboutVisible = aboutRect.top <= windowHeight * 0.5; // Show when about section is 50% visible
                setShowButton(isAboutVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError('Please provide a rating by selecting stars.');
            return;
        }
        
        if (!feedback.trim()) {
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
                body: JSON.stringify({ 
                    name: name || 'Anonymous', 
                    email: email || '', 
                    feedback,
                    rating 
                }),
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

    const handleClose = () => {
        setIsOpen(false);
        setSuccess(false);
        setRating(0);
        
        // Track close button click
        otelService.trackClose(document.querySelector('.floating-feedback-close'), {
            context: 'feedback_modal'
        });
        setHoveredRating(0);
        setName('');
        setEmail('');
        setFeedback('');
        setError(null);
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredRating || rating);
            
            return (
                <button
                    key={index}
                    type="button"
                    className={`star-button ${isFilled ? 'filled' : ''}`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={submitting}
                >
                    <Star size={24} />
                </button>
            );
        });
    };

    if (success) {
        return (
            <>
                <button 
                    className="floating-feedback-button"
                    onClick={() => {
                        setIsOpen(true);
                        otelService.trackButtonClick('Open Feedback', 'floating_button');
                    }}
                    title="Give Feedback"
                >
                    <MessageCircle size={24} />
                </button>
                
                <div className="floating-feedback-overlay">
                    <div className="floating-feedback-modal">
                        <button onClick={handleClose} className="close-button floating-feedback-close">
                            <X size={20} />
                        </button>
                        <div className="success-content">
                            <div className="success-icon">✨</div>
                            <h3>Thank you!</h3>
                            <p>Your feedback has been submitted successfully.</p>
                            <p className="rating-display">
                                Rating: {Array.from({ length: rating }, (_, i) => '⭐').join('')}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {showButton && (
                <button 
                    className={`floating-feedback-button ${isNearFooter ? 'near-footer' : ''}`}
                    onClick={() => {
                        setIsOpen(true);
                        otelService.trackButtonClick('Open Feedback', 'floating_button');
                    }}
                    title="Give Feedback"
                >
                    <MessageCircle size={24} />
                </button>
            )}
            
            {isOpen && (
                <div className="floating-feedback-overlay">
                    <div className="floating-feedback-modal">
                        <button onClick={handleClose} className="close-button floating-feedback-close">
                            <X size={20} />
                        </button>
                        
                        <div className="feedback-header">
                            <h3>Share Your Feedback</h3>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="feedback-form">
                            <div className="form-group">
                                <label htmlFor="name">Name (Optional)</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    disabled={submitting}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email (Optional)</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    disabled={submitting}
                                />
                            </div>
                            
                            <div className="rating-section">
                                <label className="rating-label">
                                    How would you rate this portfolio? <span className="required">*</span>
                                </label>
                                <div className="stars-container">
                                    {renderStars()}
                                    <span className="rating-text">
                                        {rating === 0 ? 'Click to rate' : 
                                         rating === 1 ? 'Poor' :
                                         rating === 2 ? 'Fair' :
                                         rating === 3 ? 'Good' :
                                         rating === 4 ? 'Very Good' : 'Excellent'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="feedback">
                                    Feedback <span className="required">*</span>
                                </label>
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Share your thoughts, suggestions, or experience..."
                                    maxLength="1000"
                                    required
                                    disabled={submitting}
                                    rows="4"
                                />
                                <div className="char-counter">{feedback.length} / 1000</div>
                            </div>
                            
                            {error && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    {error}
                                </div>
                            )}
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    onClick={handleClose}
                                    className="cancel-button"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={submitting || rating === 0 || !feedback.trim()}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingFeedback;
