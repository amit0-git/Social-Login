import React, { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import axios from 'axios'

const BACKEND = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    // Check if user is already authenticated on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check if server is running
      await axios.get(`${BACKEND}/auth/test`);
      setServerStatus('connected');
      
      // Check authentication status using the new endpoint
      const response = await axios.get(`${BACKEND}/auth/status`, { withCredentials: true });
      
      if (response.data.authenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        // Server is not running
        setServerStatus('disconnected');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        // Other error
        setServerStatus('error');
        setIsAuthenticated(false);
        setUser(null);
        console.log('Auth check error:', err.response?.status, err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        <div>Loading...</div>
        {serverStatus === 'disconnected' && (
          <div style={{ 
            marginTop: '20px', 
            color: '#dc3545',
            fontSize: '1rem',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            ⚠️ Backend server is not running.<br/>
            Please start the server first.
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}

export default App