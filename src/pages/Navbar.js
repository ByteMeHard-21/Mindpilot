import React, { useState } from 'react';
import { ListCheck, Users, MessageSquare, House, BookOpenCheck, ScanText } from 'lucide-react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { icon: House, label: 'Home', path: '/' },
    { icon: ListCheck, label: 'Mind Quiz', path: '/pages/QuizGeneratorPage' },
    { icon: BookOpenCheck, label: ' MindQuestions', path: '/pages/QAgenerator' },
    { icon: MessageSquare, label: 'Mind Mentor', path: '/pages/StudyTut' },
    { icon: ScanText, label: 'Doc Pilot', path: '/pages/SummaryGenerator' },
    { icon: Users, label: ' Study ChatRooms', path: '/pages/ChatHomePage' },
    { icon: MessageSquare, label: 'Chat With PDF', path: '/pages/ChatWithPDF' },
  ];


  const handleNavClick = (index) => {
    setActiveIndex(index);
    navigate(navItems[index].path);
  };

  return (
    <div className="navbar-container">
      <div className="navbar-content">
        <div className="nav-items">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => handleNavClick(index)}
              >
                <IconComponent className="nav-icon" />

                {/* Tooltip */}
                <div className="nav-tooltip">
                  {item.label}
                </div>

                {/* Active indicator */}
                {item.active && (
                  <div className="nav-active-indicator" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;