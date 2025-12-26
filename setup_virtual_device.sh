#!/bin/bash

# Virtual Device Setup without Android Studio
# This script sets up an Android virtual device using command-line tools

echo "Setting up Android Virtual Device without Android Studio..."

# Check if command-line tools are installed
if ! command -v sdkmanager &> /dev/null; then
    echo "Error: Android SDK command-line tools not found!"
    echo "Please download and install Android SDK command-line tools from:"
    echo "https://developer.android.com/studio#command-tools"
    exit 1
fi

# Set ANDROID_HOME if not set
if [ -z "$ANDROID_HOME" ]; then
    export ANDROID_HOME="$HOME/Android/Sdk"
    echo "Setting ANDROID_HOME to: $ANDROID_HOME"
fi

# Add tools to PATH
export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools"

# Install required components
echo "Installing required SDK components..."
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# Create AVD (Android Virtual Device)
echo "Creating Android Virtual Device..."
avdmanager create avd -n "UNEXA_Device" -k "system-images;android-33;google_apis;x86_64" -d "pixel_4" --force

# Start the emulator
echo "Starting emulator..."
emulator -avd "UNEXA_Device" -no-window -no-audio &

echo "Virtual device setup complete!"
echo "Device name: UNEXA_Device"
echo "To start the device manually: emulator -avd UNEXA_Device"
