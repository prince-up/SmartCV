import React, { useState } from 'react';

export default function Portfolio() {
  const [username, setUsername] = useState('princeyadav');
  const [portfolioData, setPortfolioData] = useState({
    bio: 'Full Stack Developer | AI Enthusiast | Open Source Contributor',
    location: 'India',
    website: 'https://github.com/prince-up',
    projects: [
      { name: 'SmartCV', desc: 'AI-powered resume builder', link: 'https://github.com/prince-up/SmartCV' },
      { name: 'E-commerce Platform', desc: 'MERN stack application', link: '#' },
    ],
    certificates: [
      { name: 'React Advanced', issuer: 'Udemy', year: '2024' },
      { name: 'Python for Data Science', issuer: 'Coursera', year: '2023' },
    ],
  });

  const publicLink = `smartcv.me/${username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${publicLink}`);
    alert('Portfolio link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Public Link Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-2">Your Public Portfolio</h3>
        <p className="mb-4 opacity-90">Share this link on LinkedIn, job applications, or your resume</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={`https://${publicLink}`}
            readOnly
            className="flex-1 p-3 rounded-lg text-gray-900"
          />
          <button
            onClick={copyLink}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      {/* Username Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Portfolio Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Custom Username</label>
            <div className="flex gap-2">
              <span className="p-3 bg-gray-100 rounded-lg">smartcv.me/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                className="flex-1 p-3 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Bio</label>
            <textarea
              value={portfolioData.bio}
              onChange={(e) => setPortfolioData({ ...portfolioData, bio: e.target.value })}
              className="w-full p-3 border rounded-lg h-20"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Location</label>
              <input
                type="text"
                value={portfolioData.location}
                onChange={(e) => setPortfolioData({ ...portfolioData, location: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Website/GitHub</label>
              <input
                type="text"
                value={portfolioData.website}
                onChange={(e) => setPortfolioData({ ...portfolioData, website: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Featured Projects</h3>
          <button className="text-indigo-600 font-semibold">+ Add Project</button>
        </div>
        <div className="space-y-3">
          {portfolioData.projects.map((project, idx) => (
            <div key={idx} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-bold">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.desc}</p>
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                View →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Certificates</h3>
          <button className="text-indigo-600 font-semibold">+ Add Certificate</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {portfolioData.certificates.map((cert, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h4 className="font-bold">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-xs text-gray-500">{cert.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Portfolio Preview</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">See how your portfolio looks to visitors</p>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            👁️ Preview Portfolio
          </button>
        </div>
      </div>

      {/* Analytics (Future Feature) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-2">📊 Portfolio Analytics (Coming Soon)</h4>
        <p className="text-sm text-blue-800">
          Track views, clicks, and engagement on your portfolio to see how recruiters interact with your profile.
        </p>
      </div>
    </div>
  );
}
