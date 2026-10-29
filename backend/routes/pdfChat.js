const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// Limit context to first N words to keep request size small & avoid TPM limits
function limitWords(text, maxWords = 5000) {
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ");
}

router.post("/pdfchat", async (req, res) => {
    try {
        const { question, context } = req.body;

        if (!question || !context) {
            return res.status(400).json({ error: "Question and document context are required." });
        }

        // Trim context to first 5000 words — keeps context small, avoids rate limits
        const limitedContext = limitWords(context, 5000);
        const wordCount = context.trim().split(/\s+/).length;
        console.log(`Chat with PDF: ${wordCount} words in context, sending ${Math.min(wordCount, 5000)} words`);

        const prompt = `
You are MindPilot PDF Tutor.

You answer questions ONLY using the uploaded document content below.

Rules:
- Never invent information not present in the document.
- If the answer is not found, say: "I couldn't find this information in the uploaded document."
- Explain in simple, clear language.
- Preserve bullet points and numbering from the document.
- Use headings where helpful.
- Quote small relevant parts from the document when useful.

DOCUMENT:
${limitedContext}

QUESTION:
${question}

ANSWER:
`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen/qwen3.8-27b",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert PDF tutor. Answer ONLY using the provided document content."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 2000
            })
        });

        const data = await response.json();
        console.log("========== PDF CHAT RESPONSE ==========");

        if (!response.ok) {
            console.error("API Error:", data.error?.message);
            return res.status(response.status).json({ error: data.error?.message || "API request failed." });
        }

        const answer = data.choices?.[0]?.message?.content?.trim() || "No answer generated.";
        return res.json({ answer });

    } catch (err) {
        console.error("PDF CHAT ROUTE ERROR:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
