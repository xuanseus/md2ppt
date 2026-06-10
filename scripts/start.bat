@echo off
title MD2PPT

:: Check if server is already running
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo MD2PPT is already running at http://localhost:5173
    start http://localhost:5173
    exit
)

echo MD2PPT - http://localhost:5173
echo Close this window to stop the server
powershell -ExecutionPolicy Bypass -File "assets\serve.ps1" -Port 5173
