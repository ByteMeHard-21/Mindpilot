import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ChatRoom.css';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.css';



const CreateRoomPage = ({ onRoomCreated }) => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [maxUsers, setMaxUsers] = useState(5);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const createRoom = async () => {
        try {
            const response = await axios.post('http://192.168.1.5:5000/api/rooms/create', {
                name: roomName,
                hostName: username,
                participantLimit: maxUsers
            });

            const roomCode = response.data.code;

            localStorage.setItem(`room_${roomCode}`, JSON.stringify({ code: roomCode, username }));

            setMessage(`Room created! Code: ${roomCode}`);


            // ✅ Navigate with state
            navigate(`/chat/${roomCode}`, {
                state: { username, roomName }
            });

        } catch (err) {
            setMessage(err.response?.data?.error || 'Error creating room');
        }
    };



    return (
        <div className="create-room-container">
            <div className="create-room-card">
                <h2 className="create-room-title">Create Chat Room</h2>

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Room Name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
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

                <div className="input-wrapper">
                    <input
                        type="number"
                        placeholder="Max Users"
                        value={maxUsers}
                        onChange={(e) => setMaxUsers(e.target.value)}
                        className="create-room-input"
                    />
                </div>

                <button onClick={createRoom} className="create-room-button">
                    Create Room
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

export default CreateRoomPage;