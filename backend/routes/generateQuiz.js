const fetch = require("node-fetch");

function extractJSONArray(text) {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) throw new Error("No JSON array found");
    return text.slice(start, end + 1);
}

const generateQuiz = async (req, res) => {
    try {
        const { content, difficulty, numQuestions } = req.body;

        if (!content) {
            return res.status(400).json({ error: "No content provided" });
        }

        const prompt = `
Generate ${numQuestions} multiple-choice questions.

Difficulty: ${difficulty}

Rules:
- 4 options per question
- Only one correct answer
- Output ONLY valid JSON array
Do not explain.
Do not think aloud.
Do not include markdown.
Do not include any text before or after the JSON.

Format:
[
  {
    "question": "...",
    "options": ["A","B","C","D"],
    "answer": "A"
  }
]

Text:
${content}
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
                    { role: "system", content: "You are a quiz generator. Output ONLY the final JSON array with no extra text or markdown." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1500
            })
        });

        const data = await response.json();

        console.log("========== GROQ QUIZ RESPONSE ==========");
        console.dir(data, { depth: null });

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || "Groq API request failed."
            });
        }

        const rawText = data.choices?.[0]?.message?.content;

        if (!rawText) {
            return res.status(500).json({ error: "Model returned no content." });
        }

        const quiz = JSON.parse(extractJSONArray(rawText));
        res.json({ quiz });

    } catch (err) {
        console.error("Quiz generation error:", err?.message || err);
        res.status(500).json({ error: "Quiz generation failed" });
    }
};

module.exports = generateQuiz;
