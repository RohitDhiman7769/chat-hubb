import './App.css'
import React, { lazy, Suspense, useState, useEffect, useRef, createContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/header/Header';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Feedback from './assets/feedback.png';
// import Snackbar from '@mui/material/Snackbar';
import { SnackbarProvider } from 'notistack';
// Lazy loaded pages
const SinglePersonChat = lazy(() => import('./components/single_person_chat/single-person-chat'));
const RoomChat = lazy(() => import('./components/room_chat/room-chat'));
const Wall = lazy(() => import('./components/wall/wall'));
const WorldChat = lazy(() => import('./components/world_chat/world-chat'));
const Profile = lazy(() => import('./components/profile/profile'));
const Login = lazy(() => import('./components/login/loginComp'));
const SignUp = lazy(() => import('./components/sign_up/sign-up'));
const ForgetPassword = lazy(() => import('./components/forgetPassowrd'));

export const AuthContext = createContext();


const PrivateLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="auth-main">
      <section className="chat_main_section py-4 no-scroll">
        <div className="container-fluid">
          <div className="container">
            <div className="main_form">
              <div className="row form_row">
                <div className="col-lg-12 fom_data">

                  <Header />
                  <div className="children-wrapper">
                    <Suspense fallback={<div className="d-flex justify-content-center">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>}>
                      {children}
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback floating button */}
        <div
          className="feedback-button"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <img style={{ height: "40px", cursor: "pointer" }} src={Feedback} alt="Feedback" title='Feedback' />
        </div>

        {/* Feedback modal */}

        {isOpen && (
          <div className="feedback-modal animate-modal" ref={modalRef}>
            <div className="feedback-header">
              <h4>We value your feedback</h4>
              <span className="close-btn" onClick={() => setIsOpen(false)}>×</span>
            </div>
            <p className="feedback-subtitle">Tell us what you think about your experience.</p>
            <textarea placeholder="Write your feedback..." />
            <button className="submit-btn">Submit Feedback</button>
          </div>
        )}

      </section>
    </div>
  );
};


const PublicLayout = ({ children }) => {
  return (
    <div className="auth-main">
      <Header />  {/* Add Header here */}
      <Suspense fallback={<div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>}>
        {children}
      </Suspense>
    </div>
  )
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('auth_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue = { isLoggedIn, setIsLoggedIn };

  return (
    <Provider store={appStore}>
      <AuthContext.Provider value={contextValue}>
        {/* <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'start', horizontal: 'top' }}> */}
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <BrowserRouter>
            <Routes>
              {/* Private routes */}
              <Route path="/" element={isLoggedIn ? <PrivateLayout><SinglePersonChat /></PrivateLayout> : <Navigate to="/log-in" replace />} />
              <Route path="/home" element={isLoggedIn ? <PrivateLayout><SinglePersonChat /></PrivateLayout> : <Navigate to="/log-in" replace />} />
              <Route path="/room" element={isLoggedIn ? <PrivateLayout><RoomChat /></PrivateLayout> : <Navigate to="/log-in" replace />} />
              <Route path="/world-chat" element={isLoggedIn ? <PrivateLayout><WorldChat /></PrivateLayout> : <Navigate to="/log-in" replace />} />
              <Route path="/wall" element={isLoggedIn ? <PrivateLayout><Wall /></PrivateLayout> : <Navigate to="/log-in" replace />} />
              <Route path="/profile" element={isLoggedIn ? <PrivateLayout><Profile /></PrivateLayout> : <Navigate to="/log-in" replace />} />

              {/* Public routes */}
              <Route path="/log-in" element={<PublicLayout><Login /></PublicLayout>} />
              <Route path="/sign-up" element={<PublicLayout><SignUp /></PublicLayout>} />
              <Route path="/forget-password" element={<PublicLayout><ForgetPassword /></PublicLayout>} />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/log-in"} replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;
