import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  BookOpen,
  Calendar,
  FileText,
  Users,
  Bookmark,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ListCheck,
  BookOpenCheck,
  MessageSquare,
  ScanText
} from 'lucide-react';
import '../styles/Footer.css';
import logo from '../images/logo.png';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const featuresColumn1 = [
    { icon: <ListCheck className="feature-icon" />, title: "Mind Quiz", href: "/quizzes" },
    { icon: <BookOpenCheck className="feature-icon" />, title: "MindQuestions", href: "/ai-chat" },
    { icon: <MessageSquare className="feature-icon" />, title: "Mind Mentor", href: "/planner" }
  ];

  const featuresColumn2 = [
    { icon: <ScanText className="feature-icon" />, title: "Doc Pilot", href: "/summaries" },
    { icon: <Users className="feature-icon" />, title: "Study Chatroom", href: "/chatroom" },
    { icon: <MessageSquare className="feature-icon" />, title: "Chat With PDF", href: "/resources" }
  ];



  const socialLinks = [
    { icon: <Facebook className="social-icon" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="social-icon" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="social-icon" />, href: "#", label: "Instagram" },
    // { icon: <Linkedin className="social-icon" />, href: "#", label: "LinkedIn" },

  ];

  return (
    <footer className={`footer ${isVisible ? 'footer-visible' : ''}`}>
      {/* Animated background elements */}
      <div className="bg-decoration decoration-1"></div>
      <div className="bg-decoration decoration-2"></div>
      <div className="bg-decoration decoration-3"></div>
      <div className="bg-decoration decoration-4"></div>

      {/* Floating particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>

      <div className="footer-content">
        {/* Column 1: First 3 Features */}
        <div className="footer-column column-1">
          <div className="column-header">
            <div className="brand-section">
              <div className="brand-logo">
                <img src={logo} alt="MindPilot Logo" className="logo-img" />
                <h2 className="brand-title">MindPilot</h2>
              </div>
              {/* <p className="brand-description">
                Transform your learning with AI-powered tools and collaborative spaces.
              </p> */}
            </div>
          </div>
          <div className="contact-info">
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>+012 (345) 678 99</span>
            </div>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <span>hello@mindpilot.com</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>New York, USA</span>
            </div>
          </div>
        </div>
        <div className="learning1">


          <h3 className="section-title">Learning Tools</h3>
          <div className="features-section1">

            <div className="features-list">
              {featuresColumn1.map((feature, index) => (
                <a
                  key={index}
                  href={feature.href}
                  className="feature-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <span className="features-title1">{feature.title}</span>
                  <ChevronRight className="chevron-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Next 3 Features */}
        <div className="footer-column column-2">
          <div className="column-header">
            <h3 className="section-title">Study Features</h3>
          </div>

          <div className="features-section1">
            <div className="features-list">
              {featuresColumn2.map((feature, index) => (
                <a
                  key={index}
                  href={feature.href}
                  className="feature-link"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <span className="features-title1">{feature.title}</span>
                  <ChevronRight className="chevron-icon" />
                </a>
              ))}
            </div>
          </div>


        </div>

        {/* Column 3: Company Links */}

        {/* Column 4: Social Media & Additional Info */}
        <div className="footer-column column-4">
          <div className="column-header">
            <h3 className="section-title">Connect With Us</h3>
          </div>

          <div className="social-section">
            <p className="social-desc">Follow us on social media for updates</p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="social-link"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {social.icon}
                  <span className="social-tooltip">{social.label}</span>
                </a>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="copyright-text">
          © 2025 MindPilot. All rights reserved.
        </div>
        {/* <div className="bottom-links">
          <a href="/privacy" className="bottom-link">Privacy</a>
          <a href="/terms" className="bottom-link">Terms</a>
          <a href="/support" className="bottom-link">Support</a>
          <a href="/sitemap" className="bottom-link">Sitemap</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;