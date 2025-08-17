import React from 'react';
import { skills } from '../data';

const Skills = () => {
    return (
        <section id="skills" className="section-padding skills-section">
            <div className="section-container">
                <h3 className="section-title">
                    <span className="relative-text">Technical Skills</span>
                    <span className="underline-effect"></span>
                </h3>
                <div className="skills-grid">
                    {skills.map((skillCategory, index) => (
                        <div key={index} className="skill-category-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="skill-category-header">
                                {React.createElement(skillCategory.icon, { size: 28, style: { marginRight: '0.75rem' } })}
                                <h4 className="skill-category-title">{skillCategory.category}</h4>
                            </div>
                            <div className="skill-tags">
                                {skillCategory.skills.map((skill, skillIndex) => (
                                    <span key={skillIndex} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
