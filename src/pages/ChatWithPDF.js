import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, FileText, AlertCircle, Loader2 } from 'lucide-react';
import '../styles/ChatWithPDF.css';
import Footer from './Footer';
import Navbar from './Navbar';

const QuantumNexusInterface = () => {
    // State variables with quantum prefix
    const [quantumPdfFile, setQuantumPdfFile] = useState(null);
    const [quantumPdfText, setQuantumPdfText] = useState('');
    const [quantumIsProcessing, setQuantumIsProcessing] = useState(false);
    const [quantumMessages, setQuantumMessages] = useState([]);
    const [quantumCurrentQuery, setQuantumCurrentQuery] = useState('');
    const [quantumIsLoading, setQuantumIsLoading] = useState(false);
    const [quantumApiError, setQuantumApiError] = useState('');
    const [quantumIsExpanded, setQuantumIsExpanded] = useState(false);


    const quantumFileInputRef = useRef(null);
    const quantumMessagesEndRef = useRef(null);
    const quantumMessageContainerRef = useRef(null);

    const isUserNearBottom = () => {
        const el = quantumMessageContainerRef.current;
        if (!el) return false;

        return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    };

    const quantumScrollToBottom = () => {
        quantumMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    // PDF text extraction (unchanged functionality)
    const quantumExtractTextFromPDF = async (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = async function () {
                try {
                    if (!window.pdfjsLib) {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                        document.head.appendChild(script);

                        script.onload = () => {
                            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                            quantumExtractPDFText();
                        };
                    } else {
                        quantumExtractPDFText();
                    }

                    async function quantumExtractPDFText() {
                        try {
                            const typedarray = new Uint8Array(fileReader.result);
                            const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
                            let fullText = '';

                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const textContent = await page.getTextContent();

                                let pageText = '';
                                let lastY = null;
                                let lastX = null;

                                textContent.items.forEach((item, index) => {
                                    const currentY = item.transform[5];
                                    const currentX = item.transform[4];

                                    if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                                        pageText += '\n';
                                    }
                                    else if (lastX !== null && currentX - lastX > 50) {
                                        pageText += '   ';
                                    }
                                    else if (lastX !== null && currentX - lastX > 20 && item.str.match(/^[•·▪▫◦‣⁃]/)) {
                                        pageText += '\n• ';
                                    }
                                    else if (lastY !== null && Math.abs(currentY - lastY) <= 5 && lastX !== null && currentX - lastX > 5) {
                                        pageText += ' ';
                                    }

                                    pageText += item.str;
                                    lastY = currentY;
                                    lastX = currentX + item.width;
                                });

                                fullText += `\n--- Page ${i} ---\n${pageText}\n`;
                            }

                            fullText = fullText
                                .replace(/\n\s*\n\s*\n/g, '\n\n')
                                .replace(/([.!?])\s*\n([A-Z])/g, '$1\n\n$2')
                                .replace(/(\d+\.)\s*\n/g, '\n$1 ')
                                .replace(/([•·▪▫◦‣⁃])\s*\n/g, '\n$1 ')
                                .trim();

                            resolve(fullText);
                        } catch (error) {
                            reject(error);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.readAsArrayBuffer(file);
        });
    };

    const quantumHandleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Please select a valid PDF file');
            return;
        }

        setQuantumPdfFile(file);
        setQuantumIsProcessing(true);
        setQuantumMessages([]);
        setQuantumApiError('');

        try {
            const extractedText = await quantumExtractTextFromPDF(file);
            setQuantumPdfText(extractedText);
            setQuantumMessages([{
                type: 'system',
                content: `✅ PDF "${file.name}" has been processed successfully!\n\nDocument contains ${Math.round(extractedText.length / 1000)}k characters with preserved formatting.\n\nI can now:\n• Answer specific questions about the content\n• Explain complex concepts from the document\n• Summarize sections or the entire document\n• Extract key points and bullet lists\n• Compare different sections\n\nTry asking: "What are the main points?" or "Explain [specific topic] from the document"`
            }]);
        } catch (error) {
            console.error('Error processing PDF:', error);
            setQuantumMessages([{
                type: 'error',
                content: 'Failed to process PDF. Please ensure the file is not corrupted and try again.'
            }]);
        } finally {
            setQuantumIsProcessing(false);
        }
    };

    const quantumCallBackendAPI = async (question, context) => {
        const response = await fetch("http://localhost:5000/chatWithPDF/pdfchat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question,
                context
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Backend error");
        }

        const data = await response.json();
        return data.answer;
    };

    const quantumHandleQuerySubmit = async () => {
        if (!quantumCurrentQuery.trim()) return;
        if (!quantumPdfText) {
            alert('Please upload a PDF first');
            return;
        }

        const question = quantumCurrentQuery.trim();
        setQuantumCurrentQuery('');
        setQuantumIsLoading(true);
        setQuantumApiError('');

        setQuantumMessages(prev => [...prev, {
            type: 'user',
            content: question
        }]);

        const wasNearBottom = isUserNearBottom();

        try {
            const answer = await quantumCallBackendAPI(question, quantumPdfText);

            setQuantumMessages(prev => [...prev, {
                type: 'assistant',
                content: answer
            }]);

            setQuantumIsExpanded(true);

            setTimeout(() => {
                if (wasNearBottom) {
                    quantumScrollToBottom();
                }
            }, 60);

        } catch (error) {
            console.error('Error generating answer:', error);
            setQuantumApiError(error.message);
            setQuantumMessages(prev => [...prev, {
                type: 'error',
                content: `Error: ${error.message}`
            }]);
        } finally {
            setQuantumIsLoading(false);
        }
    };


    const quantumHandleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            quantumHandleQuerySubmit();
        }
    };

    const quantumClearConversation = () => {
        setQuantumMessages(quantumPdfFile ? [{
            type: 'system',
            content: `✅ PDF "${quantumPdfFile.name}" is ready. Ask me anything about its content with Nexus AI.`
        }] : []);
        setQuantumApiError('');
    };

    const quantumTriggerFileInput = () => {
        quantumFileInputRef.current.click();
    };

    const renderMessage = (text) => {
        return text.split("\n").map((line, index) => {

            if (line.startsWith("## ")) {
                return <h2 key={index}>{line.replace("## ", "")}</h2>;
            }

            if (line.startsWith("### ")) {
                return <h3 key={index}>{line.replace("### ", "")}</h3>;
            }

            if (line.startsWith("- ") || line.startsWith("• ")) {
                return (
                    <ul key={index}>
                        <li>{line.substring(2)}</li>
                    </ul>
                );
            }

            return <p key={index}>{line}</p>;
        });
    };

    return (
        <div>
            <div className={`quantum-nexus-container ${quantumIsExpanded ? 'expanded' : 'compact'}`}>


                <header className="quantum-nexus-header">
                    <div className="quantum-nexus-logo">
                        <span>QUANTUM NEXUS</span>
                    </div>
                    {quantumMessages.length > 1 && (
                        <button onClick={quantumClearConversation} className="quantum-clear-signal">
                            Clear Conversation
                        </button>
                    )}
                </header>

                <main className="quantum-nexus-main">
                    {/* File Upload Section */}
                    <div className="quantum-input-matrix" onClick={quantumTriggerFileInput} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                        <div className="quantum-input-field" style={{ pointerEvents: 'none' }}>
                            {quantumIsProcessing ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader2 className="pdfchat-spin" size={18} />
                                    <span>Processing PDF with enhanced formatting preservation...</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Upload size={18} />
                                    <span>{quantumPdfFile ? `Click to change: ${quantumPdfFile.name}` : 'Click to upload PDF document'}</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={quantumFileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={quantumHandleFileUpload}
                            className="quantum-file-input"
                        />
                    </div>

                    {quantumPdfFile && (
                        <div className="quantum-file-indicator">
                            <FileText size={16} />
                            <span className="quantum-file-name">{quantumPdfFile.name}</span>
                        </div>
                    )}

                    {/* API Error Alert */}
                    {quantumApiError && (
                        <div className="quantum-error-node quantum-message-node" style={{ marginBottom: '1rem' }}>
                            <div className="quantum-error-avatar quantum-avatar-core">
                                <AlertCircle size={16} />
                            </div>
                            <div className="quantum-message-core">
                                {quantumApiError}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div
                        className="quantum-message-matrix"
                        ref={quantumMessageContainerRef}
                    >
                        {quantumMessages.length === 0 ? (
                            <div className="quantum-ai-node quantum-message-node">
                                <div className="quantum-ai-avatar quantum-avatar-core">
                                    <FileText size={16} />
                                </div>
                                <div className="quantum-message-core">
                                    Welcome to Quantum Nexus. Upload a PDF and ask me anything about it with Nexus AI analysis.
                                    <div className="quantum-message-timestamp">{new Date().toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ) : (
                            quantumMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`quantum-message-node ${message.type === 'user' ? 'quantum-user-node' :
                                        message.type === 'system' ? 'quantum-system-node' :
                                            message.type === 'error' ? 'quantum-error-node' : 'quantum-ai-node'
                                        }`}
                                >
                                    <div className={`quantum-avatar-core ${message.type === 'user' ? 'quantum-user-avatar' :
                                        message.type === 'system' ? 'quantum-system-avatar' :
                                            message.type === 'error' ? 'quantum-error-avatar' : 'quantum-ai-avatar'
                                        }`}>
                                        {message.type === 'user' ? (
                                            <span>U</span>
                                        ) : message.type === 'system' ? (
                                            <FileText size={16} />
                                        ) : message.type === 'error' ? (
                                            <AlertCircle size={16} />
                                        ) : (
                                            <span>AI</span>
                                        )}
                                    </div>
                                    <div className="quantum-message-core">
                                        {renderMessage(message.content)}
                                        <div className="quantum-message-timestamp">
                                            {message.type === 'user' ? 'You' :
                                                message.type === 'system' ? 'System' :
                                                    message.type === 'error' ? 'Error' : 'Nexus AI'} • {new Date().toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}

                        {quantumIsLoading && (
                            <div className="quantum-ai-node quantum-message-node">
                                <div className="quantum-ai-avatar quantum-avatar-core">
                                    <Loader2 className="pdfchat-spin" size={16} />
                                </div>
                                <div className="quantum-message-core">
                                    <div className="quantum-loading-sequence">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <span style={{ marginLeft: '0.5rem' }}>Nexus AI is analyzing the document...</span>
                                    <div className="quantum-message-timestamp">Processing</div>
                                </div>
                            </div>
                        )}

                        <div ref={quantumMessagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="quantum-input-matrix">
                        <textarea
                            value={quantumCurrentQuery}
                            onChange={(e) => setQuantumCurrentQuery(e.target.value)}
                            onKeyDown={quantumHandleKeyPress}
                            placeholder={quantumPdfText ? "Ask detailed questions about the PDF..." : "Upload a PDF first to start analysis"}
                            disabled={!quantumPdfText || quantumIsLoading}
                            className="quantum-input-field"
                            rows="2"
                        />
                        <button
                            type="button"
                            onClick={quantumTriggerFileInput}
                            className="quantum-attach-trigger"
                            aria-label="Attach PDF"
                        >
                            <FileText size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={quantumHandleQuerySubmit}
                            disabled={!quantumPdfText || quantumIsLoading || !quantumCurrentQuery.trim()}
                            className="quantum-send-pulse"
                            aria-label="Send message"
                        >
                            {quantumIsLoading ? (
                                <Loader2 className="pdfchat-spin" size={18} />
                            ) : (
                                <Send size={18} />
                            )}
                        </button>
                    </div>

                </main>


            </div>
            <Navbar />
            <Footer />
        </div>
    );
};

export default QuantumNexusInterface;