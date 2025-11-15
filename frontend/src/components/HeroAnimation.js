import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroAnimation.css';

export default function HeroAnimation() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fullText = 'Your next job starts here';

  useEffect(() => {
    // Typing animation
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowCursor(false);
          setShowButton(true);
        }, 500);
      }
    }, 80);

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const handleCTAClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  return (
    <div className={`hero-animation-container ${isTransitioning ? 'transitioning' : ''}`}>
      {/* Background with gradient and bokeh */}
      <div className="hero-background">
        <div className="gradient-overlay"></div>
        <div className="bokeh-layer">
          <div className="bokeh bokeh-1"></div>
          <div className="bokeh bokeh-2"></div>
          <div className="bokeh bokeh-3"></div>
          <div className="bokeh bokeh-4"></div>
          <div className="bokeh bokeh-5"></div>
        </div>
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="hero-content">
        {/* Laptop with resume */}
        <div className="laptop-container">
          <div className="laptop-screen">
            <div className="resume-document">
              {/* Profile section */}
              <div className="resume-section profile-section animate-in">
                <div className="profile-headshot pulse-glow"></div>
                <div className="profile-info">
                  <div className="profile-name highlight-text">John Doe</div>
                  <div className="profile-title">Full Stack Developer</div>
                </div>
              </div>

              {/* Skills section */}
              <div className="resume-section skills-section animate-in delay-1">
                <h3 className="section-header highlight-header">Skills</h3>
                <div className="skill-bars">
                  <div className="skill-item">
                    <span className="skill-name">React.js</span>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-name">Python</span>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="skill-item">
                    <span className="skill-name">FastAPI</span>
                    <div className="skill-bar">
                      <div className="skill-fill" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience section */}
              <div className="resume-section experience-section animate-in delay-2">
                <h3 className="section-header highlight-header">Experience</h3>
                <div className="experience-item">
                  <div className="bullet-point pop-in">•</div>
                  <span className="experience-text">Led development of AI-powered applications</span>
                </div>
                <div className="experience-item">
                  <div className="bullet-point pop-in delay-1">•</div>
                  <span className="experience-text">Increased team productivity by 40%</span>
                </div>
                <div className="experience-item">
                  <div className="bullet-point pop-in delay-2">•</div>
                  <span className="experience-text">Mentored 5+ junior developers</span>
                </div>
              </div>

              {/* Tags section */}
              <div className="resume-section tags-section animate-in delay-3">
                <div className="tag-cloud">
                  <span className="tag pop-glow delay-1">JavaScript</span>
                  <span className="tag pop-glow delay-2">TypeScript</span>
                  <span className="tag pop-glow delay-3">Node.js</span>
                  <span className="tag pop-glow delay-4">MongoDB</span>
                  <span className="tag pop-glow delay-5">Docker</span>
                  <span className="tag pop-glow delay-6">AWS</span>
                </div>
              </div>
            </div>
          </div>
          <div className="laptop-base"></div>
        </div>

        {/* Typed headline and CTA */}
        <div className="headline-container">
          <h1 className="typed-headline">
            {typedText}
            {!showButton && <span className={`cursor ${showCursor ? 'visible' : ''}`}>|</span>}
          </h1>
          {showButton && (
            <button
              className="cta-button morph-button"
              onClick={handleCTAClick}
            >
              Open Dashboard
              <span className="button-glow"></span>
            </button>
          )}
        </div>
      </div>

      {/* Transition overlay */}
      {isTransitioning && <div className="transition-overlay"></div>}
    </div>
  );
}
