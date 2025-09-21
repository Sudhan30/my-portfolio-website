import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { experiences } from '../data';
import otelService from '../services/opentelemetry';

const JobExperience = ({ job }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        
        // Track dropdown interaction
        otelService.trackDropdown(
            newIsOpen ? 'open' : 'close',
            document.querySelector(`[data-job-id="${job.company}"]`),
            {
                jobTitle: job.title,
                company: job.company,
                duration: job.duration
            }
        );
    };

    return (
        <div className="experience-card" data-job-id={job.company}>
            <div className="experience-card-header" onClick={handleToggle}>
                <div className="experience-card-main">
                    <div className="experience-icon">
                        {React.createElement(job.icon, { size: 24 })}
                    </div>
                    <div className="experience-info">
                        <div className="experience-header-line">
                            <h4 className="experience-title">{job.title}</h4>
                            <span className="experience-duration">{job.duration}</span>
                        </div>
                        <div className="experience-company">
                            <span>{job.company}</span>
                            <span className="experience-location">
                                <MapPin size={14} />
                                {job.location}
                            </span>
                        </div>
                    </div>
                </div>
                <ChevronDown className={`experience-chevron ${isOpen ? 'rotated' : ''}`} size={20} />
            </div>
            
            {isOpen && (
                <div className="experience-details">
                    <div className="experience-projects">
                        <h5 className="projects-title">Key Projects & Achievements</h5>
                        <div className="projects-grid">
                            {job.projects.map((project, projectIndex) => (
                                <div key={projectIndex} className="project-card">
                                    <h6 className="project-name">{project.name}</h6>
                                    <p className="project-description">{project.description}</p>
                                    {project.impact && (
                                        <div className="project-impact">
                                            <strong>Impact:</strong> {project.impact}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Experience = () => {
    return (
        <section id="experience" className="section-padding experience-section">
            <div className="section-container">
                <h2 className="section-title">
                    <span className="relative-text">Professional Experience</span>
                    <span className="underline-effect"></span>
                </h2>
                <div className="experience-container">
                    {experiences.map((job, jobIndex) => (
                        <JobExperience key={jobIndex} job={job} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;