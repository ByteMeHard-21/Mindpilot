import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Navbar from './Navbar';
import '../styles/Dashboard.css';
import logo from '../images/logo.png';
import HomePage from './HomePage';
import ContactUs from './ContactUs';
import Footer from './Footer';
import { Users, MessageSquare, ListCheck, ScanText, BookOpenCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";



const Home = () => {
  const mountRef = useRef(null);

  const features = [
    {
      icon: <ListCheck className="feature-icon" />,
      title: "Mind Quiz",
      description: "Practice multiple-choice questions on various topics to test your knowledge and prepare for exams efficiently.",
      path: "/pages/QuizGeneratorPage",
    },
    {
      icon: <BookOpenCheck className="feature-icon" />,
      title: "MindQuestions",
      description: "Generate customized theory questions from your study material. Choose difficulty, number of questions, and marks",
      path: "/pages/QAGenerator"
    },

    {
      icon: <MessageSquare className="feature-icon" />,
      title: "Mind Mentor",
      description: "Ask anything—from concepts to problems—and get clear, personalized answers from your AI-powered tutor.",
      path: "/pages/StudyTut"
    },
    {
      icon: <ScanText className="feature-icon" />,
      title: "Doc Pilot",
      description: "Upload documents to get concise, intelligent summaries that highlight key concepts.",
      path: "/pages/SummaryGenerator"
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Study Chatrooms",
      description: "Connect with fellow learners, discuss topics, and collaborate in dedicated study rooms for different subjects.",
      path: "/pages/ChatHomePage"
    },
    {
      icon: <MessageSquare className="feature-icon" />,
      title: "Chat With PDF",
      description: "Upload any PDF and ask questions directly. Let AI explain or find answers from your study material.",
      path: "/pages/ChatWithPDF"
    },
  ];

  useEffect(() => {
    const currentMount = mountRef.current;
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);

    // SOLUTION: Create renderer without appending to DOM immediately
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: undefined // Don't auto-create canvas
    });

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setClearColor(0x000000, 0);

    // IMPORTANT: Always append the canvas to mountRef
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Rest of your Three.js code remains the same...
    // Create AI Robot
    const loader = new GLTFLoader();

    let studentModel;

    loader.load("/model.glb", (gltf) => {

      studentModel = gltf.scene;

      // Compute model size
      const box = new THREE.Box3().setFromObject(studentModel);

      const size = new THREE.Vector3();
      box.getSize(size);

      const center = new THREE.Vector3();
      box.getCenter(center);

      // Center model
      studentModel.position.sub(center);

      // Scale automatically
      const maxDimension = Math.max(size.x, size.y, size.z);

      const desiredSize = 3.5;

      const scale = desiredSize / maxDimension;

      studentModel.scale.setScalar(scale);

      scene.add(studentModel);

    });

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    controls.enablePan = false;

    controls.enableZoom = false;   // Hero section usually looks cleaner

    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    controls.minPolarAngle = Math.PI / 2.4;
    controls.maxPolarAngle = Math.PI / 1.8;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xE1E2E1, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x34495E, 0.5);
    pointLight.position.set(-5, 0, 5);
    scene.add(pointLight);

    camera.position.set(0, 0.6, 4.8);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      controls.update();

      renderer.render(scene, camera);
    };

    animate();
    // Remove duplicate canvases - keep the top one
    // Remove duplicate canvases - keep the one with higher z-index or specific position
    setTimeout(() => {
      const allCanvases = document.querySelectorAll('canvas[data-engine="three.js r177"]');
      if (allCanvases.length > 1) {
        // Find the canvas that's positioned higher (lower top value)
        let topCanvas = allCanvases[0];
        let bottomCanvas = allCanvases[1];

        const topCanvasRect = topCanvas.getBoundingClientRect();
        const bottomCanvasRect = bottomCanvas.getBoundingClientRect();

        // Remove the one that's positioned lower (higher top value)
        if (topCanvasRect.top < bottomCanvasRect.top) {
          topCanvas.remove(); // Remove the lower positioned one
        } else {
          bottomCanvas.remove(); // Remove the higher positioned one
        }
      }
    }, 100);
    // IMPROVED CLEANUP
    return () => {
      // Stop animation loop
      if (animate) {
        cancelAnimationFrame(animate);
      }

      // Remove only OUR canvas from mountRef
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Remove any duplicate canvases - keep the top one, remove bottom one
      const allCanvases = document.querySelectorAll('canvas[data-engine="three.js r177"]');
      if (allCanvases.length > 1) {
        // Remove the last canvas (bottom one), keep the first (top one)
        allCanvases[allCanvases.length - 1].remove();
      }

      // Dispose of Three.js resources
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const floatingShapes = [
    { color: 'deep-ocean', size: 'w-20 h-20', position: 'top-20 left-10', delay: '0s' },
    { color: 'midnight-sky', size: 'w-16 h-16', position: 'top-32 right-20', delay: '0.5s' },
    { color: 'moonlight', size: 'w-12 h-12', position: 'bottom-40 left-20', delay: '1s' },
    { color: 'noir', size: 'w-14 h-14', position: 'top-1/2 left-32', delay: '1.5s' },
    { color: 'deep-ocean', size: 'w-10 h-10', position: 'bottom-32 right-32', delay: '2s' }
  ];

  return (
    <div className="hero-container">
      {/* Animated Background Elements */}
      {floatingShapes.map((shape, index) => (
        <div
          key={index}
          className={`floating-shape ${shape.color} ${shape.size} ${shape.position}`}
          style={{
            animationDelay: shape.delay,
            animationDuration: '3s'
          }}
        />
      ))}

      {/* <h1><center>MindPilot</center></h1> */}
      <div className="brand-logo1">
        {/* Replace this with your actual logo image */}
        <img src={logo} alt="MindPilot Logo" className="logo-icon1" />

      </div>
      {/* Gradient Orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />

      {/* Main Content */}
      <div className="main-content">
        {/* Left Content */}
        <div className="content-left">
          {/* Logo/Brand */}


          {/* Main Heading */}
          <div className="heading-container">

            <h1 className="main-heading">
              <span className="heading-line heading-fade animate-slide-up">Unlock the</span>
              <span className="heading-line heading-bright animate-slide-up delay-200">
                Future
              </span>
              <span className="heading-line heading-fade animate-slide-up delay-400">
                of education with
              </span>
              <span className="heading-line heading-bright animate-slide-up delay-600">
                MindPilot
              </span>
            </h1>
            {/* <p className="main-description animate-fade-in delay-600">
              Experience next-generation learning with AI-powered tutoring, 
              interactive courses, and immersive educational experiences.
            </p> */}
          </div>
        </div>

        {/* Right Side - 3D Robot */}
        <div className="content-right">
          <div
            ref={mountRef}
            style={{
              width: "700px",
              height: "700px"
            }}
          />

        </div>
      </div>





      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h3 className="features-title">
              Powerful Features for Smart Learning
            </h3>
            <p className="features-subtitle">
              Discover how MindPilot's innovative tools can transform your study routine and boost your academic performance.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <Link to={feature.path} key={index} className="feature-card-link">
                <div className="feature-card">
                  <div className="feature-header">
                    <div className="feature-icon-container">
                      {feature.icon}
                    </div>
                    <h4 className="feature-title">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="feature-description">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <HomePage />
      <ContactUs />


      {/* Include Navbar */}
      <Navbar />
      <Footer />

    </div>



  );
};

export default Home;