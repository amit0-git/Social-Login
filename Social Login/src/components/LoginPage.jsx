import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const LoginPage = ({ onLoginSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProvider, setProcessingProvider] = useState("");
  const redirectUri = window.location.origin;

  const handleLogin = (provider) => {
    localStorage.setItem("oauth_provider", provider);
    
    const authUrl = {
      google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&access_type=offline`,
      github: `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`,
    };

    window.location.href = authUrl[provider];
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      alert("OAuth error: " + error);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      const provider = localStorage.getItem("oauth_provider");
      if (!provider) {
        alert("OAuth provider not found. Try logging in again.");
        return;
      }

      // Set processing state immediately
      setIsProcessing(true);
      setProcessingProvider(provider);
      
      // Clear the URL immediately to prevent re-processing
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear localStorage
      localStorage.removeItem("oauth_provider");

      // Process the OAuth code
      axios
        .post(
          `${BACKEND}/auth/${provider}`,
          { code, redirectUri },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.data.success) {
            // Immediately call onLoginSuccess to redirect to dashboard
            onLoginSuccess(res.data.user);
          } else {
            setIsProcessing(false);
            setProcessingProvider("");
            alert("Login failed: " + res.data.error);
          }
        })
        .catch((err) => {
          setIsProcessing(false);
          setProcessingProvider("");
          alert("Login failed: " + (err.response?.data?.error || err.message));
        });
    }
  }, [onLoginSuccess, redirectUri]);

  // Show loading state while processing OAuth
  if (isProcessing) {
    return (
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <h2 style={styles.loadingTitle}>Authenticating...</h2>
            <p style={styles.loadingText}>
              Completing {processingProvider} login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Please sign in to continue</p>
        
        <div style={styles.buttonContainer}>
          <button 
            onClick={() => handleLogin("google")} 
            style={styles.googleButton}
            disabled={isProcessing}
          >
            <svg style={styles.icon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleLogin("github")}
            style={styles.githubButton}
            disabled={isProcessing}
          >
            <svg style={styles.icon} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.262.793-.582 0-.288-.01-1.05-.015-2.06-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.305.763-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.403c1.02.005 2.047.137 3 .403 2.29-1.552 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.292 0 .322.192.698.8.58C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  },
  loginCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%"
  },
  title: {
    margin: "0 0 10px 0",
    color: "#333",
    fontSize: "2rem",
    fontWeight: "bold"
  },
  subtitle: {
    margin: "0 0 30px 0",
    color: "#666",
    fontSize: "1rem"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "white",
    color: "#333",
    border: "2px solid #ddd",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
    ":hover": {
      backgroundColor: "#f8f9fa",
      borderColor: "#4285f4"
    }
  },
  githubButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#24292e",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
    ":hover": {
      backgroundColor: "#1b1f23"
    }
  },
  icon: {
    width: "20px",
    height: "20px"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingTitle: {
    margin: "0",
    color: "#333",
    fontSize: "1.5rem"
  },
  loadingText: {
    margin: "0",
    color: "#666",
    fontSize: "1rem"
  }
};

export default LoginPage;