@echo off
echo ========================================
echo   Chitti Challenge - Starting Servers
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Chitti Backend" cmd /k "npm run server"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "Chitti Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:3000

echo.
echo Press any key to close this window...
pause > nul
