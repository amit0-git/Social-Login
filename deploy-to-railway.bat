@echo off
echo ========================================
echo Railway Deployment Helper
echo ========================================
echo.

echo This script will help you deploy to Railway
echo.

echo 1. Make sure you have:
echo    - Railway account at railway.app
echo    - Code pushed to GitHub
echo    - Docker installed locally
echo.

echo 2. Test locally first:
echo    docker-compose up --build
echo.

echo 3. Deploy to Railway:
echo    - Go to railway.app
echo    - Create new project from GitHub
echo    - Deploy backend first
echo    - Then deploy frontend
echo    - Update CORS settings
echo.

echo 4. Set environment variables in Railway:
echo    Backend:
echo    - PORT=5000
echo    - NODE_ENV=production
echo    - JWT_SECRET=your_secret
echo    - CORS_ORIGIN=your_frontend_url
echo.
echo    Frontend:
echo    - VITE_BACKEND_URL=your_backend_url
echo    - VITE_GOOGLE_CLIENT_ID=your_id
echo    - VITE_GITHUB_CLIENT_ID=your_id
echo.

echo 5. Check deployment guide: RAILWAY_DEPLOYMENT.md
echo.

pause
