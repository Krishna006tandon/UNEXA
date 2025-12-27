@echo off
set SKIP_JDK_VERSION_CHECK=1
set SDK_PATH=C:\Android\Sdk
set PATH=%PATH%;%SDK_PATH%\cmdline-tools\latest\bin;%SDK_PATH%\platform-tools

echo Creating UNEXA_Device...
C:\Android\Sdk\cmdline-tools\latest\bin\avdmanager.bat create avd -n "UNEXA_Device" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force

echo Device created!
pause
