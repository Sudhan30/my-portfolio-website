import React, { useState } from 'react';
import { Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

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
        console.log('Form submitted:', formData);

        Swal.fire({
            title: 'Thank You!',
            text: 'Your interest has been noted. Sudharsana will get back to you soon.',
            icon: 'success',
            confirmButtonText: 'Close',
            customClass: {
                popup: 'rounded-xl shadow-lg',
                title: 'text-2xl font-bold text-gray-900',
                confirmButton: 'bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full',
            }
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
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="form-group">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2 pl-4">Company Name</label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <div className="form-group">
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2 pl-4">Contact Person</label>
                <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 pl-4">Company Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <div className="form-group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 pl-4">Message / Area of Interest</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell us about your interest..."
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
            </div>
            <motion.button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.05, backgroundColor: '#7c3aed' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                <Building className="mr-2" size={20} /> Submit Interest
            </motion.button>
        </form>
    );
};

export default CompanyInterestForm;
