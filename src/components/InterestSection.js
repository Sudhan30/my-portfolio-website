import React from 'react';
import CompanyInterestForm from './CompanyInterestForm';
import { motion } from 'framer-motion';

const InterestSection = () => {
    return (
        <motion.section
            id="interest"
            className="py-20 px-6 bg-gray-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-xl mx-auto text-center bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-4xl font-bold mb-6 text-gray-900 relative">
                    <span className="relative z-10">Interested in Collaborating?</span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 w-24 bg-purple-500 rounded-full z-0"></span>
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                    If your company is interested in discussing potential opportunities or collaborations, please fill out the form below.
                </p>
                <CompanyInterestForm />
            </div>
        </motion.section>
    );
};

export default InterestSection;
