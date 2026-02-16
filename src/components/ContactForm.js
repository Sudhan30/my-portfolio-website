import React, { useState } from 'react';
import { Mail, Send, Loader2 } from 'lucide-react';
import './ContactForm.css';
import { config } from '../utils/env';
import otelService from '../services/opentelemetry';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Track form submission
        otelService.trackFormSubmit(e.target, {
            formType: 'contact',
            hasName: !!formData.name,
            hasEmail: !!formData.email,
            hasSubject: !!formData.subject,
            hasMessage: !!formData.message
        });

        try {
                    const response = await fetch(config.submitContactFormUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                const errorData = await response.text();
                setError(errorData || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="contact-form-success">
                <div className="success-icon">
                    <Mail size={48} />
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="contact-form-button"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <div className="contact-form-container">
            <div className="contact-form-header">
                <p>Feel free to reach out for collaboration, technical discussions, or to share your thoughts. I'm always happy to connect with fellow engineers and enthusiasts.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project, idea, or opportunity..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        disabled={submitting}
                    />
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <button 
                    type="submit" 
                    className="contact-form-button"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <Loader2 size={20} className="spinning" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Send Message
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
