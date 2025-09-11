import React from 'react';
import { Linkedin, Github, BookOpen } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section-padding contact-section">
            <div className="contact-container">
                <h3 className="section-title">
                    <span className="relative-text">Get in Touch</span>
                    <span className="underline-effect"></span>
                </h3>
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
                        <BookOpen style={{ color: 'var(--purple-600)' }} size={32} />
                        <span>My Blog</span>
                    </a>
                    {/* Email removed as requested */}
                    {/* Phone number removed as requested */}
                </div>
                {/* Address removed as requested */}
            </div>
        </section>
    );
};

export default Contact;
