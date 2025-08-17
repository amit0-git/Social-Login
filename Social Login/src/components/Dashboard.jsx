import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const Dashboard = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from backend using the cookie
    axios.get(`${BACKEND}/auth/status`, { withCredentials: true })
      .then(res => {
        if (res.data.authenticated) {
          setUserInfo(res.data.user);
        } else {
          // User is not authenticated, redirect to login
          onLogout();
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user info:', err);
        setLoading(false);
        // If error, redirect to login
        onLogout();
      });
  }, [onLogout]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND}/auth/logout`, {}, { withCredentials: true });
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
      // Still logout locally even if server logout fails
      onLogout();
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome to Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
      
      <div style={styles.userCard}>
        <h2 style={styles.cardTitle}>User Information</h2>
        {userInfo && (
          <div style={styles.userInfo}>
            <div style={styles.infoRow}>
              <strong>Name:</strong> {userInfo.name}
            </div>
            <div style={styles.infoRow}>
              <strong>Email:</strong> {userInfo.email}
            </div>
            <div style={styles.infoRow}>
              <strong>Provider:</strong> {userInfo.provider}
            </div>
            <div style={styles.infoRow}>
              <strong>User ID:</strong> {userInfo.id}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '2rem'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#c82333',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
    }
  },
  userCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto'
  },
  cardTitle: {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '1.5rem',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px'
  },
  userInfo: {
    fontSize: '1.1rem'
  },
  infoRow: {
    margin: '15px 0',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    borderLeft: '4px solid #007bff'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    marginTop: '50px'
  }
};

export default Dashboard; 