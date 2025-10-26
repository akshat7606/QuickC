#!/bin/bash

# Android Build Script for QuickC
# This script prepares the Android app for Play Store submission

echo "🚀 Starting Android build process for QuickC..."

# Check for required tools
command -v npx >/dev/null 2>&1 || { echo "❌ Node.js/npm is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm install
cd ..

# Build the web app
echo "🏗️ Building web application..."
cd frontend && npm run build
cd ..

# Sync with Android
echo "📱 Syncing with Android platform..."
npx cap sync android

# Copy assets
echo "🎨 Copying app assets..."
mkdir -p android/app/src/main/res/mipmap-hdpi
mkdir -p android/app/src/main/res/mipmap-mdpi
mkdir -p android/app/src/main/res/mipmap-xhdpi
mkdir -p android/app/src/main/res/mipmap-xxhdpi
mkdir -p android/app/src/main/res/mipmap-xxxhdpi

# Note: You'll need to create different sized icons for each density
cp assets/icons/icon.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp assets/icons/icon.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp assets/icons/icon.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp assets/icons/icon.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp assets/icons/icon.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Generate release keystore (if it doesn't exist)
if [ ! -f "android/app/release-key.keystore" ]; then
    echo "🔐 Generating release keystore..."
    keytool -genkey -v -keystore android/app/release-key.keystore -alias QuickC-release-key -keyalg RSA -keysize 2048 -validity 10000
fi

# Build release APK
echo "🔨 Building release APK..."
cd android && ./gradlew assembleRelease
cd ..

# Build AAB for Play Store
echo "📦 Building Android App Bundle..."
cd android && ./gradlew bundleRelease
cd ..

echo "✅ Android build complete!"
echo ""
echo "Build outputs:"
echo "📱 APK: android/app/build/outputs/apk/release/app-release.apk"
echo "📦 AAB: android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "Next steps:"
echo "1. Upload the AAB file to Google Play Console"
echo "2. Complete the store listing with screenshots and descriptions"
echo "3. Set up app pricing and distribution"
echo "4. Submit for review"