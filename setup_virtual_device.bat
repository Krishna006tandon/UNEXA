@echo off
REM Virtual Device Setup without Android Studio for Windows
REM This script sets up an Android virtual device using command-line tools

echo Setting up Android Virtual Device without Android Studio...

REM Check if command-line tools are installed
where sdkmanager >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Android SDK command-line tools not found!
    echo Please download and install Android SDK command-line tools from:
    echo https://developer.android.com/studio#command-tools
    pause
    exit /b 1
)

REM Set ANDROID_HOME if not set
if "%ANDROID_HOME%"=="" (
    set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
    echo Setting ANDROID_HOME to: %ANDROID_HOME%
)

REM Add tools to PATH
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools

REM Install required components
echo Installing required SDK components...
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

REM Create AVD (Android Virtual Device)
echo Creating Android Virtual Device...
avdmanager create avd -n "UNEXA_Device" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force

REM Start the emulator
echo Starting emulator...
start /b emulator -avd "UNEXA_Device" -no-window -no-audio

echo Virtual device setup complete!
echo Device name: UNEXA_Device
echo To start the device manually: emulator -avd UNEXA_Device
pause
