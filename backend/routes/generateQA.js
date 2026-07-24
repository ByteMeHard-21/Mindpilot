const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

function getAnswerInstruction(marks) {
    if (marks === 2) {
        return "Answer in 4 clear bullet points. Keep it short.";
    }
    if (marks === 5) {
        return "Answer in about 10 structured points. Around 75% of a textbook page.";
    }
    if (marks === 8) {
        return "Answer in about 16 detailed points. Full textbook page with examples.";
    }
    return "Answer appropriately.";
}

router.post("/", async (req, res) => {
    const { content, numQuestions, marks } = req.body;

    if (!content) {
        return res.status(400).json({ error: "No content provided" });
    }

    const prompt = `
You are a university-level exam paper setter.

Generate ${numQuestions} questions.
Each question carries ${marks} marks.

Rules:
- Use ONLY the study material
- Generate BOTH question and answer
- ${getAnswerInstruction(marks)}
- Output ONLY valid JSON

IMPORTANT:
- Return ONLY a JSON array.
- Do NOT explain.
- Do NOT think aloud.
- Do NOT include markdown.
- Do NOT write anything before or after the JSON.

Format:
[
  {
    "question": "Question text",
    "answer": "Answer text"
  }
]

Study Material:
${content}
`;

    try {

        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "Qwen/Qwen3.6-35B-A3B",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are an exam paper generator. Never reveal reasoning. Output ONLY valid JSON."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 4000,

                    extra_body: {
                        chat_template_kwargs: {
                            enable_thinking: false
                        }
                    }
                })
            }
        );

        const data = await response.json();


        if (!data.choices) {
            console.error("HF RAW RESPONSE:", data);
            return res.status(500).json({ error: "HF response invalid" });
        }

        const message = data.choices?.[0]?.message;

        const text = message?.content;

        if (!text) {
            return res.status(500).json({
                error: "Model returned no content.",
                details: message
            });
        }

        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");

        const parsed = JSON.parse(text.slice(start, end + 1));

        res.json({ questions: parsed });

    } catch (err) {
        console.error("HF ERROR:", err);
        res.status(500).json({ error: "Failed to generate questions" });
    }
});

module.exports = router;
