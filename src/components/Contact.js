import React, { useState } from 'react';
import { Linkedin, Github, BookOpen, MessageCircle } from 'lucide-react';
import ContactForm from './ContactForm';

const Contact = () => {
    const [showContactForm, setShowContactForm] = useState(false);

    return (
        <section id="contact" className="section-padding contact-section">
            <div className="contact-container">
                <h2 className="section-title">
                    <span className="relative-text">Get in Touch</span>
                    <span className="underline-effect"></span>
                </h2>
                
                <div className={`contact-form-wrapper ${showContactForm ? 'show' : 'hide'}`}>
                    {showContactForm && <ContactForm />}
                </div>
                
                <div className="contact-links">
                    <a href="https://www.linkedin.com/in/sudharsanarajasekaran/" target="_blank" rel="noopener noreferrer" className="contact-link-item">
                        <Linkedin style={{ color: 'var(--blue-700)' }} size={32} />
                        <span>LinkedIn Profile</span>
                    </a>
                    <a href="https://github.com/Sudhan30" target="_blank" rel="noopener noreferrer" className="contact-link-item">
                        <Github style={{ color: 'var(--gray-800)' }} size={32} />
                        <span>GitHub Profile</span>
                    </a>
                    <a href="https://blog.sudharsana.dev" target="_blank" rel="noopener noreferrer" className="contact-link-item">
                        <BookOpen style={{ color: 'var(--accent-orange-500)' }} size={32} />
                        <span>My Blog</span>
                    </a>
                    <button 
                        onClick={() => setShowContactForm(!showContactForm)}
                        className="contact-link-item contact-button"
                    >
                        <MessageCircle style={{ color: 'var(--green-600)' }} size={32} />
                        <span>{showContactForm ? 'Hide Contact Form' : 'Let\'s Connect!'}</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Contact;
