# Social Login Authentication System - High Level Diagram

## System Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   OAuth         │
│   (React)       │◄──►│   (Express.js)   │◄──►│   Providers     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Complete Authentication Flow

### 1. Initial Login Request
```
User clicks "Continue with [Provider]" 
    ↓
Frontend stores provider in localStorage
    ↓
Redirects to OAuth provider's authorization URL
```

### 2. OAuth Provider Authorization
```
OAuth Provider (Google/GitHub)
    ↓
User authenticates & grants permissions
    ↓
Provider redirects back with authorization code
    ↓
Frontend receives code in URL parameters
```

### 3. Backend Token Exchange
```
Frontend sends code + redirectUri to backend
    ↓
Backend exchanges code for access token
    ↓
Backend fetches user profile from OAuth provider
    ↓
Backend generates JWT token
    ↓
Backend sets JWT in HTTP-only cookie
    ↓
Backend returns user data to frontend
```

### 4. Authentication State Management
```
Frontend receives user data
    ↓
Calls onLoginSuccess(user)
    ↓
Redirects to Dashboard
    ↓
JWT stored in HTTP-only cookie for subsequent requests
```

## Detailed Flow Diagrams

### Google OAuth Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │  Frontend   │    │   Google    │    │   Backend   │
│             │    │             │    │   OAuth     │    │             │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │                  │
      │ 1. Click Login  │                  │                  │
      │────────────────►│                  │                  │
      │                  │                  │                  │
      │                  │ 2. Redirect to  │                  │
      │                  │ Google Auth URL │                  │
      │                  │────────────────►│                  │
      │                  │                  │                  │
      │                  │ 3. User Auth    │                  │
      │                  │ & Grant Access  │                  │
      │                  │◄─────────────────│                  │
      │                  │                  │                  │
      │                  │ 4. Redirect with│                  │
      │                  │ authorization   │                  │
      │                  │ code            │                  │
      │                  │◄─────────────────│                  │
      │                  │                  │                  │
      │                  │ 5. Send code    │                  │
      │                  │ to backend      │                  │
      │                  │────────────────►│                  │
      │                  │                  │                  │
      │                  │                  │ 6. Exchange code │
      │                  │                  │ for access token│
      │                  │                  │────────────────►│
      │                  │                  │                  │
      │                  │                  │ 7. Get user info │
      │                  │                  │ with access token│
      │                  │                  │────────────────►│
      │                  │                  │                  │
      │                  │                  │ 8. Generate JWT  │
      │                  │                  │ & set cookie    │
      │                  │                  │                  │
      │                  │ 9. Return user  │                  │
      │                  │ data & JWT      │                  │
      │                  │◄─────────────────│                  │
      │                  │                  │                  │
      │ 10. Redirect to │                  │                  │
      │ Dashboard        │                  │                  │
      │◄─────────────────│                  │                  │
```

### GitHub OAuth Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │    │  Frontend   │    │   GitHub    │    │   Backend   │
│             │    │             │    │   OAuth     │    │             │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │                  │
      │ 1. Click Login  │                  │                  │
      │────────────────►│                  │                  │
      │                  │                  │                  │
      │                  │ 2. Redirect to  │                  │
      │                  │ GitHub Auth URL │                  │
      │                  │────────────────►│                  │
      │                  │                  │                  │
      │                  │ 3. User Auth    │                  │
      │                  │ & Grant Access  │                  │
      │                  │◄─────────────────│                  │
      │                  │                  │                  │
      │                  │ 4. Redirect with│                  │
      │                  │ authorization   │                  │
      │                  │ code            │                  │
      │                  │◄─────────────────│                  │
      │                  │                  │                  │
      │                  │ 5. Send code    │                  │
      │                  │ to backend      │                  │
      │                  │────────────────►│                  │
      │                  │                  │                  │
      │                  │                  │ 6. Exchange code │
      │                  │                  │ for access token│
      │                  │                  │────────────────►│
      │                  │                  │                  │
      │                  │                  │ 7. Get user info │
      │                  │                  │ & emails        │
      │                  │                  │────────────────►│
      │                  │                  │                  │
      │                  │                  │ 8. Generate JWT  │
      │                  │                  │ & set cookie    │
      │                  │                  │                  │
      │                  │ 9. Return user  │                  │
      │                  │ data & JWT      │                  │
      │                  │◄─────────────────│                  │
      │                  │                  │                  │
      │ 10. Redirect to │                  │                  │
      │ Dashboard        │                  │                  │
      │◄─────────────────│                  │                  │
```

## Security Features

### JWT Token Management
```
┌─────────────────────────────────────────────────────────────┐
│                    JWT Security Features                    │
├─────────────────────────────────────────────────────────────┤
│ • Stored in HTTP-only cookies (prevents XSS)               │
│ • Secure flag in production (HTTPS only)                   │
│ • SameSite: 'lax' (CSRF protection)                       │
│ • 1-hour expiration                                        │
│ • Server-side secret key validation                        │
└─────────────────────────────────────────────────────────────┘
```

### CORS Configuration
```
┌─────────────────────────────────────────────────────────────┐
│                    CORS Security                          │
├─────────────────────────────────────────────────────────────┤
│ • Origin restricted to specified domain                   │
│ • Credentials: true (allows cookies)                      │
│ • Prevents unauthorized cross-origin requests              │
└─────────────────────────────────────────────────────────────┘
```

## Environment Variables Required

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Backend (.env)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## API Endpoints

### Authentication Routes
```
POST /auth/google     - Google OAuth login
POST /auth/github     - GitHub OAuth login
POST /auth/demo       - Demo login (testing)
GET  /auth/status     - Check authentication status
POST /auth/logout     - Logout user
GET  /auth/test       - Test endpoint
```

## Error Handling

### Common Error Scenarios
```
┌─────────────────────────────────────────────────────────────┐
│                    Error Handling                          │
├─────────────────────────────────────────────────────────────┤
│ • OAuth provider not configured                           │
│ • Invalid authorization code                               │
│ • Network failures during token exchange                  │
│ • JWT token expiration                                    │
│ • Invalid JWT tokens                                      │
│ • CORS violations                                         │
└─────────────────────────────────────────────────────────────┘
```

## State Management Flow

### Frontend State Transitions
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Initial   │    │ Processing  │    │ Success     │    │ Dashboard   │
│   State     │───►│ OAuth Code  │───►│ Login       │───►│   View      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      │ Show login       │ Show loading     │ Redirect to      │ Show user
      │ buttons          │ spinner          │ dashboard        │ dashboard
```

## Data Flow Summary

1. **User Initiation**: User clicks social login button
2. **OAuth Redirect**: Frontend redirects to OAuth provider
3. **Authorization**: User authenticates with provider
4. **Code Return**: Provider returns authorization code
5. **Token Exchange**: Backend exchanges code for access token
6. **Profile Fetch**: Backend gets user profile from provider
7. **JWT Generation**: Backend creates JWT and sets cookie
8. **Success Response**: Frontend receives user data
9. **State Update**: Frontend updates authentication state
10. **Navigation**: User redirected to protected dashboard

## Security Considerations

- **HTTP-only cookies** prevent XSS attacks
- **Secure cookies** in production enforce HTTPS
- **JWT expiration** limits token lifetime
- **CORS restrictions** prevent unauthorized origins
- **Server-side validation** of all OAuth responses
- **Environment variable** protection of sensitive data
