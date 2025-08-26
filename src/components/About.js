import React from 'react';
import { GraduationCap, Award } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="section-padding about-section">
            <div className="section-container">
                <h3 className="section-title">
                    <span className="relative-text">About Me</span>
                    <span className="underline-effect"></span>
                </h3>
                <div className="about-grid">
                    <div className="about-text animate-fade-in-left">
                        <p>
                            I am a highly accomplished Senior Data Engineer with a proven track record of architecting and implementing robust data pipelines that drive significant business impact. My expertise lies in transforming complex data into actionable insights, leading to tangible improvements in revenue, operational efficiency, and fraud prevention.
                        </p>
                        <p>
                            With a Master's in Business Analytics (Data Science) and a background in Electronics & Communication Engineering, I bring a unique blend of technical prowess and business acumen. I thrive in collaborative environments, ensuring seamless synergy between engineering and product development to achieve broader organizational objectives.
                        </p>
                        <p>
                            My career highlights include spearheading data initiatives at Walmart Global Tech and building critical BI solutions for Google's global data center operations. I am passionate about leveraging cutting-edge technologies and data science techniques to solve real-world problems.
                        </p>
                    </div>
                    <div className="education-card animate-fade-in-right">
                        <h4 className="education-card-title">
                            <GraduationCap style={{ marginRight: '0.75rem' }} size={24} /> Education
                        </h4>
                        <ul className="education-list">
                            <li className="education-list-item">
                                <Award style={{ color: 'var(--yellow-500)', marginRight: '0.75rem', marginTop: '0.25rem' }} size={20} />
                                <div>
                                    <p className="title">M.S in Business Analytics (Data Science)</p>
                                    <p className="detail">The University of Texas at Dallas</p>
                                </div>
                            </li>
                            <li className="education-list-item">
                                <Award style={{ color: 'var(--yellow-500)', marginRight: '0.75rem', marginTop: '0.25rem' }} size={20} />
                                <div>
                                    <p className="title">B.E., Electronics & Communication Engineering</p>
                                    <p className="detail">Anna University</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
