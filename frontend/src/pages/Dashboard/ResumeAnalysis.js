import React, { useState } from 'react';
import { analyzeResumeWithAI } from '../../api/ai';

export default function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      
      // Read file content
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText && !file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeResumeWithAI(resumeText, jobDescription || null, targetRole || null);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">📄 Upload Your Resume</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg font-semibold mb-2">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-gray-500">TXT, PDF, DOC, DOCX (Max 5MB)</p>
          </label>
        </div>
        
        {/* Or paste text */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">Or paste your resume text:</label>
          <textarea
            className="w-full p-3 border rounded-lg h-32"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        {/* Target Role */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">🎯 Target Role (e.g., Software Developer):</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter target job role..."
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>

        {/* Optional: Job Description */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">📋 Job Description (Optional - for better matching):</label>
          <textarea
            className="w-full p-3 border rounded-lg h-24"
            placeholder="Paste job description to get tailored feedback..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {(file || resumeText) && (
          <button
            onClick={analyzeResume}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 font-semibold"
          >
            {loading ? '🔄 Analyzing with AI...' : '✨ Analyze Resume with AI'}
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Score & Role Fit */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">📊 Resume Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.score / 10)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{analysis.score}/10</span>
                </div>
              </div>
              <div>
                <p className="text-xl font-semibold">
                  {analysis.score >= 8 ? '🎉 Excellent!' : analysis.score >= 6 ? '👍 Good!' : '⚠️ Needs Work'}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  {analysis.target_role && `Target: ${analysis.target_role}`}
                </p>
                {analysis.role_fit && (
                  <p className="text-sm opacity-90 mt-1">
                    {analysis.role_fit}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Errors Detected */}
          {analysis.errors && analysis.errors !== "No major errors detected" && (
            <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-bold mb-3 text-red-600">❌ Errors Detected</h3>
              <div className="text-red-700 bg-white p-3 rounded">
                {analysis.errors}
              </div>
            </div>
          )}

          {/* Strengths */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-green-600">✅ Strengths</h3>
            <div className="space-y-2">
              {analysis.strengths.map((strength, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-orange-600">⚠️ Improvements Needed</h3>
            <div className="space-y-2">
              {analysis.improvements.map((improvement, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                  <span className="text-orange-600">{idx + 1}.</span>
                  <span className="text-gray-700">{improvement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-3 text-green-600">✅ Found Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords_found.map((kw, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-3 text-red-600">❌ Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_keywords.map((kw, idx) => (
                  <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Gaps (if job description provided) */}
          {analysis.skill_gaps && analysis.skill_gaps.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-3 text-purple-600">🧩 Skill Gap Analysis</h3>
              <div className="space-y-2">
                {analysis.skill_gaps.map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-purple-50 rounded">
                    <span className="text-purple-600">→</span>
                    <span className="text-gray-700">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Verbs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-blue-600">💪 Action Verb Suggestions</h3>
            <div className="space-y-2">
              {analysis.action_verbs.map((verb, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-blue-600">→</span>
                  <span className="text-gray-700">{verb}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formatting Tips */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-indigo-600">📊 Formatting Suggestions</h3>
            <div className="space-y-2">
              {analysis.formatting_tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-indigo-50 rounded">
                  <span className="text-indigo-600">✓</span>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Suggestions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-3 text-pink-600">🎯 Measurable Achievements</h3>
            <div className="space-y-2">
              {analysis.achievement_suggestions.map((achievement, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-pink-50 rounded">
                  <span className="text-pink-600">📈</span>
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
