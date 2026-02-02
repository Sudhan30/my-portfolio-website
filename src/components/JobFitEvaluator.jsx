import React, { useState } from 'react';
import { resumeData } from '../resumeData';
import { Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const JobFitEvaluator = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Convert simple resume object to string for the prompt
            const resumeString = JSON.stringify(resumeData, null, 2);

            // In a real scenario, this URL might need to be configurable
            // For this setup, we assume the K8s service is exposed on NodePort 30080
            // or accessible via a proxy. Since we are local, we might need the IP.
            // Using the server IP directly for now as requested in the plan.
            const API_URL = "http://192.168.1.129:30080/job-fit";

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job: jobDescription,
                    resume: resumeString,
                    preferences: {
                        interests: resumeData.interests,
                        disinterests: resumeData.disinterests,
                        locations: [resumeData.personalInfo.preferredLocation],
                        salary: resumeData.personalInfo.salaryRequirements
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze job fit. Ensure the backend server is running and accessible.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 90) return "text-green-500";
        if (score >= 70) return "text-blue-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl shadow-2xl my-10 border border-slate-800">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                AI Job Fit Evaluator
            </h2>

            <div className="mb-6">
                <label className="block text-slate-300 mb-2 font-medium">
                    Paste Job Description
                </label>
                <textarea
                    className="w-full h-48 bg-slate-800 text-slate-100 border border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>

            <button
                onClick={handleAnalyze}
                disabled={loading || !jobDescription.trim()}
                className={`flex items-center justify-center w-full py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading || !jobDescription.trim()
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg_glow'
                    }`}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" /> Analyzing...
                    </>
                ) : (
                    <>
                        <Send className="mr-2" /> Analyze Fit
                    </>
                )}
            </button>

            {error && (
                <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center text-red-200">
                    <AlertCircle className="mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
                            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Fit Score</h3>
                            <div className={`text-6xl font-black ${getScoreColor(result.fit_score)}`}>
                                {result.fit_score}
                            </div>
                            <div className={`text-lg font-semibold mt-2 ${getScoreColor(result.fit_score)}`}>
                                {result.fit_level}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 flex flex-col justify-center">
                            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Verdict</h3>
                            <p className="text-slate-100 text-lg italic">"{result.verdict}"</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-6">
                        <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-3">Summary</h3>
                        <p className="text-slate-200 leading-relaxed">{result.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-900/10 border border-green-900/30 p-5 rounded-lg">
                            <h3 className="flex items-center text-green-400 font-bold mb-3">
                                <CheckCircle className="w-5 h-5 mr-2" /> Aligned Areas
                            </h3>
                            <ul className="space-y-2">
                                {result.aligned_areas?.map((item, i) => (
                                    <li key={i} className="text-slate-300 flex items-start">
                                        <span className="mr-2">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-yellow-900/10 border border-yellow-900/30 p-5 rounded-lg">
                            <h3 className="flex items-center text-yellow-500 font-bold mb-3">
                                <AlertCircle className="w-5 h-5 mr-2" /> Gaps & Considerations
                            </h3>
                            <ul className="space-y-2">
                                {result.gaps?.map((item, i) => (
                                    <li key={i} className="text-slate-300 flex items-start">
                                        <span className="mr-2">•</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobFitEvaluator;
