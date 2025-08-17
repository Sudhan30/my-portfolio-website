import React from 'react';
import CompanyInterestForm from './CompanyInterestForm';

const InterestSection = () => {
    return (
        <section id="interest" className="section-padding interest-section">
            <div className="interest-form-container">
                <h3 className="interest-form-title">
                    <span className="relative-text">Interested in Collaborating?</span>
                    <span className="underline-effect"></span>
                </h3>
                <p className="interest-form-description">
                    If your company is interested in discussing potential opportunities or collaborations, please fill out the form below.
                </p>
                <CompanyInterestForm />
            </div>
        </section>
    );
};

export default InterestSection;
