import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, Loader } from 'lucide-react';
import { config } from '../utils/env';

const JobDescriptionAnalyzer = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobDescription.trim()) {
            setError('Please enter a job description');
            return;
        }

        setIsAnalyzing(true);
        setError('');
        setAnalysisResult(null);

        try {
            const response = await fetch(config.analyzeJobDescriptionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobDescription: jobDescription.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze job description');
            }

            const result = await response.json();
            setAnalysisResult(result);
        } catch (err) {
            setError('Failed to analyze job description. Please try again.');
            console.error('Error analyzing job description:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClear = () => {
        setJobDescription('');
        setAnalysisResult(null);
        setError('');
    };

    return (
        <section id="job-analyzer" className="section-padding job-analyzer-section">
            <div className="job-analyzer-container">
                <h3 className="job-analyzer-title">
                    <span className="relative-text">Job Description Analyzer</span>
                    <span className="underline-effect"></span>
                </h3>
                <p className="job-analyzer-description">
                    Paste a job description below to see if I'm interested in the role and how well my skills match the requirements.
                </p>

                <form onSubmit={handleSubmit} className="job-analyzer-form">
                    <div className="form-group">
                        <label htmlFor="jobDescription">Job Description</label>
                        <textarea
                            id="jobDescription"
                            name="jobDescription"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows="8"
                            placeholder="Paste the job description here..."
                            required
                            disabled={isAnalyzing}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="analyze-button"
                            disabled={isAnalyzing || !jobDescription.trim()}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader className="spinning" size={20} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <FileText size={20} />
                                    Analyze Job
                                </>
                            )}
                        </button>
                        
                        {jobDescription && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="clear-button"
                                disabled={isAnalyzing}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                {error && (
                    <div className="error-message">
                        <XCircle size={20} />
                        {error}
                    </div>
                )}

                {analysisResult && (
                    <div className="analysis-results">
                        <div className="results-grid">
                            {/* Interest Card */}
                            <div className={`result-card ${analysisResult.isInterested ? 'interested' : 'not-interested'}`}>
                                <div className="card-header">
                                    {analysisResult.isInterested ? (
                                        <CheckCircle size={24} className="success-icon" />
                                    ) : (
                                        <XCircle size={24} className="error-icon" />
                                    )}
                                    <h4>Interest Level</h4>
                                </div>
                                <div className="card-content">
                                    <p className="interest-status">
                                        {analysisResult.isInterested ? 'Interested' : 'Not Interested'}
                                    </p>
                                </div>
                            </div>

                            {/* Skills Match Card */}
                            <div className={`result-card ${analysisResult.skillsMatch ? 'skills-match' : 'skills-no-match'}`}>
                                <div className="card-header">
                                    {analysisResult.skillsMatch ? (
                                        <CheckCircle size={24} className="success-icon" />
                                    ) : (
                                        <XCircle size={24} className="error-icon" />
                                    )}
                                    <h4>Skills Match</h4>
                                </div>
                                <div className="card-content">
                                    <p className="skills-status">
                                        {analysisResult.skillsMatch ? 'Good Match' : 'Limited Match'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reasoning Section */}
                        <div className="reasoning-section">
                            <h4>Analysis Details</h4>
                            <div className="reasoning-grid">
                                <div className="reasoning-card">
                                    <h5>Why I'm Qualified</h5>
                                    <textarea
                                        value={analysisResult.qualificationReasons || ''}
                                        readOnly
                                        className="reasoning-textarea"
                                        rows="4"
                                    />
                                </div>
                                <div className="reasoning-card">
                                    <h5>Why I'm Not Interested</h5>
                                    <textarea
                                        value={analysisResult.disinterestReasons || ''}
                                        readOnly
                                        className="reasoning-textarea"
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default JobDescriptionAnalyzer;
