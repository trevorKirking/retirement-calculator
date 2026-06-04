@echo off
cd /d "%~dp0\.."
echo Serving the Retirement Planning Dashboard at http://127.0.0.1:4173/
echo Keep this window open while you view the app in Chrome.
"C:\Program Files\nodejs\node.exe" scripts\serve-dist.mjs 4173
pause
