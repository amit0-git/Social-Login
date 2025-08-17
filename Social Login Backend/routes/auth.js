import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token from cookie
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const generateJWT = (user) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
  return jwt.sign(user, secret, { expiresIn: '1h' });
};

// 🔹 Google Login
router.post('/google', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    // Check if Google credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ 
        error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.' 
      });
    }

    // 1. Get access_token
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenRes.data;

    // 2. Get user info
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { email, name, id } = userRes.data;

    const jwtToken = generateJWT({ id, email, name, provider: 'google' });
    
    // Set token in HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    
    res.json({ success: true, user: { id, email, name, provider: 'google' } });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Google login failed' });
  }
});
// 🔹 GitHub Login
router.post('/github', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    // Check if GitHub credentials are configured
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(500).json({
        error: 'GitHub OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in environment variables.'
      });
    }

    // 1. Exchange code for access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token } = tokenRes.data;

    if (!access_token) {
      return res.status(401).json({ error: 'Failed to obtain GitHub access token' });
    }

    // 2. Get user profile
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const emailRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const primaryEmailObj = emailRes.data.find((e) => e.primary) || emailRes.data[0];
    const email = primaryEmailObj?.email || null;

    const { id, name, login } = userRes.data;

    const jwtToken = generateJWT({
      id,
      email,
      name: name || login, // fallback if no name
      provider: 'github'
    });

    // Set token in HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({
      success: true,
      user: { id, email, name: name || login, provider: 'github' }
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'GitHub login failed' });
  }
});




// Check authentication status without requiring token
router.get('/status', (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const decoded = jwt.verify(token, secret);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.json({ authenticated: false });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth server is working!',
    env: {
      hasGoogleCredentials: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      hasFacebookCredentials: !!(process.env.FB_APP_ID && process.env.FB_APP_SECRET),
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Demo login endpoint for testing without OAuth credentials
router.post('/demo', (req, res) => {
  const demoUser = {
    id: 'demo-user-123',
    email: 'demo@example.com',
    name: 'Demo User',
    provider: 'demo'
  };
  
  const jwtToken = generateJWT(demoUser);
  
  // Set token in HTTP-only cookie
  res.cookie('token', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000 // 1 hour
  });
  
  res.json({ success: true, user: demoUser });
});

export default router;