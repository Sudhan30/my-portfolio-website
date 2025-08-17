import React, { useState } from 'react';
import { Building } from 'lucide-react';

const CompanyInterestForm = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a backend service.
        // For example, a Google Cloud Function, App Engine endpoint, or a third-party form service.
        console.log('Form submitted:', formData);

        // Display a simple message box instead of alert()
        const messageBox = document.createElement('div');
        messageBox.className = 'fixed-message-box-overlay';
        messageBox.innerHTML = `
            <div class="fixed-message-box-content">
                <h4 class="message-box-title">Thank You!</h4>
                <p class="message-box-text">Your interest has been noted. Sudharsana will get back to you soon.</p>
                <button id="closeMessageBox" class="message-box-button">Close</button>
            </div>
        `;
        document.body.appendChild(messageBox);

        document.getElementById('closeMessageBox').addEventListener('click', () => {
            document.body.removeChild(messageBox);
        });

        // Clear the form
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            message: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form-layout">
            <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="contactPerson">Contact Person</label>
                <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Company Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="message">Message / Area of Interest</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your interest..."
                    required
                ></textarea>
            </div>
            <button
                type="submit"
                className="form-submit-button"
            >
                <Building style={{ marginRight: '0.5rem' }} size={20} /> Submit Interest
            </button>
            <style>
                {`
                .form-layout {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem; /* space-y-6 equivalent */
                    text-align: left; /* Ensure content is left-aligned within the form */
                }

                .fixed-message-box-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                }

                .fixed-message-box-content {
                    background-color: var(--white);
                    padding: 2rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    text-align: center;
                    max-width: 24rem;
                    margin-left: auto;
                    margin-right: auto;
                }

                .message-box-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--gray-900);
                    margin-bottom: 1rem;
                }

                .message-box-text {
                    color: var(--gray-700);
                    margin-bottom: 1.5rem;
                }

                .message-box-button {
                    background-color: var(--purple-600);
                    color: var(--white);
                    padding: 0.5rem 1.5rem;
                    border-radius: 9999px;
                    transition-property: background-color;
                    transition-duration: 300ms;
                    cursor: pointer;
                    border: none;
                }

                .message-box-button:hover {
                    background-color: var(--purple-700);
                }
                `}
            </style>
        </form>
    );
};

export default CompanyInterestForm;
