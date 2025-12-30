# Android Environment Setup for PowerShell
# This script sets up the Android SDK environment variables

Write-Host "Setting up Android SDK environment..."

# Check if ANDROID_HOME is set
if (-not $env:ANDROID_HOME) {
    $defaultPath = "$env:USERPROFILE\AppData\Local\Android\Sdk"
    Write-Host "ANDROID_HOME not found. Setting to: $defaultPath"
    $env:ANDROID_HOME = $defaultPath
} else {
    Write-Host "ANDROID_HOME is already set to: $env:ANDROID_HOME"
}

# Add Android tools to PATH
$androidPaths = @(
    "$env:ANDROID_HOME\emulator",
    "$env:ANDROID_HOME\tools",
    "$env:ANDROID_HOME\tools\bin",
    "$env:ANDROID_HOME\platform-tools",
    "$env:ANDROID_HOME\cmdline-tools\latest\bin"
)

foreach ($path in $androidPaths) {
    if (Test-Path $path) {
        $env:PATH = "$env:PATH;$path"
        Write-Host "Added to PATH: $path"
    } else {
        Write-Host "Path not found: $path" -ForegroundColor Yellow
    }
}

# Check if emulator command is available
try {
    $emulatorVersion = & emulator -version 2>$null
    Write-Host "Emulator found: $emulatorVersion" -ForegroundColor Green
} catch {
    Write-Host "Emulator command still not found. Please check Android SDK installation." -ForegroundColor Red
}

Write-Host "`nEnvironment setup complete!"
Write-Host "To make these changes permanent, add these paths to your system environment variables."
Write-Host "Current ANDROID_HOME: $env:ANDROID_HOME"
