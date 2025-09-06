#!/bin/bash

# iOS Build Script for UCA Universal Cab Aggregator
# This script prepares the iOS app for App Store submission

echo "🚀 Starting iOS build process for UCA..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: iOS builds require macOS"
    exit 1
fi

# Check for required tools
command -v xcodebuild >/dev/null 2>&1 || { echo "❌ Xcode is required but not installed. Aborting." >&2; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "❌ Node.js/npm is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm install
cd ..

# Build the web app
echo "🏗️ Building web application..."
cd frontend && npm run build
cd ..

# Sync with iOS
echo "📱 Syncing with iOS platform..."
npx cap sync ios

# Copy assets
echo "🎨 Copying app assets..."
cp assets/icons/icon.png ios/App/App/Assets.xcassets/AppIcon.appiconset/
cp assets/icons/splash.png ios/App/App/Assets.xcassets/Splash.imageset/

# Open Xcode project
echo "📱 Opening Xcode project..."
open ios/App/App.xcworkspace

echo "✅ iOS build preparation complete!"
echo ""
echo "Next steps in Xcode:"
echo "1. Update signing & capabilities with your Apple Developer account"
echo "2. Set deployment target to iOS 13.0 or higher"
echo "3. Configure app icons and launch screens"
echo "4. Build and archive for App Store submission"
echo "5. Upload to App Store Connect using Xcode"