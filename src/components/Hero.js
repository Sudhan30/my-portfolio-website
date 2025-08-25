import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ scrollToSection }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section id="home" className="relative h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-800 text-white overflow-hidden text-center">
            <div
                className="absolute inset-0 z-0 bg-pattern-dots opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                }}
            ></div>
            <motion.div
                className="z-10 p-6 max-w-4xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2 variants={itemVariants} className="text-6xl font-extrabold leading-tight mb-4">
                    Hello, I'm <span className="text-yellow-300">Sudharsana Rajasekaran</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-3xl font-light mb-8">
                    A <span className="font-semibold">Senior Data Engineer</span> passionate about building scalable data solutions and driving business insights.
                </motion.p>
                <motion.button
                    variants={itemVariants}
                    onClick={() => scrollToSection('experience')}
                    className="bg-white text-purple-700 px-8 py-4 rounded-full text-xl font-semibold shadow-xl transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    View My Projects
                </motion.button>
            </motion.div>
        </section>
    );
};

export default Hero;
