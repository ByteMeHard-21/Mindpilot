const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    currentRoom: { type: String }
});

module.exports = mongoose.model('User', UserSchema);