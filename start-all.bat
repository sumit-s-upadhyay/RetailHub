@echo off
setlocal
echo ===================================================
echo   Starting RetailHub Services (BACKGROUND MODE)
echo ===================================================
echo   NOTE: Services will run in the background. 
echo   Use 'stop-all.bat' to shut them down.
echo ===================================================

set "PROJECT_ROOT=%~dp0"
set "MAVEN_BIN=%PROJECT_ROOT%.tools\apache-maven-3.9.6\bin"
set "PATH=%MAVEN_BIN%;%PATH%"

echo 1. Starting Docker Infrastructure...
docker-compose up -d

echo 2. Launching Services in Background...

:: Function-like approach using PowerShell to start hidden processes
:: We pipe output to log files so you can still debug if needed

powershell -Command "Start-Process cmd -ArgumentList '/c cd crm-service && mvn spring-boot:run > ..\crm.log 2>&1' -WindowStyle Hidden"
echo    [+] CRM Service launched (Logs: crm.log)

powershell -Command "Start-Process cmd -ArgumentList '/c cd oms-service && mvn spring-boot:run > ..\oms.log 2>&1' -WindowStyle Hidden"
echo    [+] OMS Service launched (Logs: oms.log)

powershell -Command "Start-Process cmd -ArgumentList '/c cd notification-service && mvn spring-boot:run > ..\notify.log 2>&1' -WindowStyle Hidden"
echo    [+] Notification Service launched (Logs: notify.log)

powershell -Command "Start-Process cmd -ArgumentList '/c cd payment-service && mvn spring-boot:run > ..\payment.log 2>&1' -WindowStyle Hidden"
echo    [+] Payment Service launched (Logs: payment.log)

powershell -Command "Start-Process cmd -ArgumentList '/c cd inventory-service && mvn spring-boot:run > ..\inventory.log 2>&1' -WindowStyle Hidden"
echo    [+] Inventory Service launched (Logs: inventory.log)

echo 3. Launching Frontend (Visible)...
:: We leave Frontend visible so you can see if Vite acts up, or we can hide it too. 
:: Usually users want to see the Frontend bundler, but I will minimize it to keep it clean.
start /min "Retail Client" cmd /k "cd retail-client && npm run dev"

echo ===================================================
echo   All services running silently!
echo   Open Client: http://localhost:5173
echo ===================================================
pause
