const axios = require("axios");

function extractJSONArray(text) {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) {
        throw new Error("No JSON array found");
    }
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

        const hfResponse = await axios.post(
            "https://router.huggingface.co/v1/chat/completions",
            {
                model: "deepseek-ai/DeepSeek-V4-Flash",
                messages: [
                    {
                        role: "system",
                        content: "You are a quiz generator. Never reveal your reasoning. Output ONLY the final JSON array."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1500,
                extra_body: {
                    chat_template_kwargs: {
                        enable_thinking: false
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );


        const message = hfResponse.data?.choices?.[0]?.message;

        const rawText = message?.content;

        if (!rawText) {
            console.error("Model response:", message);
            return res.status(500).json({
                error: "Model returned no content.",
                details: message
            });
        }

        const quiz = JSON.parse(extractJSONArray(rawText));

        res.json({ quiz });

    } catch (err) {
        console.error("HF quiz error:", err?.response?.data || err.message);
        res.status(500).json({ error: "Quiz generation failed" });
    }
};

module.exports = generateQuiz;
