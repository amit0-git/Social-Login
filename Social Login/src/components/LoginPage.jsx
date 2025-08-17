import React, { useEffect, useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft, FaApple } from "react-icons/fa";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

// Add CSS animation for spinner
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

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
        <h1 style={styles.title}>Social Sign In</h1>
        <p style={styles.subtitle}>Please sign in to continue</p>
        
        <div style={styles.buttonContainer}>
          <div style={styles.rowContainer}>
            <button 
              onClick={() => handleLogin("google")} 
              style={styles.googleButton}
              disabled={isProcessing}
            >
              <FcGoogle style={styles.icon} />
              Continue with Google
            </button>

            <button
              onClick={() => handleLogin("github")}
              style={styles.githubButton}
              disabled={isProcessing}
            >
              <FaGithub style={styles.icon} />
              Continue with GitHub
            </button>
          </div>

          <div style={styles.rowContainer}>
            <button 
              style={styles.microsoftButton}
              disabled={isProcessing}
            >
              <FaMicrosoft style={styles.icon} />
              Continue with Microsoft
            </button>

            <button
              style={styles.appleButton}
              disabled={isProcessing}
            >
              <FaApple style={styles.icon} />
              Continue with Apple
            </button>
          </div>
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
  rowContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px"
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "white",
    color: "#4285f4",
    border: "2px solid #4285f4",
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
      borderColor: "#1a73e8"
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
  microsoftButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#00a1f1",
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
      backgroundColor: "#0078d4"
    }
  },
  appleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#000",
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
      backgroundColor: "#333"
    }
  },
  icon: {
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px"
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