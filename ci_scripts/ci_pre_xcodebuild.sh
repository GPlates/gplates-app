#!/bin/sh
set -e

echo "[ci_pre_xcodebuild] Syncing Capacitor iOS project"
cd "$CI_WORKSPACE"
npx cap sync ios

echo "[ci_pre_xcodebuild] Installing iOS Pods"
cd "$CI_WORKSPACE/ios/App"
pod install --repo-update
