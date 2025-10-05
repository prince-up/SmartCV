const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function analyzeResumeWithAI(resumeText, jobDescription = null, targetRole = null) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/ai/analyze-resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
      target_role: targetRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "AI analysis failed");
  }

  return response.json();
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
