import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experiences } from '../data';
import { motion, AnimatePresence } from 'framer-motion';

const JobExperience = ({ job }) => {
    const [isOpen, setIsOpen] = useState(false);

    const contentVariants = {
        collapsed: { height: 0, opacity: 0, marginTop: 0 },
        open: {
            height: 'auto',
            opacity: 1,
            marginTop: '1.5rem',
            transition: {
                duration: 0.4,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center">
                    {React.createElement(job.icon, { size: 32, className: "text-purple-600 mr-4" })}
                    <div>
                        <h4 className="text-2xl font-bold text-gray-900">{job.title}</h4>
                        <p className="text-lg text-gray-600">{job.company}</p>
                        <p className="text-md text-gray-500">{job.duration}</p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="text-gray-500" size={24} />
                </motion.div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={contentVariants}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        className="overflow-hidden"
                    >
                        <div className="pt-6 border-t border-gray-200">
                            <h5 className="text-xl font-semibold mb-4 text-purple-700">Key Projects & Contributions:</h5>
                            <ul className="list-none p-0 m-0 space-y-4 text-gray-700">
                                {job.projects.map((project, projectIndex) => (
                                    <li key={projectIndex} className="relative pl-6">
                                        <div className="absolute left-0 top-1.5 w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <strong>{project.name}:</strong> {project.description}
                                        {project.impact && <span className="block text-sm text-gray-500 italic mt-1">Impact: {project.impact}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Experience = () => {
    return (
        <section id="experience" className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <h3 className="text-4xl font-bold text-center mb-12 text-gray-900 relative">
                    <span className="relative z-10">Professional Experience & Projects</span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 w-24 bg-purple-500 rounded-full z-0"></span>
                </h3>
                <div className="space-y-10">
                    {experiences.map((job, jobIndex) => (
                        <JobExperience key={jobIndex} job={job} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
