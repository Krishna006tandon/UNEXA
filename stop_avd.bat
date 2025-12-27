@echo off
REM Stop Android Virtual Device

echo Stopping all emulators...

set SDK_PATH=%USERPROFILE%\AppData\Local\Android\Sdk
set PATH=%PATH%;%SDK_PATH%\platform-tools

REM Stop all running emulators
for /f "tokens=1" %%i in ('adb devices 2^>nul ^| findstr "emulator-"') do (
    echo Stopping device: %%i
    adb -s %%i emu kill
)

echo All emulators stopped!
pause
