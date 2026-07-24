const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    participants: { type: [String], default: [] }  // Array of usernames
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);