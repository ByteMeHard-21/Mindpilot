import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/ChatRoom.css';



const ChatRoomPage = () => {
    const { code } = useParams();            // ✅ Gets code from URL like /chat/:code
    const location = useLocation();          // ✅ Gets state passed via navigate()
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const roomName = location.state?.roomName;
    const username = location.state?.username;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);


    // Function to get formatted current time
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }

        // Create socket connection
        socketRef.current = io("http://localhost:5000");

        // Join room
        socketRef.current.emit('joinRoom', { code, username });

        // Listen for messages
        socketRef.current.on('message', (msg) => {
            const messageWithTime = {
                ...msg,
                timestamp: getCurrentTime()
            };
            setMessages((prev) => [...prev, messageWithTime]);
        });

        socketRef.current.on('notification', (note) => {
            const systemMessage = {
                username: 'System',
                text: note,
                timestamp: getCurrentTime(),
                isSystem: true
            };
            setMessages((prev) => [...prev, systemMessage]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveRoom', { username, roomCode: code });
                socketRef.current.disconnect();   // 🔥 VERY IMPORTANT
            }
        };
    }, [code, username, navigate]);




    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (text.trim() === '') return;

        // Create message with timestamp
        const messageData = {
            code,
            username,
            text: text.trim(),
            timestamp: getCurrentTime()
        };
        socketRef.current.emit('sendMessage', messageData);

        setText('');
    };

    // Function to determine message wrapper class
    const getMessageClass = (msg) => {
        if (msg.isSystem || msg.username === 'System') {
            return 'neural-message-wrapper system-message';
        }
        return msg.username === username
            ? 'neural-message-wrapper user-message-alignment'
            : 'neural-message-wrapper other-message-alignment';
    };

    // Function to render message content
    const renderMessageContent = (msg) => {
        if (msg.isSystem || msg.username === 'System') {
            return (
                <div className="message-content-orb">
                    {msg.text}
                    <div className="message-timestamp">{msg.timestamp}</div>
                </div>
            );
        }

        // For user messages (right side) - don't show username
        if (msg.username === username) {
            return (
                <div className="message-content-orb">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-timestamp">{msg.timestamp}</div>
                </div>
            );
        }

        // For other messages (left side) - show username inside bubble
        return (
            <div className="message-content-orb">
                <div className="username-quantum-tag">{msg.username}</div>
                <div className="message-text">{msg.text}</div>
                <div className="message-timestamp">{msg.timestamp}</div>
            </div>
        );
    };

    return (
        <div className="quantum-nexus-container">
            <h2 className="cosmic-room-title">
                Room: {roomName} {code}
            </h2>


            <div className="holographic-message-display">
                {messages.map((msg, idx) => (
                    <div key={idx} className={getMessageClass(msg)}>
                        {renderMessageContent(msg)}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="futuristic-input-zone">
                <input
                    type="text"
                    className="plasma-message-input"
                    placeholder="Type your message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="quantum-send-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoomPage;