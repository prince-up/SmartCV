import React, { useState } from 'react';

export default function SkillTracker() {
  const [skills, setSkills] = useState([
    { id: 1, name: 'React.js', progress: 80, goal: 'Master advanced hooks', status: 'In Progress' },
    { id: 2, name: 'Python', progress: 60, goal: 'Complete FastAPI course', status: 'In Progress' },
    { id: 3, name: 'Docker', progress: 30, goal: 'Deploy containerized apps', status: 'Started' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', goal: '', progress: 0 });

  const addSkill = () => {
    if (newSkill.name && newSkill.goal) {
      setSkills([
        ...skills,
        { id: Date.now(), ...newSkill, status: 'Started' },
      ]);
      setNewSkill({ name: '', goal: '', progress: 0 });
      setShowAddModal(false);
    }
  };

  const updateProgress = (id, newProgress) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, progress: newProgress } : skill
    ));
  };

  const deleteSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Skill Tracker</h3>
          <p className="text-gray-600">Track your learning journey and update your CV automatically</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Skill Goal
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold">{skill.name}</h4>
                <p className="text-sm text-gray-500">{skill.goal}</p>
              </div>
              <button
                onClick={() => deleteSkill(skill.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold">Progress</span>
                <span className="text-sm font-semibold">{skill.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>

            {/* Update Progress */}
            <input
              type="range"
              min="0"
              max="100"
              value={skill.progress}
              onChange={(e) => updateProgress(skill.id, parseInt(e.target.value))}
              className="w-full"
            />

            {/* Status Badge */}
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  skill.progress >= 80
                    ? 'bg-green-100 text-green-800'
                    : skill.progress >= 50
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {skill.progress >= 80 ? 'Advanced' : skill.progress >= 50 ? 'Intermediate' : 'Beginner'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Skill Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Skill Name (e.g., TypeScript)"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Learning Goal (e.g., Build 3 projects)"
                value={newSkill.goal}
                onChange={(e) => setNewSkill({ ...newSkill, goal: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <div>
                <label className="block text-sm font-semibold mb-2">Initial Progress: {newSkill.progress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.progress}
                  onChange={(e) => setNewSkill({ ...newSkill, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addSkill}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-bold text-blue-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Update progress regularly to keep your CV current</li>
          <li>• Skills above 80% will be highlighted on your resume</li>
          <li>• Add certifications and projects as you complete them</li>
        </ul>
      </div>
    </div>
  );
}
