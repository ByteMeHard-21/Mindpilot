import React, { useState, useEffect } from 'react';
import { ChevronDown, Brain, Sparkles, Zap } from 'lucide-react';

const MindPilotFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleItems, setVisibleItems] = useState([]);

  const faqs = [
    {
      question: "What makes MindPilot different from other learning platforms?",
      answer: "MindPilot doesn't provide pre-made content. Instead, it helps you organize, enhance, and interact with YOUR own learning resources using AI-powered tools, smart summarization, and collaborative features."
    },
    {
      question: "Can I upload my own study materials to MindPilot?",
      answer: "Absolutely! MindPilot allows you to upload documents like PDFs to generate questions, summaries, and interact with the content using AI tools — all in one organized and secure space."
    },
    {
      question: "How does the AI Chat Assistant work?",
      answer: "Our AI assistant can answer questions about your uploaded materials, provide explanations on general topics, help with problem-solving, and guide you through complex concepts—like having a personal tutor available 24/7."
    },
    {
      question: "Can MindPilot generate theory questions from my documents?",
      answer: "Yes! Upload your study material, and MindPilot will generate theory questions based on your selected difficulty, marks, and number of questions — ideal for self-practice and exam preparation."
    },
    {
      question: "Is MindPilot suitable for professionals and entrepreneurs?",
      answer: "Yes! MindPilot is designed for everyone—students, working professionals, CEOs, and lifelong learners. Whether you're preparing for exams or upgrading your skills, MindPilot adapts to your needs."
    },
    {
      question: "How do the Interactive Quizzes work?",
      answer: "Create custom quizzes based on your study materials, or let our AI generate questions from your uploaded content. Perfect for self-assessment and reinforcing learning concepts."
    },
    {
      question: "Can I collaborate with others on MindPilot?",
      answer: "Definitely! Join chatrooms to discuss topics, share insights, collaborate on projects, and even share your progress and summaries on social media platforms."
    },
    {
      question: "What is the Chat with PDF feature?",
      answer: "The Chat with PDF feature allows you to upload any PDF and interact with it using AI. You can ask questions, get explanations, and understand complex topics directly from your study materials."
    },
    {
      question: "Is my data secure on MindPilot?",
      answer: "Yes, we prioritize data security. All your uploaded documents, notes, and personal information are stored securely with encryption, and you maintain full control over your content."
    },
    {
      question: "How do I get started with MindPilot?",
      answer: "Simply sign up, upload your first document, and start exploring! Use features like AI-powered question generation, chat with PDFs, and quizzes to enhance and personalize your learning journey."
    },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      faqs.forEach((_, index) => {
        setTimeout(() => {
          setVisibleItems(prev => [...prev, index]);
        }, index * 150);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <style jsx>{`
        .faq-section {
          background: #0D1B2A;
          padding: 80px 20px;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .faq-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(155, 89, 182, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(46, 204, 113, 0.1) 0%, transparent 50%);
          animation: backgroundShift 20s ease-in-out infinite;
        }

        @keyframes backgroundShift {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 60px;
          opacity: 0;
          animation: fadeInUp 1s ease-out 0.5s forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-title {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3498db, #9b59b6, #2ecc71);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .faq-subtitle {
          font-size: 1.3rem;
          color: #E1E2E1;
          opacity: 0.9;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .faq-item {
          background: #E1E2E1;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
        }

        .faq-item.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .faq-item:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .faq-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3498db, #9b59b6, #2ecc71);
          background-size: 300% 100%;
          animation: gradientSlide 3s ease-in-out infinite;
        }

        @keyframes gradientSlide {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .faq-question {
          padding: 25px 30px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #0D1B2A;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .faq-question:hover {
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.1));
        }

        .faq-icon {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .faq-chevron {
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          color: #3498db;
        }

        .faq-item.open .faq-chevron {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(155, 89, 182, 0.05));
        }

        .faq-answer.open {
          max-height: 200px;
          padding: 0 30px 25px 30px;
        }

        .faq-answer-content {
          color: #34495E;
          font-size: 1rem;
          line-height: 1.7;
          padding-top: 15px;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease 0.2s;
        }

        .faq-answer.open .faq-answer-content {
          opacity: 1;
          transform: translateY(0);
        }

        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-icon {
          position: absolute;
          color: rgba(225, 226, 225, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon:nth-child(1) {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-icon:nth-child(2) {
          top: 20%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-icon:nth-child(3) {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        .floating-icon:nth-child(4) {
          bottom: 20%;
          right: 10%;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @media (max-width: 768px) {
          .faq-title {
            font-size: 2.5rem;
          }
          
          .faq-subtitle {
            font-size: 1.1rem;
          }
          
          .faq-question {
            padding: 20px 20px;
            font-size: 1rem;
          }
          
          .faq-answer.open {
            padding: 0 20px 20px 20px;
          }
        }
      `}</style>

      <div className="floating-icons">
        <Brain className="floating-icon" size={40} />
        <Sparkles className="floating-icon" size={35} />
        <Zap className="floating-icon" size={30} />
        <Brain className="floating-icon" size={45} />
      </div>

      <div className="container">
        <div className="faq-header">
          {/* <h2 className="faq-title">Frequently Asked Questions</h2> */}
          <p className="faq-subtitle">Everything you need to know about MindPilot</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${visibleItems.includes(index) ? 'visible' : ''} ${openIndex === index ? 'open' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-icon">
                  <span>{faq.question}</span>
                </div>
                <ChevronDown className="faq-chevron" size={24} />
              </div>
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <div className="faq-answer-content">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MindPilotFAQ;