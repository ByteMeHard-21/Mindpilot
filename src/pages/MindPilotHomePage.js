import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, MessageSquare, Calendar, FileText, Users, Bookmark, ArrowRight, X, User, Lock, ListCheck, ScanText, BookOpenCheck } from 'lucide-react';
import '../styles/MindPilotHomePage.css';
import logo from '../images/logo.png';


const MindPilotHomepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ListCheck className="feature-icon" />,
      title: "Mind Quiz",
      description: "Practice multiple-choice questions on various topics to test your knowledge and prepare for exams efficiently."
    },
    {
      icon: <BookOpenCheck className="feature-icon" />,
      title: "MindQuestions",
      description: "Generate customized theory questions from your study material. Choose difficulty, number of questions, and marks."
    },

    {
      icon: <MessageSquare className="feature-icon" />,
      title: "Mind Mentor",
      description: "Ask anything—from concepts to problems—and get clear, personalized answers from your AI-powered tutor."
    },
    {
      icon: <ScanText className="feature-icon" />,
      title: "Doc Pilot",
      description: "Upload documents to get concise, intelligent summaries that highlight key concepts."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Study Chatrooms",
      description: "Connect with fellow learners, discuss topics, and collaborate in dedicated study rooms for different subjects."
    },
    {
      icon: <MessageSquare className="feature-icon" />,
      title: "Chat With PDF",
      description: "Upload any PDF and ask questions directly. Let AI explain or find answers from your study material."
    },
  ];


  return (
    <div className="mindpilot-app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-section">
            <img src={logo} alt="MindPilot-logo" className="logo-icon"></img>
            <h1 className="logo-text">MindPilot</h1>
          </div>
          <button className="btn1"
            onClick={() => navigate('/pages/AuthPage')}
          >
            <b>Login</b> <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-container1">
          <h2 className="hero-title">
            Your AI-Powered Learning Companion
          </h2>
          <p className="hero-description">
            MindPilot revolutionizes your learning experience with intelligent features designed to accelerate your academic journey. From AI-powered chat assistance to smart study planning, we're here to guide your mind to success.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h3 className="features-title">
              Powerful Features for Smart Learning
            </h3>
            <p className="features-subtitle">
              Discover how MindPilot's innovative tools can transform your study routine and boost your academic performance.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <h4 className="feature-title">
                    {feature.title}
                  </h4>
                </div>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container1">
          <h3 className="cta-title">
            Ready to Elevate Your Learning?
          </h3>
          <p className="cta-description">
            Join thousands of students who are already using MindPilot to achieve their academic goals faster and more efficiently.
          </p>
          <button className="btn1"
            onClick={() => navigate('/pages/AuthPage')}
          ><b>  Get Started Now</b>

          </button>
        </div>
      </section>
    </div>
  );
};

export default MindPilotHomepage;