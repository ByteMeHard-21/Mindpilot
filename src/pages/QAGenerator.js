import React, { useState, useEffect } from 'react';
import '../styles/QnaForm.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import Navbar from './Navbar';
import Footer from './Footer';


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const QuestionGenerator = () => {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [marks, setMarks] = useState(2);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setQuestions([]); // Clear old results when new file is selected
  };

  const extractTextFromPDF = async (pdfFile) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const generateQuestions = async () => {
    if (!file) {
      alert("Please upload a PDF file first.");
      return;
    }

    setLoading(true);
    try {
      const pdfText = await extractTextFromPDF(file);

      const limitedText =
        pdfText.length > 6000
          ? pdfText.slice(0, 6000)
          : pdfText;

      const response = await fetch(
        "http://localhost:5000/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: limitedText,
            numQuestions,
            marks,
          }),
        }
      );

      const data = await response.json();
      setQuestions(data.questions || []);

    } catch (err) {
      console.error(err);
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const formatAnswerWithBullets = (answer) => {
    if (!answer) return [];

    // If answer is already an array (best case)
    if (Array.isArray(answer)) {
      return answer.map(point => String(point).trim());
    }

    // If answer is an object, convert to string
    if (typeof answer === "object") {
      return [JSON.stringify(answer)];
    }

    // Ensure it's a string
    const text = String(answer);

    return text
      .split(/\n|•|-|\./)
      .map(point => point.trim())
      .filter(point => point.length > 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="qg-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="question-generator">
          <h2>Question Generator</h2>

          <div className="qg-file-input-wrapper">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="qg-file-input"
              id="pdfFile"
            />
            <label htmlFor="pdfFile" className="qg-file-label">
              📄 {file ? file.name : 'Upload PDF Document'}
            </label>
          </div>

          <div className="controls">
            <div className="qg-control-group">
              <label className="qg-control-label">
                Number of Questions:
              </label>
              <input
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                min="1"
                className="qg-input"
              />
            </div>

            <div className="qg-control-group">
              <label className="qg-control-label">
                Marks per Question:
              </label>
              <select
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="qg-select"
              >
                <option value={1}>1 Mark</option>
                <option value={2}>2 Marks</option>
                <option value={4}>4 Marks</option>
                <option value={6}>5 Marks</option>
                <option value={8}>8 Marks</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="qg-generate-btn"
          >
            {loading ? (
              <span className="qg-loading">Generating Questions...</span>
            ) : (
              'Generate Questions'
            )}
          </button>

          <div className="results">
            {questions.length > 0 && (
              <>
                <h3>Generated Questions & Answers</h3>
                <ul className="qg-questions-list">
                  {questions.map((qa, index) => (
                    <li key={index} className="qg-question-item">
                      <p><strong>Q{index + 1}.</strong> {qa.question}</p>
                      <p><strong>Answer:</strong></p>

                      <ul className="qg-answer">
                        {formatAnswerWithBullets(qa.answer).map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </li>

                  ))}
                </ul>
              </>
            )}
          </div>

        </div>
      </div>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>

      <Navbar />
      <Footer />

    </div>

  );
};

export default QuestionGenerator;