@echo off
echo ===================================================
echo   Stopping RetailHub Services
echo ===================================================

echo 1. Killing Java Processes...
:: Since the windows are hidden, we must kill by process name/details. 
:: This is aggressive but necessary for hidden processes.
taskkill /F /IM java.exe /T >nul 2>&1

echo 2. Killing Node Processes (Frontend)...
taskkill /F /IM node.exe /T >nul 2>&1

echo 3. Stopping Docker Containers...
docker-compose down

echo ===================================================
echo   All Hidden Services Stopped.
echo   (Checks logs *.log if you had issues)
echo ===================================================
pause
