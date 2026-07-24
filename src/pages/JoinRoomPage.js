import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';

const JoinRoomPage = ({ onRoomJoined }) => {
    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const joinRoom = async () => {
        if (!roomCode || !username) {
            setMessage("Please enter both room code and name");
            return;
        }

        console.log(">>> About to send POST");

        try {
            const res = await axios.post('http://192.168.1.5:5000/api/rooms/join', {
                code: roomCode.toUpperCase(),
                username,
            });

            console.log(">>> POST success:", res);

            // Debug what's returned:
            console.log("Returned room:", res.data.room);
            console.log("Returned token:", res.data.token);

            const room = res.data.room;
            const token = res.data.token;

            if (!room || !token) {
                setMessage("Invalid room data received from server.");
                return;
            }

            localStorage.setItem(`room_${roomCode}`, JSON.stringify({ room, username, token }));
            setMessage('Joined room successfully');

            navigate(`/chat/${roomCode}`, { state: { username, roomName: room.name } });

        } catch (err) {
            console.error(">>> POST error:", err);
            setMessage(err.response?.data?.error || 'Error joining room');
        }
    };


    return (
        <div className="create-room-container">
            <div className="create-room-card">
                <h2 className="create-room-title">Join Chat Room</h2>

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Room Code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="create-room-input"
                    />
                </div>

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="create-room-input"
                    />
                </div>

                <button onClick={joinRoom} className="create-room-button">
                    Join Room
                </button>

                {message && (
                    <div
                        className={`create-room-message ${message.includes("Error") ? "error" : "success"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );

};

export default JoinRoomPage;