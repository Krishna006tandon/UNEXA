@echo off
REM Start Android Virtual Device

echo Starting UNEXA_Device...

set SDK_PATH=C:\Android\Sdk
set PATH=%PATH%;%SDK_PATH%\cmdline-tools\latest\bin;%SDK_PATH%\platform-tools;%SDK_PATH%\emulator

REM Start emulator with window
emulator.exe -avd "UNEXA_Device"

echo Device started!
pause
