@echo off
title Iniciar NR-01 Platform
echo ========================================
echo   Iniciando Backend e Frontend...
echo ========================================
cd /d "%~dp0backend"
start "Backend NR-01" cmd /k "npm start"
cd /d "%~dp0frontend"
start "Frontend NR-01" cmd /k "npm run dev"
echo.
echo Backend e Frontend em execução.
echo Acesse: http://localhost:5173
pause