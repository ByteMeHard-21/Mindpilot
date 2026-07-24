const Room = require("../models/Room");

// Create Room
exports.createRoom = async (req, res) => {
    try {
        const { hostName, participantLimit } = req.body;

        if (!hostName || !participantLimit) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        const room = new Room({
            code,
            host: hostName,
            maxParticipants: participantLimit,
            participants: [hostName],
        });

        await room.save();
        res.json({ code });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Join Room
exports.joinRoom = async (req, res) => {
    try {
        const { username, code } = req.body;
        const room = await Room.findOne({ code: code.toUpperCase() });

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        // Check if the user has already joined
        if (room.participants.includes(username)) {
            // If the user has already joined, return the room and token without sending a duplicate notification
            return res.json({
                success: true,
                room,
                token: 'mock-token-123'
            });
        }

        // If room is full, prevent further users from joining
        if (room.participants.length >= room.maxParticipants) {
            return res.status(403).json({ error: "Room is full" });
        }

        // Add user to room
        room.participants.push(username);
        await room.save();

        // Emit notification that the user has joined the room
        // You might want to emit a 'user joined' message here for frontend to handle
        // Emit only if user is actually joining for the first time
        res.json({
            success: true,
            room,
            token: 'mock-token-123'
        });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Leave Room
exports.leaveRoom = async (req, res) => {
    try {
        const { username, code } = req.body;
        const room = await Room.findOne({ code });

        if (!room) return res.status(404).json({ error: "Room not found" });

        room.participants = room.participants.filter((u) => u !== username);
        await room.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error leaving room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Kick User
exports.kickUser = async (req, res) => {
    try {
        const { code, target } = req.body;
        const room = await Room.findOne({ code });

        if (!room) return res.status(404).json({ error: "Room not found" });

        room.participants = room.participants.filter((u) => u !== target);
        await room.save();
        res.json({ success: true });
    } catch (error) {
        console.error("Error kicking user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Rooms by User
exports.getRoomsByUser = async (req, res) => {
    try {
        const { username } = req.params;
        const rooms = await Room.find({ participants: username });
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};