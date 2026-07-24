import React, { useState, useEffect } from 'react';
import '../styles/SummaryGenerator.css';
import Footer from './Footer';
import Navbar from './Navbar';

const Summarizer = () => {
    const [file, setFile] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setSections([]);
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("Please upload a file first!");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/summarize', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setSections(data.sections || []);

        } catch (error) {
            console.error("Error summarizing:", error);
            alert("Failed to summarize. Please try again.");
        }

        setLoading(false);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className="elegant-ai-doc-analyzer-container">
                <div className="elegant-ai-ambient-background"></div>

                <div className="elegant-ai-main-card">
                    <div className="elegant-ai-header-zone">
                        <div className="elegant-ai-title-section">
                            <h1 className="elegant-ai-main-title">Document Intelligence</h1>
                            <p className="elegant-ai-subtitle">Transform your documents into clear, actionable insights</p>
                        </div>
                        <div className="elegant-ai-accent-line"></div>
                    </div>

                    <div className="elegant-ai-upload-section">
                        <div className="elegant-ai-drop-zone">
                            <input
                                type="file"
                                accept=".pdf,.txt,.docx"
                                onChange={handleFileChange}
                                className="elegant-ai-hidden-input"
                                id="elegant-ai-file-selector"
                            />
                            <label htmlFor="elegant-ai-file-selector" className="elegant-ai-upload-interface">
                                <div className="elegant-ai-upload-visual">
                                    <div className="elegant-ai-document-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                            <polyline points="14,2 14,8 20,8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10,9 9,9 8,9" />
                                        </svg>
                                    </div>
                                    <div className="elegant-ai-upload-content">
                                        <h3 className="elegant-ai-upload-title">
                                            {file ? file.name : 'Drop your document here'}
                                        </h3>
                                        <p className="elegant-ai-upload-description">
                                            {file ? 'Ready to analyze' : 'or click to browse files'}
                                        </p>
                                        <div className="elegant-ai-supported-formats">
                                            <span className="elegant-ai-format-tag">PDF</span>
                                            <span className="elegant-ai-format-tag">TXT</span>
                                            <span className="elegant-ai-format-tag">DOCX</span>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="elegant-ai-action-zone">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="elegant-ai-analyze-button"
                        >
                            {loading ? (
                                <div className="elegant-ai-loading-state">
                                    <div className="elegant-ai-spinner"></div>
                                    <span>Analyzing document...</span>
                                </div>
                            ) : (
                                <div className="elegant-ai-ready-state">
                                    <span>Generate Summary</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </div>

                    {sections.length > 0 && (

                        <div className="elegant-ai-results-container">
                            <div className="elegant-ai-results-header">
                                <h2 className="elegant-ai-results-title">Summary</h2>
                                <div className="elegant-ai-completion-badge">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                        <polyline points="22,4 12,14.01 9,11.01" />
                                    </svg>
                                    Complete
                                </div>
                            </div>
                            <div className="elegant-ai-summary-display">
                                <div className="elegant-ai-summary-text">
                                    {sections.map((section, index) => (
                                        <div key={index} style={{ marginBottom: "24px" }}>
                                            <h2 style={{ fontWeight: "700", marginBottom: "8px" }}>
                                                {section.title}
                                            </h2>
                                            <ul style={{ paddingLeft: "20px" }}>
                                                {section.summary.map((point, idx) => (
                                                    <li key={idx} style={{ marginBottom: "6px" }}>
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Navbar />
            <Footer />
        </div>
    );
};

export default Summarizer;


