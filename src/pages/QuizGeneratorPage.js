import React, { useState, useEffect } from 'react';
import '../styles/QuizeQna.css';
import axios from 'axios';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import Footer from './Footer';
import Navbar from './Navbar';

pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const QuizGeneratorPage = () => {
    const [fileContent, setFileContent] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [numQuestions, setNumQuestions] = useState(5);
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadedFileName(file.name);


        const extension = file.name.split('.').pop().toLowerCase();
        try {
            if (extension === 'txt') {
                const reader = new FileReader();
                reader.onload = (evt) => setFileContent(evt.target.result);
                reader.readAsText(file);
            } else if (extension === 'pdf') {
                const reader = new FileReader();
                reader.onload = async (evt) => {
                    const typedarray = new Uint8Array(evt.target.result);
                    const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                    let text = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const strings = content.items.map((item) => item.str);
                        text += strings.join(' ') + '\n';
                    }
                    setFileContent(text);
                    console.log("Text:", text);
                };
                reader.readAsArrayBuffer(file);
            } else if (extension === 'docx') {
                const reader = new FileReader();
                reader.onload = async (evt) => {
                    const result = await mammoth.extractRawText({ arrayBuffer: evt.target.result });
                    setFileContent(result.value);
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert('Unsupported file type. Please upload .txt, .pdf, or .docx.');
            }
        } catch (error) {
            console.error('File read error:', error);
            alert('Failed to read file. See console for details.');
        }
    };

    const handleGenerateQuiz = async () => {
        if (!fileContent.trim()) {
            alert("Please upload a file first");
            return;
        }

        setLoading(true);
        setQuiz([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);

        try {
            const limitedContent =
                fileContent.length > 5000
                    ? fileContent.slice(0, 5000)
                    : fileContent;

            const response = await axios.post(
                "http://localhost:5000/generate-quiz",
                {
                    content: limitedContent,
                    difficulty,
                    numQuestions,
                }
            );

            setQuiz(response.data.quiz);
            setGameStarted(true);
        } catch (err) {
            console.error(err);
            alert("Failed to generate quiz");
        } finally {
            setLoading(false);
        }
    };

    const normalize = (str) => str.trim().toLowerCase();

    const getCorrectOptionText = (question) => {
        const answer = normalize(question.answer);

        // Case 1: answer is "a", "b", "c", "d"
        const indexMap = { a: 0, b: 1, c: 2, d: 3 };
        if (indexMap[answer] !== undefined) {
            return normalize(question.options[indexMap[answer]]);
        }

        // Case 2: answer text matches option text
        return answer;
    };

    const handleOptionSelect = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);

        const currentQuestion = quiz[currentQuestionIndex];
        const correctAnswer = getCorrectOptionText(currentQuestion);

        if (normalize(option) === correctAnswer) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex + 1 < quiz.length) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption('');
            } else {
                setShowResult(true);
            }
        }, 800);
    };

    const handleRestart = () => {
        setQuiz([]);
        setFileContent('');
        setDifficulty('easy');
        setNumQuestions(5);
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameStarted(false);
        setShowResult(false);
        setSelectedOption('');
        setUploadedFileName('');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div className="quiz-generator-container-unique">
                <h2 className="quiz-generator-title-unique">Quiz Game</h2>

                {!gameStarted && !loading && (
                    <>
                        <div className="quiz-generator-upload-unique">
                            <label className="custom-upload-box">

                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    hidden
                                    onChange={handleFileUpload}
                                />

                                {uploadedFileName ? (
                                    <div className="upload-content">

                                        <div className="file-icon">
                                            📄
                                        </div>

                                        <div className="file-details">
                                            <div className="file-name">
                                                {uploadedFileName}
                                            </div>

                                            <div className="file-status">
                                                File uploaded successfully
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="upload-content">

                                        <div className="file-icon">
                                            📁
                                        </div>

                                        <div className="file-details">
                                            <div className="file-name">
                                                Drop your file here or click to browse
                                            </div>

                                            <div className="file-status">
                                                PDF, DOCX or TXT
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="quiz-generator-options-unique">
                            <label>Difficulty:</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>

                            <label>Number of Questions:</label>
                            <select
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>

                            <button onClick={handleGenerateQuiz}>Generate & Start</button>
                        </div>
                    </>
                )}

                {loading && <p className="quiz-generator-loading-unique">Generating quiz...</p>}

                {gameStarted && !showResult && quiz.length > 0 && (
                    <div className="quiz-game-question-unique">
                        <p><strong>Q{currentQuestionIndex + 1}:</strong> {quiz[currentQuestionIndex].question}</p>
                        <ul>
                            {quiz[currentQuestionIndex].options.map((opt, idx) => (
                                <li
                                    key={idx}
                                    className={`quiz-option-unique ${selectedOption
                                        ? normalize(opt) === getCorrectOptionText(quiz[currentQuestionIndex])
                                            ? 'correct'
                                            : normalize(opt) === normalize(selectedOption)
                                                ? 'incorrect'
                                                : ''
                                        : ''
                                        }`}


                                    onClick={() => !selectedOption && handleOptionSelect(opt)}
                                >
                                    {opt}
                                </li>
                            ))}
                        </ul>
                        <p>Score: {score}</p>
                    </div>
                )}

                {showResult && (
                    <div className="quiz-result-unique">
                        <h3>Game Over!</h3>
                        <p>Your final score: {score} / {quiz.length}</p>
                        <button onClick={handleRestart}>Restart</button>
                    </div>
                )}
            </div>
            <Navbar />
            <Footer />
        </div>
    );
};

export default QuizGeneratorPage;