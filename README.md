# UNEXA

## Virtual Device Setup (Without Android Studio)

This project includes scripts to set up an Android virtual device using command-line tools only, without requiring Android Studio.

### Prerequisites

1. **Android SDK Command-Line Tools**: Download from [Android Developer](https://developer.android.com/studio#command-tools)
2. **Java Development Kit (JDK)**: Version 11 or higher
3. **System Requirements**:
   - Windows 10/11, macOS, or Linux
   - At least 8GB RAM
   - 10GB free disk space

### Quick Setup

#### Windows
```bash
# Run the setup script
setup_virtual_device.bat
```

#### Linux/macOS
```bash
# Make the script executable
chmod +x setup_virtual_device.sh

# Run the setup script
./setup_virtual_device.sh
```

### Manual Setup

1. **Set Environment Variables**:
   ```bash
   # Windows
   set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk
   set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools

   # Linux/macOS
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools
   ```

2. **Install Required Components**:
   ```bash
   sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"
   ```

3. **Download System Image**:
   ```bash
   sdkmanager "system-images;android-33;google_apis;x86_64"
   ```

4. **Create Virtual Device**:
   ```bash
   avdmanager create avd -n "UNEXA_Device" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force
   ```

5. **Start Emulator**:
   ```bash
   emulator -avd "UNEXA_Device"
   ```

### Device Configuration

The virtual device is configured with:
- **Device**: Pixel 4
- **Android Version**: Android 13 (API 33)
- **Architecture**: x86_64
- **RAM**: 4GB
- **Storage**: 6GB
- **Screen**: 1080 x 2280, 440dpi

### Common Commands

```bash
# List available devices
emulator -list-avds

# Start device with specific options
emulator -avd UNEXA_Device -no-window -no-audio

# Delete device
avdmanager delete avd -n UNEXA_Device

# Install APK
adb install your-app.apk

# View device logs
adb logcat
```

### Troubleshooting

**Emulator not starting**:
- Ensure hardware virtualization is enabled in BIOS
- Check if Windows Hypervisor Platform is installed (Windows)
- Verify KVM is installed (Linux)

**SDK not found**:
- Verify ANDROID_HOME environment variable is set correctly
- Ensure command-line tools are in your PATH

**Permission denied** (Linux/macOS):
```bash
chmod +x setup_virtual_device.sh
```

### Files Included

- `setup_virtual_device.bat` - Windows setup script
- `setup_virtual_device.sh` - Linux/macOS setup script
- `avd_config.ini` - Device configuration file

## Project Structure

[Add your project structure description here]