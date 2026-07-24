import React, { useState, useEffect } from 'react';
import '../styles/StudyTutor.css';
import Footer from './Footer';
import Navbar from './Navbar';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const StudyTutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', text: input }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/study-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        { role: 'tutor', text: data.reply },
      ]);
    } catch (err) {
      console.error('Backend Error:', err);
      setMessages([
        ...updatedMessages,
        { role: 'tutor', text: 'Error connecting to server.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  // Utility function to render tutor responses with proper formatting
  const renderTutorResponse = (text) => {
    const lines = text.split('\n');

    return lines.map((line, idx) => {

      if (line.startsWith('**') && line.endsWith('**')) {
        const heading = line.slice(2, -2).trim();
        return (
          <h3 key={idx} className="tutor-heading">
            {heading}
          </h3>
        );
      }

      // If line starts with a bullet point (•), render as a list item
      if (line.startsWith('•')) {
        return (
          <ul key={idx}>
            <li>{line.slice(1).trim()}</li> {/* Remove the bullet and trim extra spaces */}
          </ul>
        );
      }

      // Render regular text as paragraphs
      return <p key={idx} className="tutor-paragraph">{line.trim()}</p>;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="ai-study-assistant-wrapper">
        <h2 className="ai-tutor-main-title">📘 Study Tutor</h2>

        <div className="conversation-display-area">
          {messages.length === 0 && !loading && (
            <div className="empty-chat-state">
              <h3>👋 Hi there!</h3>
              <p>Ask any question and I’ll help you understand it step by step.</p>
              <p className="empty-chat-hint">
                Try things like:
                <br />• “Explain photosynthesis”
                <br />• “Help me solve this math problem”
                <br />• “Summarize this topic for me”
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.role === 'user' ? 'student-message-bubble' : 'tutor-response-bubble'}
            >
              <strong className="message-sender-label">
                {msg.role === 'user' ? 'You' : 'Tutor'}:
              </strong>

              <div className="message-text-container">
                {msg.role === "tutor" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>

              {msg.role === 'tutor' && (
                <button className="response-copy-action" onClick={() => handleCopy(msg.text)}>
                  📋 Copy
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="tutor-response-bubble">
              <strong className="message-sender-label">Tutor:</strong>
              <div className="message-text-container">
                <p className="typing-indicator-text">typing...</p>
              </div>
            </div>
          )}
        </div>


        <div className="user-input-controls">
          <input
            className="question-input-field"
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-message-btn" onClick={handleSend}>Send</button>
          <button className="clear-chat-btn" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <br /><br /><br /><br />
      <Navbar />
      <Footer />
    </div>
  );
};

export default StudyTutor;