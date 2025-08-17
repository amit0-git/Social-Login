@echo off
echo Starting Social Login Application...
echo.

echo Starting Backend Server...
cd "Social Login Backend"
start "Backend Server" cmd /k "node server.js"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
cd "..\Social Login"
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher...
pause > nul 