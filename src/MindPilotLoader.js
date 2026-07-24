import React, { useState, useEffect } from 'react';
import './MindPilotLoader.css';
import logo from './images/logo.png';


const MindPilotLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Initializing MindPilot...",
    "Loading neural networks...",
    "Calibrating algorithms...",
    "Ready to navigate minds..."
  ];

  useEffect(() => {
    // Always show loader on component mount (page load/refresh)
    setIsLoading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 50;
      });
    }, 200);

    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 1500);

    // Handle page refresh/reload
    const handleBeforeUnload = () => {
      setIsLoading(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Handle page visibility change (when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsLoading(false);
        setProgress(0);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div className="mindpilot-loader">
          {/* Background particles */}
          <div className="particles">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={`particle particle-${i % 3}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>

          {/* Grid pattern */}
          <div className="grid-pattern">
            <svg className="grid-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E1E2E1" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Main content */}
          <div className="loader-content">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-wrapper">
                <div className="logo-container">
                  <div className="logo-wrapper">
                    <img src={logo} alt="MindPilot Logo" className="logo-image" />

                  </div>
                </div>
              </div>
            </div>

            {/* Brand name */}
            <div className="brand-container1">
              <h1 className="brand-title">MindPilot</h1>
              <p className="brand-subtitle">Navigate Your Digital Mind</p>
            </div>

            {/* Loading text */}
            <div className="loading-text-container">
              <p className="loading-text">{loadingTexts[currentText]}</p>
            </div>

            {/* Progress bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  <div className="progress-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Progress percentage */}
            <div className="progress-text">
              {Math.round(Math.min(progress, 100))}%
            </div>

            {/* Connection dots */}
            <div className="dots-container">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>

            {/* Glow effect */}
            <div className="glow-effect"></div>
          </div>

          {/* Corner decorations */}
          <div className="corner corner-tl"></div>
          <div className="corner corner-tr"></div>
          <div className="corner corner-bl"></div>
          <div className="corner corner-br"></div>
        </div>
      )}

      {!isLoading && children}
    </>
  );
};

export default MindPilotLoader;