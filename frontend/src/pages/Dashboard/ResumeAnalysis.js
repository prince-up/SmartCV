import React, { useState } from "react";
import { analyzeResumeWithAI } from "../../api/ai";

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload a resume file");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeResumeWithAI(file, jobDescription || null, targetRole || null);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || "Failed to analyze resume");
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800"> Resume Analysis</h2>
        
        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Upload Your Resume</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
                disabled={loading}
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="text-6xl mb-4"></div>
                <p className="text-lg font-semibold mb-2">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">2. Enter Job Description (Optional)</h3>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste the job description here to compare with your resume..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Target Role */}
          <div>
            <h3 className="text-lg font-semibold mb-3">3. Target Role (Optional)</h3>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Software Engineer, Product Manager, etc."
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyzeResume}
            disabled={loading || !file}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              " Analyze Resume with AI"
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && analysis.success && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header with Score */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Resume Analysis Results</h2>
              <div className="flex items-center">
                <div className="relative w-24 h-24 mr-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - (analysis.score || 0) / 100)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{Math.round(analysis.score || 0)}</span>
                    <span className="text-sm">ATS Score</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Overall Assessment</h3>
                  <p className="text-blue-100">
                    {analysis.score >= 80 ? " Excellent ATS optimization!" :
                     analysis.score >= 60 ? " Good foundation, with room for improvement" :
                     " Needs optimization for ATS systems"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-6 space-y-6">
              {/* Job Match Score */}
              {analysis.job_match_score !== null && (
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold mb-3 text-blue-600"> Job Match Score</h3>
                  <div className="flex items-center mb-4">
                    <div className="text-4xl font-bold text-blue-600">
                      {Math.round(analysis.job_match_score * 100)}%
                    </div>
                    <div className="ml-4 text-gray-600">
                      Match with target role/job description
                    </div>
                  </div>
                  {analysis.missing_keywords && analysis.missing_keywords.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-gray-700">Missing Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missing_keywords.map((keyword, idx) => (
                          <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-3 text-green-600"> Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {analysis.skills && analysis.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded">
                      <span className="text-green-600"></span>
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        {skill.experience && (
                          <div className="text-sm text-gray-600">
                            {Math.round(skill.experience / 12)} years
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              {analysis.experience && analysis.experience.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold mb-3 text-blue-600"> Work Experience</h3>
                  <div className="space-y-4">
                    {analysis.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-lg">{exp.title}</h4>
                        <div className="text-gray-600">{exp.company}</div>
                        <div className="text-sm text-gray-500 mt-1">{exp.dates}</div>
                        {exp.location && (
                          <div className="text-sm text-gray-500">{exp.location}</div>
                        )}
                        {exp.description && (
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {analysis.education && analysis.education.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold mb-3 text-purple-600"> Education</h3>
                  <div className="space-y-4">
                    {analysis.education.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-lg">{edu.degree}</h4>
                        <div className="text-gray-600">{edu.institution}</div>
                        <div className="text-sm text-gray-500 mt-1">{edu.dates}</div>
                        {edu.location && (
                          <div className="text-sm text-gray-500">{edu.location}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Analysis powered by Affinda AI</p>
                <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}