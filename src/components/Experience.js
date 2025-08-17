import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experiences } from '../data';

const JobExperience = ({ job }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="job-card animate-fade-in-up">
            <div className="job-card-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="job-card-header-left">
                    {React.createElement(job.icon, { size: 32, style: { color: 'var(--purple-600)', marginRight: '1rem' } })}
                    <div>
                        <h4 className="job-title">{job.title}</h4>
                        <p className="job-company">{job.company}</p>
                        <p className="job-duration">{job.duration}</p>
                    </div>
                </div>
                <ChevronDown className={`job-chevron ${isOpen ? 'rotated' : ''}`} size={24} />
            </div>
            {isOpen && (
                <div className="job-projects-content">
                    <h5 className="job-projects-title">Key Projects & Contributions:</h5>
                    <ul className="job-projects-list">
                        {job.projects.map((project, projectIndex) => (
                            <li key={projectIndex} className="job-project-item">
                                <strong>{project.name}:</strong> {project.description}
                                {project.impact && <span className="impact-text">Impact: {project.impact}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Experience = () => {
    return (
        <section id="experience" className="section-padding experience-section">
            <div className="section-container">
                <h3 className="section-title">
                    <span className="relative-text">Professional Experience & Projects</span>
                    <span className="underline-effect"></span>
                </h3>
                <div className="job-experience-container">
                    {experiences.map((job, jobIndex) => (
                        <JobExperience key={jobIndex} job={job} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
