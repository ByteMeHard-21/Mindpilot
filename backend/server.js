const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { CohereClient } = require('cohere-ai');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const generateQuiz = require("./routes/generateQuiz");
const generateQA = require("./routes/generateQA");
const chatPDF = require("./routes/pdfChat");
const summary = require("./routes/summary");
const StudyTutor = require("./routes/StudyTutor");


// Models
const Room = require('./models/Room');
const User = require('./models/User');

// App Setup
const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'], credentials: true }));
app.use(express.json());

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/rooms', chatRoutes);
app.post("/generate-quiz", generateQuiz);
app.use("/generate-questions", generateQA);
app.use("/chatWithPDF", chatPDF);
app.use("/", summary);
app.use("/", StudyTutor);


// Server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB error:', err));

// Multer Uploads
const upload = multer({ dest: 'uploads/' });


// Summarizer Logic
const CHUNK_SIZE = 5000;

function splitIntoChunks(text, size = CHUNK_SIZE) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
}

async function summarizeChunks(textContent) {
    const chunks = splitIntoChunks(textContent);
    const summaries = [];

    const instruction = `
Please summarize the following text in a structured and detailed format.

1. Use numbered section headings (e.g., 1. Overview, 2. Key Concepts).
2. Use bullet points to list details under each section.
3. Include enough context and maintain paragraph structure where necessary.
`;

    for (const chunk of chunks) {
        try {
            const response = await cohere.summarize({
                text: `${instruction}\n\n${chunk}`,
                length: 'long',
                format: 'paragraph',
                extractiveness: 'low',
            });
            summaries.push(response.summary);
        } catch (err) {
            console.error('Summarization error for a chunk:', err);
            summaries.push('[Error summarizing this chunk]');
        }
    }

    return summaries.join('\n\n');
}


// Chatroom Socket Handler
const socketHandler = require('./socket/socketHandler');
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
