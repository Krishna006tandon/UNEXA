# UNEXA Virtual Device Setup Guide

## Actual Setup Steps Performed

This document contains the exact steps that were successfully executed to create the virtual device.

### Step 1: Initial Script Execution
```bash
# PowerShell command
.\setup_virtual_device.bat
```

**What happened:**
- Script started checking for Android SDK tools
- Found SDK tools in system
- Started downloading required components

### Step 2: SDK Components Installation
The script automatically installed:
- platform-tools
- platforms;android-33  
- build-tools;33.0.0

**Issues encountered:**
- SDK version compatibility warning (version mismatch between tools)
- Download took several minutes

### Step 3: Virtual Device Creation (Manual Fix)
```bash
# Original command failed
avdmanager create avd -n "UNEXA_Device" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force

# Error: Package path is not valid
```

**Solution:**
```bash
# Used available system image
avdmanager create avd -n "UNEXA_Device" -k "system-images;android-34;google_apis_playstore;x86_64" -d "pixel_4" --force
```

### Step 4: Starting the Emulator
```bash
emulator -avd UNEXA_Device
```

**Results:**
- Emulator started successfully
- Boot completed in 215933 ms (~3.5 minutes)
- Device: Android 14 (API 34) with Google Play Store
- Screen: 1080x2280, 440dpi
- GRPC server running on 127.0.0.1:8554

### Step 5: Verification
```bash
# List available devices
emulator -list-avds

# Output showed:
# UNEXA_Device (newly created)
# Other existing devices
```

## Troubleshooting Issues Encountered

### 1. SDK Version Compatibility
**Warning:** Version mismatch between Android Studio and command-line tools
**Impact:** No functional impact, setup continued successfully

### 2. System Image Not Found
**Error:** `system-images;android-33;google_apis;x86_64` not valid
**Solution:** Used `system-images;android-34;google_apis_playstore;x86_64` instead

### 3. ADB Connection Issues
**Warning:** "Unable to connect to adb daemon on port: 5037"
**Resolution:** ADB started automatically after device boot

## Final Device Specifications

- **Device Name:** UNEXA_Device
- **Android Version:** Android 14 (API 34)
- **System Image:** Google APIs Play Store
- **Architecture:** x86_64
- **Device Profile:** Pixel 4
- **Screen Resolution:** 1080 x 2280
- **Screen Density:** 440dpi
- **Boot Time:** ~3.5 minutes

## Commands Used

### Device Management
```bash
# Create device
avdmanager create avd -n "UNEXA_Device" -k "system-images;android-34;google_apis_playstore;x86_64" -d "pixel_4" --force

# Start device
emulator -avd UNEXA_Device

# List devices
emulator -list-avds

# Start with options
emulator -avd UNEXA_Device -no-window -no-audio
```

### ADB Commands
```bash
# Install APK
adb install your-app.apk

# Check device connection
adb devices

# View logs
adb logcat

# Shell access
adb shell
```

## Environment Setup

### Required Environment Variables
```bash
# Windows
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools

# PowerShell
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
$env:PATH = "$env:PATH;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\platform-tools"
```

## Key Success Factors

1. **Patience:** Initial SDK download took several minutes
2. **Flexibility:** Used Android 34 instead of 33 when 33 wasn't available
3. **System Resources:** 8GB+ RAM recommended for smooth operation
4. **Hardware Virtualization:** Must be enabled in BIOS

## Next Steps

Now that the virtual device is running:

1. **Install your app:** `adb install your-app.apk`
2. **Debug:** Use Android Studio's Device Manager or `adb logcat`
3. **Development:** Start building/testing your UNEXA project

## File Locations

- **AVD Config:** `%USERPROFILE%\.android\avd\UNEXA_Device.avd\`
- **SDK Path:** `%USERPROFILE%\AppData\Local\Android\Sdk\`
- **Emulator:** `%USERPROFILE%\AppData\Local\Android\Sdk\emulator\emulator.exe`
