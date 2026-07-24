import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const ChatHomePage = () => {
    const navigate = useNavigate();

    const goToCreateRoom = () => {
        navigate('/pages/CreateRoomPage');
    };

    const goToJoinRoom = () => {
        navigate('/pages/JoinRoomPage');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <div style={styles.container}>
                <h1 style={styles.title}>Welcome to MindPilot Chat</h1>
                <button style={styles.button} onClick={goToCreateRoom}>Create Room</button>
                <button style={{ ...styles.button, backgroundColor: '#6c63ff' }} onClick={goToJoinRoom}>Join Room</button>
            </div>
            <Navbar />
            <Footer />
        </div>

    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '40px',
        color: '#333',
    },
    button: {
        padding: '15px 30px',
        fontSize: '18px',
        margin: '10px',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#00b894',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    }
};

export default ChatHomePage;