const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

/*
POST /pdfchat

Body:
{
    "question": "...",
    "context": "Extracted PDF text"
}
*/

router.post("/pdfchat", async (req, res) => {
    try {

        const { question, context } = req.body;

        if (!question || !context) {
            return res.status(400).json({
                error: "Question and document context are required."
            });
        }

        const prompt = `

You are MindPilot PDF Tutor.



You answer questions ONLY using the uploaded document.



Rules:



• Never invent information.



• If the answer isn't present, say:



"I couldn't find this information in the uploaded document."



• Explain in simple language.



• Preserve bullet points.



• Preserve numbering.



• Use headings.



• If useful, quote small parts from the document.



• Never mention internal reasoning.



DOCUMENT:

${context}



QUESTION:

${question}



Rules:

- Answer ONLY from the document

- Preserve bullets, numbering, and structure

- If the answer is not present, clearly say so

- Be concise but complete

If answer isn't found inside the document, reply exactly:

"I couldn't find this topic in the uploaded PDF."

ANSWER:
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
                                "You are an expert PDF tutor. Answer ONLY using the provided document."
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

        console.log("========== GROQ RESPONSE ==========");
        console.dir(data, { depth: null });

        if (!response.ok) {
            return res.status(response.status).json({
                error:
                    data.error?.message ||
                    "Groq API request failed."
            });
        }

        const answer =
            data.choices?.[0]?.message?.content?.trim() ||
            "No answer generated.";

        return res.json({
            answer
        });

    } catch (err) {

        console.error("PDF CHAT ROUTE ERROR:", err);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
});

module.exports = router;