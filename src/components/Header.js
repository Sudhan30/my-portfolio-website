import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ scrollToSection, activeSection }) => {
    const navItems = ['home', 'about', 'skills', 'experience', 'contact', 'interest'];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-full bg-white shadow-md z-40 py-4 px-6 flex justify-between items-center rounded-b-xl"
        >
            <div className="flex items-center space-x-2">
                <User className="text-purple-600" size={28} />
                <h1 className="text-2xl font-bold text-gray-900">Sudharsana Rajasekaran</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
                {navItems.map((section) => (
                    <button
                        key={section}
                        onClick={() => scrollToSection(section)}
                        className={`text-lg font-medium text-gray-700 transition-colors duration-300 ease-in-out pb-1 ${
                            activeSection === section
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'hover:text-purple-600'
                        }`}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}
            </nav>
            <div className="md:hidden">
                <button className="text-gray-700 hover:text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
        </motion.header>
    );
};

export default Header;
