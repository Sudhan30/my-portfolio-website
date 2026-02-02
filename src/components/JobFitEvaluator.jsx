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
            const resumeString = JSON.stringify(resumeData, null, 2);
            // Public NodePort URL (user's server IP)
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
        if (score >= 90) return "text-green-600";
        if (score >= 70) return "text-blue-600";
        if (score >= 50) return "text-yellow-600";
        return "text-red-500";
    };

    return (
        <div className="max-w-4xl mx-auto p-8 my-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 md:p-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        AI Job Fit Evaluator
                    </h2>

                    <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
                        Paste a job description below to see how well it matches my skills and experience, analyzed by a custom LLM.
                    </p>

                    <div className="mb-8">
                        <label className="block text-gray-700 font-semibold mb-3">
                            Job Description
                        </label>
                        <textarea
                            className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 resize-none"
                            placeholder="Paste the job requirements here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !jobDescription.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center ${loading || !jobDescription.trim()
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" /> Analyzing Fit...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2" /> Analyze Job Fit
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600">
                            <AlertCircle className="mr-3 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="bg-gray-50 p-8 md:p-10 border-t border-gray-100 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                                <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2 font-semibold">Fit Score</h3>
                                <div className={`text-6xl font-black ${getScoreColor(result.fit_score)}`}>
                                    {result.fit_score}
                                </div>
                                <div className={`text-lg font-bold mt-2 ${getScoreColor(result.fit_score)}`}>
                                    {result.fit_level}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                                <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2 font-semibold">Verdict</h3>
                                <p className="text-gray-800 text-lg italic font-medium">"{result.verdict}"</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                            <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-4 font-semibold">Analysis Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{result.summary}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="flex items-center text-green-700 font-bold">
                                    <CheckCircle className="w-5 h-5 mr-2" /> Aligned Areas
                                </h3>
                                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                    <ul className="space-y-3">
                                        {result.aligned_areas?.map((item, i) => (
                                            <li key={i} className="text-gray-700 flex items-start">
                                                <span className="mr-2 text-green-500">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="flex items-center text-yellow-700 font-bold">
                                    <AlertCircle className="w-5 h-5 mr-2" /> Gaps & Considerations
                                </h3>
                                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-100">
                                    <ul className="space-y-3">
                                        {result.gaps?.map((item, i) => (
                                            <li key={i} className="text-gray-700 flex items-start">
                                                <span className="mr-2 text-yellow-600">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobFitEvaluator;
