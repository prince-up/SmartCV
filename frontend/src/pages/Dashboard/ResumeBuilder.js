import React, { useState } from 'react';
import axios from 'axios';

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: 'Prince Yadav',
    email: 'princeyadav76001@gmail.com',
    phone: '+91-7986614646',
    location: 'Mau, Uttar Pradesh, India',
    jobTitle: 'Full Stack Developer',
    linkedin: 'https://www.linkedin.com/in/prince-yadav-4t/',
    github: 'https://github.com/prince-up',
    summary: 'Results-driven Full Stack Developer with expertise in MERN stack development. Proven track record of building scalable web applications with 99.8% session stability and 30% improved database efficiency. Strong problem-solving skills demonstrated through 400+ solved problems on competitive coding platforms.',
    experience: [
      { 
        company: 'Cipher School', 
        role: 'MERN Stack Developer Trainee', 
        duration: 'Jun 2024 - Jul 2024', 
        description: '• Developed responsive and dynamic web applications using React for front-end development\n• Built robust and scalable APIs with NodeJS and Express for efficient server-side logic\n• Utilized MongoDB for efficient data storage and retrieval, ensuring seamless back-end integration\n• Applied best practices for authentication and authorization, enhancing application security' 
      }
    ],
    education: [
      { institution: 'Lovely Professional University', degree: 'Bachelor of Technology', field: 'Computer Science and Engineering', year: 'August 2023 - Present' },
      { institution: 'SMT RAMRATI DEVI SR SEC SCH LALITPUR', degree: 'Intermediate', field: '', year: '2021-2022 (72%)' },
      { institution: 'Modern Hi-Tech Model School', degree: 'Matriculation', field: '', year: '2019-2020 (70%)' }
    ],
    skills: ['C++', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'NodeJS', 'ExpressJS', 'ReactJS', 'MySQL', 'MongoDB', 'Postman', 'Firebase', 'Docker', 'Data Structures', 'Algorithms', 'DBMS', 'Computer Networks', 'Operating Systems'],
    certifications: ['Server-side JavaScript with NodeJS (May 2025)', 'Advanced React (April 2025)', 'Developing Front-End Apps with React (March 2024)', 'Project Management: Foundations and Initiation (March 2025)'],
    projects: [
      { 
        name: 'Online Assessment System', 
        description: '• Engineered a full-stack web application for quiz creation and management with real-time score tracking\n• Implemented JWT authentication achieving 99.8% session stability\n• Optimized MongoDB queries reducing database retrieval times by 30%\n• Integrated Nodemailer for automated email notifications\n• Designed responsive UI using React.js and Tailwind CSS', 
        tech: 'MongoDB, Express.js, React.js, Node.js, Tailwind CSS, JWT',
        duration: 'Aug 2025'
      },
      { 
        name: 'Bookstore Management System', 
        description: '• Utilized Firebase Authentication with 99% login success rate\n• Built user-friendly interface using React\n• Leveraged MongoDB for efficient data storage and retrieval\n• Containerized application using Docker, reducing setup time by 40%', 
        tech: 'NodeJS, Express, ReactJS, MongoDB, Firebase, Docker',
        duration: 'Mar 2024 - May 2024'
      }
    ],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [generatedResume, setGeneratedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', duration: '', description: '' }],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', year: '' }],
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', tech: '' }],
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (idx) => {
    setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== idx) });
  };

  const addCert = () => {
    if (newCert.trim()) {
      setFormData({ ...formData, certifications: [...formData.certifications, newCert.trim()] });
      setNewCert('');
    }
  };

  const removeCert = (idx) => {
    setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== idx) });
  };

  const generateResume = async () => {
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.location || !formData.jobTitle) {
      alert('Please fill in all required fields:\n• Full Name\n• Email\n• Phone\n• Location\n• Job Title');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('You are not logged in. Please log in again.');
        window.location.href = '/login';
        return;
      }
      
      // Transform data to match backend format
      const requestData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location || 'Not specified',
        job_title: formData.jobTitle || 'Professional',
        summary: formData.summary,
        experience: formData.experience.map(exp => ({
          title: exp.role,
          company: exp.company,
          start_date: exp.duration.split('-')[0]?.trim() || '',
          end_date: exp.duration.split('-')[1]?.trim() || 'Present',
          responsibilities: exp.description.split('\n').filter(r => r.trim())
        })),
        education: formData.education.map(edu => ({
          degree: edu.degree,
          field: '',
          institution: edu.institution,
          year: edu.year
        })),
        skills: formData.skills,
        certifications: formData.certifications,
        target_role: formData.jobTitle
      };

      const response = await axios.post('http://localhost:8000/ai/generate-resume', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setGeneratedResume(response.data);
      setShowResume(true);
      setLoading(false);
      
      // Trigger dashboard update
      window.dispatchEvent(new Event('resumeGenerated'));
    } catch (error) {
      console.error('Error generating resume:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error occurred';
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || errorMessage.includes('credentials')) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      
      alert(`Failed to generate resume: ${errorMessage}\n\nPlease check:\n1. Backend is running (http://localhost:8000)\n2. You are logged in\n3. All required fields are filled`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          {['Personal Info', 'Experience', 'Education & Skills', 'Projects'].map((label, idx) => (
            <div key={idx} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300'
                }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className="ml-2 text-sm font-semibold hidden md:block">{label}</span>
              {idx < 3 && <div className="w-12 h-1 bg-gray-300 mx-2 hidden md:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>
          <p className="text-sm text-gray-600 mb-4">Fields marked with <span className="text-red-500">*</span> are required</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Location (City, State, Country)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Job Title (e.g., Full Stack Developer)"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
              <input
                type="text"
                placeholder="LinkedIn Profile URL"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub Profile</label>
              <input
                type="text"
                placeholder="GitHub Profile URL"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <textarea
              placeholder="Professional Summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full p-3 border rounded-lg h-24"
            />
          </div>
        </div>
      )}

      {/* Step 2: Experience */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Work Experience</h3>
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[idx].company = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Role/Position"
                value={exp.role}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[idx].role = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Duration (e.g., Jan 2020 - Present)"
                value={exp.duration}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[idx].duration = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...formData.experience];
                  newExp[idx].description = e.target.value;
                  setFormData({ ...formData, experience: newExp });
                }}
                className="w-full p-2 border rounded h-20"
              />
            </div>
          ))}
          <button onClick={addExperience} className="text-indigo-600 font-semibold">
            + Add Experience
          </button>
        </div>
      )}

      {/* Step 3: Education & Skills */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Education</h3>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg">
                <input
                  type="text"
                  placeholder="Institution Name"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[idx].institution = e.target.value;
                    setFormData({ ...formData, education: newEdu });
                  }}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[idx].degree = e.target.value;
                    setFormData({ ...formData, education: newEdu });
                  }}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[idx].year = e.target.value;
                    setFormData({ ...formData, education: newEdu });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button onClick={addEducation} className="text-indigo-600 font-semibold">
              + Add Education
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Skills</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 p-2 border rounded"
              />
              <button onClick={addSkill} className="bg-indigo-600 text-white px-4 rounded">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeSkill(idx)} className="text-red-600 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Certifications</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a certification"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCert()}
                className="flex-1 p-2 border rounded"
              />
              <button onClick={addCert} className="bg-indigo-600 text-white px-4 rounded">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                  {cert}
                  <button onClick={() => removeCert(idx)} className="text-red-600 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Projects */}
      {step === 4 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Projects</h3>
          {formData.projects.map((proj, idx) => (
            <div key={idx} className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                placeholder="Project Name"
                value={proj.name}
                onChange={(e) => {
                  const newProj = [...formData.projects];
                  newProj[idx].name = e.target.value;
                  setFormData({ ...formData, projects: newProj });
                }}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) => {
                  const newProj = [...formData.projects];
                  newProj[idx].description = e.target.value;
                  setFormData({ ...formData, projects: newProj });
                }}
                className="w-full p-2 border rounded mb-2 h-20"
              />
              <input
                type="text"
                placeholder="Technologies Used"
                value={proj.tech}
                onChange={(e) => {
                  const newProj = [...formData.projects];
                  newProj[idx].tech = e.target.value;
                  setFormData({ ...formData, projects: newProj });
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button onClick={addProject} className="text-indigo-600 font-semibold">
            + Add Project
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={generateResume}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </button>
        )}
      </div>

      {/* Resume Display Modal */}
      {showResume && generatedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowResume(false)}>
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your ATS-Optimized Resume</h2>
                <p className="text-sm mt-1">ATS Score: {generatedResume.ats_score}/100 🎉</p>
              </div>
              <button
                onClick={() => setShowResume(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ATS Tips */}
            <div className="p-6 bg-green-50 border-b">
              <h3 className="font-bold text-green-800 mb-3">✅ ATS Optimization Features:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {generatedResume.ats_tips.map((tip, idx) => (
                  <div key={idx} className="text-sm text-green-700">{tip}</div>
                ))}
              </div>
            </div>

            {/* Resume Preview */}
            <div className="p-6">
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(generatedResume.formatted_html);
                    printWindow.document.close();
                    printWindow.print();
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Resume
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedResume.formatted_html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${formData.fullName.replace(/\s+/g, '_')}_Resume.html`;
                    a.click();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download HTML
                </button>
              </div>

              {/* Resume HTML Preview */}
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatedResume.formatted_html}
                  className="w-full h-[600px] border-0"
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
