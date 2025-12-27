@echo off
REM Install Android SDK Command-Line Tools

echo Installing Android SDK...

REM Create directories
set SDK_PATH=%USERPROFILE%\AppData\Local\Android\Sdk
if not exist "%SDK_PATH%" mkdir "%SDK_PATH%"
if not exist "%SDK_PATH%\cmdline-tools" mkdir "%SDK_PATH%\cmdline-tools"
if not exist "%SDK_PATH%\cmdline-tools\latest" mkdir "%SDK_PATH%\cmdline-tools\latest"

echo.
echo MANUAL STEP REQUIRED:
echo 1. Download from: https://developer.android.com/studio#command-tools
echo 2. Download "Command line tools only" for Windows
echo 3. Extract ZIP to: %SDK_PATH%\cmdline-tools\latest\
echo.
echo After extraction, run: create_avd.bat
echo.

REM Set environment for current session
set ANDROID_HOME=%SDK_PATH%
set PATH=%PATH%;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools

echo Environment set for current session.
echo ANDROID_HOME: %ANDROID_HOME%
pause
