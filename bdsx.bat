@echo off
set cwd=%cd%
cd /D "%~dp0"

if not exist "node_modules" call update.bat
if %errorlevel% neq 0 exit /b %errorlevel%

if not exist "bedrock_server" call update.bat
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo "Error: bdsx requires npm. Please install node.js first" 1>&2
    exit /b %errorlevel%
) 
echo ^> npm i
call npm i

call npm run -s build
if %errorlevel% neq 0 exit /b %errorlevel%

cd bedrock_server
bedrock_server.exe ..
cd /D "%cwd%"
exit /b

:npminstall
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo "Error:bdsx requires npm. Please install node.js first"
    exit /b %errorlevel%
) 
call npm i
exit /b