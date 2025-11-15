import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JobMatch() {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasResume, setHasResume] = useState(false);
  const [skillsCount, setSkillsCount] = useState(0);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

  useEffect(() => {
    checkResumeStatus();
  }, []);

  const checkResumeStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Check if user has skills (from resume)
      const skillsResponse = await axios.get('http://localhost:8000/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const count = skillsResponse.data.length;
      setSkillsCount(count);
      setHasResume(count > 0);
      
      if (count === 0) {
        setShowUploadPrompt(true);
      }
    } catch (error) {
      console.error('Error checking resume status:', error);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      // Upload resume and extract text
      const response = await axios.post('http://localhost:8000/upload-resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedResume(file.name);
      setResumeText(response.data.resume_text || '');
      setUploading(false);
      
      // Auto-check skills from uploaded resume
      await checkResumeStatus();
      
      const skillsCount = response.data.skills_count || 0;
      const skillsFound = response.data.skills_found || [];
      
      alert(`✅ Resume uploaded successfully!\n\n📊 Extracted ${skillsCount} skills:\n${skillsFound.slice(0, 10).join(', ')}${skillsCount > 10 ? '...' : ''}\n\nYou can now analyze jobs!`);
    } catch (error) {
      console.error('Error uploading resume:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      setError(`Failed to upload resume: ${errorMsg}\n\nTips:\n• Try converting PDF to TXT\n• Ensure file is readable\n• Check file size (max 5MB)`);
      setUploading(false);
      alert(`❌ Failed to upload resume\n\n${errorMsg}\n\nTips:\n1. Try uploading a TXT file instead\n2. Make sure the file contains readable text\n3. Check if the file is corrupted`);
    }
  };

  const analyzeJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    // Check if user has resume/skills or uploaded resume
    if (skillsCount === 0 && !uploadedResume) {
      setError('No skills found! Please upload a resume, create one, or add skills manually.');
      setShowUploadPrompt(true);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to analyze jobs');
        setLoading(false);
        return;
      }

      // Call real-time job matching API
      const response = await axios.post(
        'http://localhost:8000/ai/match-jobs',
        { job_description: jobDescription },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setAnalysis({
        matchScore: response.data.match_score,
        matchedSkills: response.data.matched_skills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        missingSkills: response.data.missing_skills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
        recommendations: response.data.recommendations,
        message: response.data.message
      });
      setLoading(false);
      setShowUploadPrompt(false);
    } catch (err) {
      console.error('Error analyzing job:', err);
      setError(err.response?.data?.detail || 'Failed to analyze job. Make sure you have uploaded a resume or created one!');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Status Banner */}
      {showUploadPrompt && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">No Resume Found!</h3>
              <p className="text-yellow-700 mb-4">
                To use Job Match, we need your skills. You have {skillsCount} skills tracked.
              </p>
              <div className="flex flex-wrap gap-3">
                <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold cursor-pointer flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  📤 {uploading ? 'Uploading...' : 'Upload Resume'}
                </label>
                <button
                  onClick={() => window.location.href = '/dashboard/resume-builder'}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-semibold"
                >
                  📝 Create Resume (Auto-sync Skills)
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard/skill-tracker'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  📚 Add Skills Manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Resume Status */}
      {uploadedResume && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-semibold text-blue-800">Resume Uploaded!</p>
                <p className="text-sm text-blue-700">{uploadedResume}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setUploadedResume(null);
                setResumeText('');
              }}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Skills Status */}
      {hasResume && !uploadedResume && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">Resume Loaded!</p>
              <p className="text-sm text-green-700">Analyzing with {skillsCount} skills from your profile</p>
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">🎯 AI-Powered Job Matching</h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste a job description to get real-time matching based on YOUR resume skills!
        </p>
        
        {/* Quick Options */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setJobDescription('I want to become a Full Stack Developer at Google')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
          >
            Full Stack Developer at Google
          </button>
          <button
            onClick={() => setJobDescription('I want to become a Data Scientist at Microsoft')}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
          >
            Data Scientist at Microsoft
          </button>
          <button
            onClick={() => setJobDescription('I want to become a DevOps Engineer at Amazon')}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
          >
            DevOps Engineer at Amazon
          </button>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        <textarea
          placeholder="Copy and paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full p-4 border rounded-lg h-48 resize-none"
        />
        <button
          onClick={analyzeJob}
          disabled={loading || !jobDescription.trim()}
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
        >
          {loading ? '🔄 Analyzing with AI...' : '🎯 Analyze Job Match'}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Match Score */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Match Score</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={analysis.matchScore >= 70 ? '#10b981' : analysis.matchScore >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.matchScore / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{analysis.matchScore}%</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {analysis.matchScore >= 70 ? '🎉 Great Match!' : analysis.matchScore >= 50 ? '👍 Good Match' : '⚠️ Needs Improvement'}
                </p>
                <p className="text-gray-600 mt-1">
                  You match {analysis.matchedSkills.length} out of {analysis.matchedSkills.length + analysis.missingSkills.length} key requirements
                </p>
              </div>
            </div>
          </div>

          {/* Skills Comparison */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-3 text-green-600">✅ Your Matching Skills</h3>
              <div className="space-y-2">
                {analysis.matchedSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="font-semibold">{skill}</span>
                    <span className="text-green-600">✓</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-3 text-red-600">❌ Missing Skills</h3>
              <div className="space-y-2">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="font-semibold">{skill}</span>
                      <a
                        href={`https://www.google.com/search?q=learn+${encodeURIComponent(skill)}+tutorial`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-sm hover:underline flex items-center gap-1"
                      >
                        🔍 Learn
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Great! You have all required skills! 🎉</p>
                )}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">🤖 AI-Powered Recommendations</h3>
            <div className="space-y-3">
              {analysis.recommendations && analysis.recommendations.length > 0 ? (
                analysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <span className="text-2xl">💡</span>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recommendations available</p>
              )}
            </div>
          </div>

          {/* Learning Resources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">🔍 Learning Resources</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {analysis.missingSkills.slice(0, 4).map((skill, idx) => (
                <a
                  key={idx}
                  href={`https://www.google.com/search?q=${encodeURIComponent(skill)}+course+tutorial+free`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-indigo-700">Learn {skill}</p>
                      <p className="text-sm text-gray-600">Find courses & tutorials</p>
                    </div>
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Action Message */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
            <p className="mb-4">{analysis.message || `You match ${analysis.matchScore}% of the requirements!`}</p>
            <div className="flex gap-4 justify-center">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(jobDescription.slice(0, 100))}+jobs`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
              >
                🔍 Find Similar Jobs
              </a>
              <button
                onClick={() => window.location.href = '/dashboard/resume-builder'}
                className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800"
              >
                📝 Update Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
