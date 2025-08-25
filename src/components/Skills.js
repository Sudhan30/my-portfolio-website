import React from 'react';
import { skills } from '../data';
import { motion } from 'framer-motion';

const Skills = () => {
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
        <motion.section
            id="skills"
            className="py-20 px-6 bg-gray-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
            <div className="max-w-6xl mx-auto">
                <h3 className="text-4xl font-bold text-center mb-12 text-gray-900 relative">
                    <span className="relative z-10">Technical Skills</span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 w-24 bg-purple-500 rounded-full z-0"></span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((skillCategory, index) => (
                        <motion.div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                            variants={itemVariants}
                        >
                            <div className="flex items-center mb-4 text-purple-700">
                                {React.createElement(skillCategory.icon, { size: 28, className: "mr-3" })}
                                <h4 className="text-xl font-semibold">{skillCategory.category}</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillCategory.skills.map((skill, skillIndex) => (
                                    <span key={skillIndex} className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm cursor-pointer hover:bg-purple-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Skills;
