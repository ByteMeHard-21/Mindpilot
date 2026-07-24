import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import './App.css';
import Dashboard from './pages/Dashboard';
import MindPilotLoader from './MindPilotLoader';
import HomePage from './pages/HomePage';
import MindPilotHomepage from './pages/MindPilotHomePage';
import ChatWithPDF from './pages/ChatWithPDF';
import QuizGeneratorPage from './pages/QuizGeneratorPage';
import StudyTut from "./pages/StudyTut";
import QAGenerator from './pages/QAGenerator';
import SummaryGenerator from "./pages/SummaryGenerator";
import ChatHomePage from './pages/ChatHomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from "./pages/JoinRoomPage";
import ChatRoomPage from './pages/ChatRoomPage';


function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const [currentToken, setCurrentToken] = useState('');

  const handleRoomJoinOrCreate = (room, user, token) => {
    setCurrentRoom(room);
    setCurrentUser(user);
    setCurrentToken(token);
  };
  return (

    <MindPilotLoader>
      <div className="App">

        <Router>
          <Routes>
            <Route path="/" element={<MindPilotHomepage />} />
            <Route path="/pages/AuthPage" element={<AuthPage />} />
            <Route path="/pages/Dashboard" element={<Dashboard />} />
            <Route path="/pages/HomePage" element={<HomePage />} />
            <Route path="/pages/ChatWithPDF" element={<ChatWithPDF />} />
            <Route path="/pages/QuizGeneratorPage" element={<QuizGeneratorPage />} />
            <Route path="/pages/QAGenerator" element={<QAGenerator />} />
            <Route path="/pages/Studytut" element={<StudyTut />} />
            <Route path="/pages/SummaryGenerator" element={<SummaryGenerator />} />
            <Route path="/pages/ChatHomePage" element={<ChatHomePage />} />
            <Route path="/pages/CreateRoomPage" element={<CreateRoomPage onRoomCreated={handleRoomJoinOrCreate} />} />
            <Route path="/pages/JoinRoomPage" element={<JoinRoomPage onRoomJoined={handleRoomJoinOrCreate} />} />
            <Route path="/chat/:code" element={<ChatRoomPage />} />
          </Routes>
        </Router>
      </div>
    </MindPilotLoader>
  );
}

export default App;