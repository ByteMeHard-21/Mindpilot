const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/create", chatController.createRoom);
router.post("/join", chatController.joinRoom);
router.post("/leave", chatController.leaveRoom);
router.post("/kick", chatController.kickUser);
router.get("/user/:username", chatController.getRoomsByUser);

module.exports = router;