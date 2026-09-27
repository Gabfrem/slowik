@echo off
rem Slowik - ouvre l'application dans sa propre fenetre (voir outils\lancer.ps1).
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0outils\lancer.ps1"
if errorlevel 1 start "" "%~dp0index.html"
