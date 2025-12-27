@echo off
REM Check SDK Installation

echo Checking Android SDK installation...

set SDK_PATH=%USERPROFILE%\AppData\Local\Android\Sdk

echo SDK Path: %SDK_PATH%
echo.

if exist "%SDK_PATH%" (
    echo SDK directory exists
    dir "%SDK_PATH%" /b
) else (
    echo SDK directory NOT found
)

echo.
echo cmdline-tools\latest:
if exist "%SDK_PATH%\cmdline-tools\latest" (
    echo Directory exists
    dir "%SDK_PATH%\cmdline-tools\latest" /b
) else (
    echo Directory NOT found
)

echo.
echo Looking for sdkmanager...
if exist "%SDK_PATH%\cmdline-tools\latest\bin\sdkmanager.bat" (
    echo Found: sdkmanager.bat
) else (
    echo NOT found: sdkmanager.bat
)

echo.
echo Please extract the downloaded ZIP to:
echo %SDK_PATH%\cmdline-tools\latest\
pause
