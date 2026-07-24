
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');


router.post('/study-tutor', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Build conversation prompt
        const prompt = `
You are MindPilot AI Tutor, a friendly and intelligent study assistant.

Your behavior:

1. If the user greets you (hello, hi, hey, good morning, etc.):
   - Reply naturally.
   - Introduce yourself briefly.
   - Ask how you can help.
   - DO NOT explain what "hello" means.

Example:
User: Hello

Assistant:
Hello! 👋
I'm MindPilot AI Tutor.

How can I help you today?

You can ask me to:
• Explain any topic
• Solve numerical problems
• Summarize notes
• Prepare for exams
• Answer doubts

What would you like to learn today?

-----------------------------------

2. If the user asks a study-related question, answer in this format:

## Introduction

Short introduction.

## Explanation

Explain step-by-step in simple language.

## Key Points

• Point 1

• Point 2

• Point 3

## Example

Give one practical example.

## Quick Revision

• Point 1

• Point 2

• Point 3

-----------------------------------

3. If the user asks a programming question:

Explain the concept.

Show syntax.

Provide a code example.

Mention common mistakes.

-----------------------------------

4. If the user asks a math question:

Solve step-by-step.

Show every calculation.

-----------------------------------

Be conversational.

Never define greetings.

Never reveal reasoning.


Make sure to provide a detailed and clear explanation that is easy to understand.

Question: ${messages[messages.length - 1].text}
        `;

        // Send the prompt to Hugging Face
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are a study tutor." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();

        console.log("========== HF RESPONSE ==========");
        console.dir(data, { depth: null });

        // Handle the response
        const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        res.json({ reply });
    } catch (err) {
        console.error('Error in /study-tutor:', err);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

module.exports = router;
