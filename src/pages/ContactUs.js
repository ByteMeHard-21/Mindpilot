
import React, { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageType, setMessageType] = useState('');
const [messageText, setMessageText] = useState('');



  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, email, subject, message } = formData;

  // ✅ Check if any field is empty
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    setErrorMessage('Please fill in all fields.');
    setTimeout(() => setErrorMessage(''), 3000); // Auto hide after 3s
    return;
  }

  setIsSubmitting(true);

  // Simulate form submission
emailjs.send(
  'service_z2akr9s',       // e.g., service_xyz123
  'template_bolmrdp',      // e.g., template_abc456
  formData,
  'UDyeHDev3VTqq7bJs'        // e.g., public_XYZ
).then(() => {
  setIsSubmitting(false);
  setMessageType('success');
  setMessageText("Thank you for reaching out! We'll get back to you within 24 hours.");
  setFormData({ name: '', email: '', subject: '', message: '' });
  setSubmitted(true);
  setTimeout(() => setSubmitted(false), 3000);
}).catch(() => {
  setIsSubmitting(false);
  setMessageType('error');
  setMessageText('Something went wrong. Please try again later.');
  setSubmitted(true);
  setTimeout(() => setSubmitted(false), 3000);
});

};


  const styles = {
    contactContainer: {
      minHeight: '100vh',
      background: '#E1E2E1',
      color: '#E1E2E1',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    floatingParticles: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    },
    particle: {
      position: 'absolute',
      width: '4px',
      height: '4px',
      background: 'rgba(225, 226, 225, 0.3)',
      borderRadius: '50%'
    },
    errorMessageBox: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #1B3B6F, #34495E )',
    color: 'white',
    padding: '2rem 3rem',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3)',
    zIndex: 1000,
    textAlign: 'center'
}, formContainer: {
      background: 'white',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(225, 226, 225, 0.1)',
      borderRadius: '20px',
      padding: '3rem',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 2,
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    },
    formTitle: {
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  background: 'linear-gradient(135deg, #1B3B6F, #34495E )', // NEW
  backgroundSize: '200% 200%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color:'#0d1b2a' ,
  textAlign: 'center'
},
    formSubtitle: {
      fontSize: '1rem',
      opacity: 0.8,
      textAlign: 'center',
      marginBottom: '2rem',
      lineHeight: 1.6,
      color: '#0d1b2a'
    },
    formGroup: {
      marginBottom: '1.5rem',
      position: 'relative',
      zIndex: 1
    },
    formLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 500,
      color: '#0d1b2a'
    },
    formInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #0d1b2a',
      borderRadius: '10px',
      background: 'rgba(225, 226, 225, 0.05)',
      color: '#0d1b2a',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)',
      boxSizing: 'border-box'
    },
    formTextarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #0d1b2a',
      borderRadius: '10px',
      background: 'rgba(225, 226, 225, 0.05)',
      color: '#0d1b2a',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)',
      resize: 'vertical',
      minHeight: '120px',
      boxSizing: 'border-box'
    },
    submitBtn: {
      width: '100%',
      padding: '1rem',
      border: 'none',
      borderRadius: '12px',
      backgroundColor: ' #0d1b2a',
      color: 'white' ,
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    successMessage: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
       background: 'linear-gradient(135deg, #1B3B6F, #34495E )',
      color: 'white',
      padding: '2rem 3rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(39, 174, 96, 0.3)',
      zIndex: 1000,
      textAlign: 'center'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const particlePositions = [
    { top: '20%', left: '10%' },
    { top: '50%', left: '80%' },
    { top: '80%', left: '20%' },
    { top: '30%', left: '70%' },
    { top: '60%', left: '15%' },
    { top: '10%', left: '60%' },
    { top: '70%', left: '75%' },
    { top: '40%', left: '5%' }
  ];

  return (
    <div style={styles.contactContainer}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .particle {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .particle:nth-child(1) { animation-delay: 0s; }
        .particle:nth-child(2) { animation-delay: 2s; }
        .particle:nth-child(3) { animation-delay: 4s; }
        .particle:nth-child(4) { animation-delay: 1s; }
        .particle:nth-child(5) { animation-delay: 3s; }
        .particle:nth-child(6) { animation-delay: 1.5s; }
        .particle:nth-child(7) { animation-delay: 2.5s; }
        .particle:nth-child(8) { animation-delay: 3.5s; }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: white !important;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.2);
          transform: translateY(-2px);
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(78, 205, 196, 0.3);
        }
        
        .submit-btn:active {
          transform: translateY(0);
        }
        
        .form-container:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(78, 205, 196, 0.2);
        }
        
        @media (max-width: 768px) {
          .form-container {
            padding: 2rem !important;
            margin: 1rem !important;
          }
          
          .form-title {
            font-size: 2rem !important;
          }
        }
      `}</style>

      <div style={styles.floatingParticles}>
        {particlePositions.map((pos, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              ...styles.particle,
              top: pos.top,
              left: pos.left
            }}
          />
        ))}
      </div>

      <div style={styles.formContainer} className="form-container">
        <h1 style={styles.formTitle}>Contact Us</h1>
        {/* <p style={styles.formSubtitle}>
          Let's start a conversation that transforms your ideas into reality.
        </p> */}

        <div>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.formLabel}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.formInput}
              className="form-input"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.formLabel}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.formInput}
              className="form-input"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="subject" style={styles.formLabel}>Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              style={styles.formInput}
              className="form-input"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="message" style={styles.formLabel}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              style={styles.formTextarea}
              className="form-textarea"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...styles.submitBtn,
              background: isSubmitting ?  '#0d1b2a': submitted ? '#0d1b2a' : '#0d1b2a',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div style={styles.spinner} />
                Sending...
              </>
            ) : submitted ? (
              <>
                <MessageCircle size={20} />
                Message Sent!
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>

      {submitted && (
        <div style={styles.successMessage}>
          <h3>Thank you for reaching out!</h3>
          <p>We'll get back to you within 24 hours.</p>
        </div>
      )}
      {errorMessage && (
  <div style={styles.errorMessageBox}>
    <h3>Submission Error</h3>
    <p>{errorMessage}</p>
  </div>
)}

    </div>
  );
};

export default ContactForm;