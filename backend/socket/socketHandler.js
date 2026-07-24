const Message = require("../models/Message");

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log("🔌 New socket connected:", socket.id);

        socket.on('joinRoom', ({ code, username }) => {
            socket.join(code);
            socket.to(code).emit('message', {
                username: 'System',
                text: `${username} joined the room.`,
            });
        });

        socket.on('sendMessage', async ({ code, username, text }) => {
            if (!code || !text || !username) return;

            // Optionally save to DB
            try {
                const newMessage = new Message({ roomCode: code, username, text });
                await newMessage.save();
            } catch (err) {
                console.error('Error saving message:', err);
            }

            io.to(code).emit('message', { username, text });
        });

        socket.on("leaveRoom", ({ username, roomCode }) => {
            socket.leave(roomCode);
            socket.to(roomCode).emit("notification", `${username} left the room.`);
        });

        socket.on("disconnecting", () => {
            const rooms = [...socket.rooms];
            rooms.forEach((room) => {
                if (room !== socket.id) {
                    socket.to(room).emit("notification", "A user left the room.");
                }
            });
        });

    });
}

module.exports = socketHandler;
