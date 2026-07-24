const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fetch = require("node-fetch");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Split long text into chunks
function chunkText(text, size = 5000) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
}

// Extract JSON from model output
function extractJSON(text) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
        throw new Error("No JSON found");
    }

    return JSON.parse(text.substring(start, end + 1));
}

router.post("/summarize", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        // ------------------------
        // Extract text
        // ------------------------

        let extractedText = "";

        const ext = req.file.originalname
            .split(".")
            .pop()
            .toLowerCase();

        if (ext === "pdf") {
            const pdfData = await pdfParse(req.file.buffer);
            extractedText = pdfData.text;
        } else if (ext === "docx") {
            const result = await mammoth.extractRawText({
                buffer: req.file.buffer
            });

            extractedText = result.value;
        } else if (ext === "txt") {
            extractedText = req.file.buffer.toString("utf8");
        } else {
            return res.status(400).json({
                error: "Unsupported file type"
            });
        }

        if (!extractedText.trim()) {
            return res.status(400).json({
                error: "No readable text found in document"
            });
        }

        const chunks = chunkText(extractedText);

        let allSections = [];

        // ------------------------
        // Process each chunk
        // ------------------------

        for (const chunk of chunks) {

            const prompt = `
You are an expert academic document analyzer.

Read the document carefully.

Generate a structured study summary.

Instructions:

- Divide the document into logical sections.
- Each section must contain:
    - title
    - 5-10 important bullet points
- Keep points short.
- Preserve formulas.
- Preserve technical terms.
- Do not invent information.

Return ONLY valid JSON.

Example:

{
  "sections":[
    {
      "title":"Introduction",
      "summary":[
        "Point 1",
        "Point 2"
      ]
    }
  ]
}

DOCUMENT:

${chunk}
`;

            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            {
                                role: "system",
                                content:
                                    "You are an expert academic document summarizer. Return ONLY JSON."
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        temperature: 0.2,
                        max_tokens: 1000
                    })
                }
            );

            const data = await response.json();

            console.log("========== GROQ ==========");
            console.dir(data, { depth: null });

            if (!response.ok) {
                return res.status(response.status).json(data);
            }

            const rawOutput =
                data.choices?.[0]?.message?.content;

            if (!rawOutput) {
                continue;
            }

            try {

                const parsed = extractJSON(rawOutput);

                if (parsed.sections) {
                    allSections.push(...parsed.sections);
                }

            } catch (err) {
                console.log("Invalid JSON returned by model");
            }
        }

        // ------------------------
        // Merge duplicate sections
        // ------------------------

        const merged = {};

        for (const section of allSections) {

            if (!merged[section.title]) {
                merged[section.title] = [];
            }

            merged[section.title].push(...section.summary);
        }

        const finalSections = Object.entries(merged).map(
            ([title, summary]) => ({
                title,
                summary: [...new Set(summary)]
            })
        );

        return res.json({
            sections: finalSections
        });

    } catch (err) {

        console.error("Summarization error:", err);

        return res.status(500).json({
            error: "Failed to summarize document"
        });
    }
});

module.exports = router;