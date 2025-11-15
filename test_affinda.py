import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

# Get JWT token (you'll need to get this after logging in)
JWT_TOKEN = "YOUR_JWT_TOKEN"
RESUME_PATH = "path/to/your/resume.pdf"  # Update this with your resume path

def test_affinda_upload():
    url = "http://localhost:8000/api/analyze-resume-affinda"
    
    # Check if file exists
    if not os.path.exists(RESUME_PATH):
        print(f"Error: File not found at {RESUME_PATH}")
        print("Please update the RESUME_PATH in the script to point to your resume file.")
        return
    
    try:
        with open(RESUME_PATH, 'rb') as f:
            files = {'file': (os.path.basename(RESUME_PATH), f, 'application/pdf')}
            headers = {
                'accept': 'application/json',
                'Authorization': f'Bearer {JWT_TOKEN}'
            }
            
            print(f"Uploading {RESUME_PATH} to Affinda...")
            response = requests.post(url, headers=headers, files=files)
            
            if response.status_code == 200:
                print("\n✅ Success! Resume analysis results:")
                result = response.json()
                
                # Print score
                if 'score' in result and result['score'] is not None:
                    print(f"\n📊 ATS Score: {result['score']}/100")
                
                # Print skills
                if 'skills' in result and result['skills']:
                    print("\n🛠️  Skills:")
                    for skill in result['skills'][:10]:  # Show top 10 skills
                        print(f"- {skill.get('name', 'N/A')} (Experience: {skill.get('experience', 'N/A')})")
                
                # Print experience
                if 'experience' in result and result['experience']:
                    print("\n💼 Experience:")
                    for exp in result['experience'][:3]:  # Show first 3 experiences
                        print(f"- {exp.get('jobTitle', 'N/A')} at {exp.get('company', 'N/A')}")
                
                # Print education
                if 'education' in result and result['education']:
                    print("\n🎓 Education:")
                    for edu in result['education']:
                        print(f"- {edu.get('degree', 'N/A')} at {edu.get('institution', 'N/A')}")
                
            else:
                print(f"\n❌ Error: {response.status_code}")
                print(response.text)
                
    except Exception as e:
        print(f"\n❌ An error occurred: {str(e)}")

if __name__ == "__main__":
    test_affinda_upload()
