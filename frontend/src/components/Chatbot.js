import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hi! 👋 I\'m your SmartCV assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: '📄', text: 'Analyze my resume', action: 'analyze' },
    { icon: '🎯', text: 'Find job matches', action: 'jobs' },
    { icon: '📚', text: 'Add new skill', action: 'skill' },
    { icon: '💡', text: 'Get CV tips', action: 'tips' }
  ];

  const getBotResponse = async (userMessage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error('AI request failed');
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      // Fallback responses if AI fails
      const message = userMessage.toLowerCase();
      
      if (message.includes('resume') || message.includes('cv')) {
        return 'To analyze your resume, go to the "Resume Analysis" page and upload your CV. I\'ll provide detailed feedback on keywords, formatting, and suggestions! 📄✨';
      } else if (message.includes('skill')) {
        return 'Great! Head to the "Skill Tracker" page to add new skills and track your learning progress. You can set goals and monitor your growth! 📈';
      } else if (message.includes('job')) {
        return 'Looking for jobs? Use the "Job Match" analyzer! Paste a job description and I\'ll show you how well your CV matches and what skills to add. 🎯';
      } else if (message.includes('portfolio')) {
        return 'Want to create your portfolio? Visit the "Portfolio" page to set up your public profile with projects and certificates! 🌐';
      } else if (message.includes('builder')) {
        return 'Use the "AI Resume Builder" to create a professional CV from scratch! Just fill in your details and I\'ll generate a beautiful resume. 🤖';
      } else if (message.includes('tip') || message.includes('help')) {
        return 'Here are some tips:\n• Use action verbs in your experience\n• Quantify achievements (e.g., "Increased sales by 40%")\n• Keep it concise (1-2 pages)\n• Tailor your CV for each job\n• Update regularly! 💡';
      } else if (message.includes('hello') || message.includes('hi')) {
        return 'Hello! 👋 I\'m here to help you build the perfect resume. What would you like to know?';
      } else if (message.includes('thank')) {
        return 'You\'re welcome! Feel free to ask me anything about SmartCV. Happy to help! 😊';
      } else {
        return 'I can help you with:\n• Resume analysis\n• Skill tracking\n• Job matching\n• Portfolio creation\n• CV building tips\n\nWhat would you like to know more about?';
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentInput = input;
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getBotResponse(currentInput);
      const botResponse = {
        type: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action) => {
    const actionMessages = {
      analyze: 'How do I analyze my resume?',
      jobs: 'Help me find matching jobs',
      skill: 'I want to add a new skill',
      tips: 'Give me CV improvement tips'
    };

    const message = actionMessages[action];
    const userMessage = {
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const responseText = await getBotResponse(message);
      const botResponse = {
        type: 'bot',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="chat-badge">AI</span>}
      </button>

      {/* Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <h4>SmartCV Assistant</h4>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              {msg.type === 'bot' && <div className="message-avatar">🤖</div>}
              <div className="message-content">
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
              {msg.type === 'user' && <div className="message-avatar">👤</div>}
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="chatbot-quick-actions">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.action)}
              >
                <span className="quick-action-icon">{action.icon}</span>
                <span className="quick-action-text">{action.text}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={!input.trim()}>
            <span className="send-icon">➤</span>
          </button>
        </div>
      </div>
    </>
  );
}
