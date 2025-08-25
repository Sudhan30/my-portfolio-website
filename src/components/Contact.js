import React from 'react';
import { Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section id="contact" className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-4xl font-bold text-center mb-12 text-gray-900 relative">
                    <span className="relative z-10">Get in Touch</span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 w-24 bg-purple-500 rounded-full z-0"></span>
                </h3>
                <motion.div
                    className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-4 md:space-y-0"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.a
                        href="https://www.linkedin.com/in/sudharsanarajasekaran/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                        variants={itemVariants}
                    >
                        <Linkedin className="text-blue-700" size={32} />
                        <span className="text-lg font-medium text-gray-700 transition-colors duration-300 hover:text-gray-900">LinkedIn Profile</span>
                    </motion.a>
                    <motion.a
                        href="https://github.com/Sudhan30"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                        variants={itemVariants}
                    >
                        <Github className="text-gray-800" size={32} />
                        <span className="text-lg font-medium text-gray-700 transition-colors duration-300 hover:text-gray-900">GitHub Profile</span>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
