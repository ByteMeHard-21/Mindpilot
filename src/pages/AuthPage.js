import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Chrome, Github, Apple, ArrowRight, Brain, BookOpen, MessageSquare, Calendar, Share2, Youtube, Users, ListCheck, FileText, Bookmark, X, ScanText, BookOpenCheck } from 'lucide-react';
import '../styles/AuthPage.css';
import {
  doSignInWithEmailAndPassword,
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
  doSignInWithGitHub,
  doCreateUserWithGoogle
} from '../Firebase/auth';

import { useAuth } from '../Contects/authcontects';
import logo from '../images/logo.png';

const AuthPage = () => {
  const { userLoggedIn } = useAuth()
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // Floating icons data
  const floatingIcons = [
    { Icon: Brain, delay: 0, x: 10, y: 20 },
    { Icon: BookOpen, delay: 1, x: 80, y: 10 },
    { Icon: MessageSquare, delay: 2, x: 20, y: 70 },
    { Icon: Calendar, delay: 0.5, x: 85, y: 60 },
    { Icon: Share2, delay: 1.5, x: 15, y: 45 },
    { Icon: Youtube, delay: 2.5, x: 75, y: 35 },
    { Icon: Users, delay: 3, x: 50, y: 80 }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (isLogin) {
        const userCredential = await doSignInWithEmailAndPassword(formData.email, formData.password);
        console.log('User signed in:', userCredential.user);
        navigate('/pages/Dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const userCredential = await doCreateUserWithEmailAndPassword(formData.email, formData.password);
        console.log('User signed up:', userCredential.user);
        navigate('/pages/Dashboard');
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      if (provider === 'Google') {
        const result = await doSignInWithGoogle();
        console.log('Google login successful:', result.user);
        navigate('/pages/Dashboard');
      }

      else if (provider === 'GitHub') {
        const result = await doSignInWithGitHub();
        console.log('GitHub login successful:', result.user);
        navigate('/pages/Dashboard');
      } else {
        alert('Provider not supported yet');


      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const validateForm = () => {
    if (!formData.email || !formData.password) return false;
    if (!isLogin && (!formData.firstName || !formData.lastName || formData.password !== formData.confirmPassword)) return false;
    return true;
  };

  return (
    <div className="auth-container">
      {/* Animated Background Elements */}
      <div className="background-elements">
        {/* Gradient Orbs */}
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>

        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, delay, x, y }, index) => (
          <div
            key={index}
            className="floating-icon"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${delay}s`
            }}
          >
            <Icon className="icon" />
          </div>
        ))}

        {/* Grid Pattern */}
        <div className="grid-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Side - Branding */}
        <div className="branding-section">
          <div className="branding-content">
            {/* Logo */}
            <img src={logo} alt="MindPilot Logo" className="logo-icon" />

            <div className="brand-text">
              <h1 className="brand-title">MindPilot</h1>
              <p className="brand-description">
                Your AI-powered study companion for organized learning, smart summaries, and collaborative success.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="feature-grid">
              {[
                { icon: ListCheck, text: 'Mind Quiz' },
                { icon: BookOpenCheck, text: 'MindQuestions' },
                { icon: MessageSquare, text: 'Mind Mentor' },
                { icon: ScanText, text: 'Doc Pilot' },
                { icon: Users, text: 'Study Chatrooms' },
                { icon: MessageSquare, text: 'Chat With PDF' },
              ].map(({ icon: Icon, text }, index) => (
                <div
                  key={index}
                  className="feature-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="feature-icon" />
                  <span className="feature-text">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="auth-section">
          <div className="auth-wrapper">
            {/* Mobile Logo */}
            <div className="mobile-logo">
              <div className="mobile-logo-container">
                <Brain className="mobile-logo-icon" />
              </div>
              <h1 className="mobile-brand-title">MindPilot</h1>
            </div>

            {/* Auth Card */}
            <div className="auth-card">
              {/* Tab Switcher */}
              <div className="tab-switcher">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`tab-button ${isLogin ? 'active' : ''}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`tab-button ${!isLogin ? 'active' : ''}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Social Login */}
              <div className="social-login-section">
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="social-button google-button"
                >
                  <Chrome className="social-icon" />
                  <span>Continue with Google</span>
                </button>


              </div>

              {/* Divider */}
              <div className="divider">
                <hr className="divider-line" />
                <span className="divider-text">OR</span>
              </div>

              {/* Form Fields */}
              <div className="form-section">
                {!isLogin && (
                  <div className="name-fields">
                    <div className="input-group">
                      <User className={`input-icon ${focusedField === 'firstName' ? 'focused' : ''}`} />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('firstName')}
                        onBlur={() => setFocusedField('')}
                        className="form-input"
                        required={!isLogin}
                      />
                    </div>
                    <div className="input-group">
                      <User className={`input-icon ${focusedField === 'lastName' ? 'focused' : ''}`} />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('lastName')}
                        onBlur={() => setFocusedField('')}
                        className="form-input"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <Mail className={`input-icon ${focusedField === 'email' ? 'focused' : ''}`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <Lock className={`input-icon ${focusedField === 'password' ? 'focused' : ''}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="input-group">
                    <Lock className={`input-icon ${focusedField === 'confirmPassword' ? 'focused' : ''}`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className="form-input password-input"
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                )}

                {isLogin && (
                  <div className="forgot-password">
                    <button type="button" className="forgot-link">
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !validateForm()}
                  className="submit-button"
                >
                  {isLoading ? (
                    <div className="loading-spinner1"></div>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="submit-icon" />
                    </>
                  )}
                </button>

                {!isLogin && (
                  <p className="terms-text">
                    By signing up, you agree to our{' '}
                    <button className="terms-link">Terms of Service</button>{' '}
                    and{' '}
                    <button className="terms-link">Privacy Policy</button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;