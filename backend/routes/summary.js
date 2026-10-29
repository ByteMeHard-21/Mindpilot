const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fetch = require("node-fetch");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function extractJSON(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found");
    return JSON.parse(text.substring(start, end + 1));
}

// Limit text to first N words to keep context small & avoid TPM limits
function limitWords(text, maxWords = 5000) {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ");
}

router.post("/summarize", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Extract text from file
        let extractedText = "";
        const ext = req.file.originalname.split(".").pop().toLowerCase();

        if (ext === "pdf") {
            const pdfData = await pdfParse(req.file.buffer);
            extractedText = pdfData.text;
        } else if (ext === "docx") {
            const result = await mammoth.extractRawText({ buffer: req.file.buffer });
            extractedText = result.value;
        } else if (ext === "txt") {
            extractedText = req.file.buffer.toString("utf8");
        } else {
            return res.status(400).json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT." });
        }

        if (!extractedText.trim()) {
            return res.status(400).json({ error: "No readable text found in document" });
        }

        // Only use first 5000 words — keeps context small, avoids rate limits
        const limitedText = limitWords(extractedText, 5000);
        const wordCount = extractedText.trim().split(/\s+/).length;
        const wasTruncated = wordCount > 5000;

        console.log(`Doc Pilot: ${wordCount} words total, sending ${wasTruncated ? 'first 5000' : wordCount} words`);

        const prompt = `
You are an expert academic document analyzer.

Read the document carefully and generate a structured study summary.

Instructions:
- Divide the document into logical sections.
- Each section must have a title and 5-10 important bullet points.
- Keep points short and clear.
- Preserve formulas and technical terms.
- Do not invent information not present in the document.

Return ONLY valid JSON in this exact format, no markdown, no explanation:

{
  "sections": [
    {
      "title": "Section Title",
      "summary": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

DOCUMENT:
${limitedText}
`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY_2}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3.8-27b",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert academic document summarizer. Return ONLY valid JSON with no markdown or explanation."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 3000
            })
        });

        const data = await response.json();
        console.log("========== DOC PILOT RESPONSE ==========");

        if (!response.ok) {
            console.error("API Error:", data.error?.message);
            return res.status(response.status).json({ error: data.error?.message || "API error" });
        }

        const rawOutput = data.choices?.[0]?.message?.content;
        if (!rawOutput) {
            return res.status(500).json({ error: "Model returned no content" });
        }

        try {
            const parsed = extractJSON(rawOutput);
            return res.json({
                sections: parsed.sections || [],
                truncated: wasTruncated,
                message: wasTruncated ? `Document was large (${wordCount} words). Summarized first 5000 words.` : null
            });
        } catch (err) {
            console.error("JSON parse failed:", err.message);
            console.error("Raw output:", rawOutput.substring(0, 500));
            return res.status(500).json({ error: "Failed to parse summary response" });
        }

    } catch (err) {
        console.error("Summarization error:", err);
        return res.status(500).json({ error: "Failed to summarize document" });
    }
});

module.exports = router;
