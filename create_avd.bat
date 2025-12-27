@echo off
REM Create Android Virtual Device - Simple Setup

echo Creating Android Virtual Device...

REM Set Android SDK path
set SDK_PATH=C:\Android\Sdk
set PATH=%PATH%;%SDK_PATH%\cmdline-tools\latest\bin;%SDK_PATH%\platform-tools

REM Check if SDK tools exist
if not exist "%SDK_PATH%\cmdline-tools\latest\bin\sdkmanager.bat" (
    echo ERROR: Android SDK not found!
    echo Please install Android SDK command-line tools first
    echo Download from: https://developer.android.com/studio#command-tools
    echo Extract to: %SDK_PATH%\cmdline-tools\latest\
    pause
    exit /b 1
)

REM Install required packages
echo Installing SDK components...
set SKIP_JDK_VERSION_CHECK=1
sdkmanager.bat "platform-tools" "platforms;android-33" "build-tools;33.0.0"
sdkmanager.bat "system-images;android-33;google_apis;x86_64"

REM Create virtual device
echo Creating virtual device...
avdmanager.bat create avd -n "UNEXA_Device" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force

REM Start emulator
echo Starting emulator...
emulator.exe -avd "UNEXA_Device" -no-window -no-audio

echo.
echo Virtual device created successfully!
echo Device: UNEXA_Device
echo To start manually: emulator.exe -avd UNEXA_Device
pause
