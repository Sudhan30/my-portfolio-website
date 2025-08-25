import React from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.section
            id="about"
            className="py-20 px-6 bg-white shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="max-w-6xl mx-auto">
                <h3 className="text-4xl font-bold text-center mb-12 text-gray-900 relative">
                    <span className="relative z-10">About Me</span>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 h-2 w-24 bg-purple-500 rounded-full z-0"></span>
                </h3>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div variants={itemVariants} className="text-lg leading-relaxed">
                        <p className="mb-4">
                            I am a highly accomplished Senior Data Engineer with a proven track record of architecting and implementing robust data pipelines that drive significant business impact. My expertise lies in transforming complex data into actionable insights, leading to tangible improvements in revenue, operational efficiency, and fraud prevention.
                        </p>
                        <p className="mb-4">
                            With a Master's in Business Analytics (Data Science) and a background in Electronics & Communication Engineering, I bring a unique blend of technical prowess and business acumen. I thrive in collaborative environments, ensuring seamless synergy between engineering and product development to achieve broader organizational objectives.
                        </p>
                        <p>
                            My career highlights include spearheading data initiatives at Walmart Global Tech and building critical BI solutions for Google's global data center operations. I am passionate about leveraging cutting-edge technologies and data science techniques to solve real-world problems.
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-gray-100 p-8 rounded-xl shadow-md">
                        <h4 className="text-2xl font-semibold mb-6 text-purple-700 flex items-center">
                            <GraduationCap className="mr-3" size={24} /> Education
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Award className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="font-medium text-gray-900">M.S in Business Analytics (Data Science)</p>
                                    <p className="text-gray-600">The University of Texas at Dallas</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <Award className="text-yellow-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <p className="font-medium text-gray-900">B.E., Electronics & Communication Engineering</p>
                                    <p className="text-gray-600">Anna University</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default About;
