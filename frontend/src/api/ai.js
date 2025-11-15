const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8001";

export async function analyzeResumeWithAI(file, jobDescription = null, targetRole = null) {
  const token = localStorage.getItem("token");
  
  // Create form data for file upload
  const formData = new FormData();
  formData.append('file', file);
  
  if (jobDescription) formData.append('job_description', jobDescription);
  if (targetRole) formData.append('target_role', targetRole);
  
  const response = await fetch(`${API_URL}/api/analyze-resume-affinda`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || "Resume analysis failed");
  }

  const result = await response.json();
  
  // Transform the response to match the expected format in the frontend
  return {
    success: result.success,
    score: result.score ? Math.round(result.score * 100) : null,
    skills: result.skills || [],
    experience: result.experience || [],
    education: result.education || [],
    languages: result.languages || [],
    certifications: result.certifications || [],
    error: result.error
  };
}

export async function getQuickScore(resumeText) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/ai/quick-score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      resume_text: resumeText,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Quick score failed");
  }

  return response.json();
}
