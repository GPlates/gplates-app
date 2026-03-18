#!/bin/sh
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

if ! command -v npx >/dev/null 2>&1; then
	echo "[ci_pre_xcodebuild] npx not found. Installing Node.js via Homebrew"
	brew install node@20
	brew link --force node@20 || true
fi

echo "[ci_pre_xcodebuild] Syncing Capacitor iOS project"
cd "$CI_WORKSPACE"
npx cap sync ios

echo "[ci_pre_xcodebuild] Installing iOS Pods"
cd "$CI_WORKSPACE/ios/App"
pod install --repo-update
