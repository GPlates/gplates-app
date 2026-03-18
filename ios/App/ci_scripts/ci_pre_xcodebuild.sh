#!/bin/sh
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Resolve the Capacitor project root even when CI_WORKSPACE is not repo root.
find_project_root() {
	start_dir="$1"
	current_dir="$start_dir"

	while [ "$current_dir" != "/" ]; do
		if [ -f "$current_dir/capacitor.config.ts" ] || [ -f "$current_dir/capacitor.config.json" ]; then
			echo "$current_dir"
			return 0
		fi
		current_dir="$(dirname "$current_dir")"
	done

	return 1
}

if ! command -v npx >/dev/null 2>&1; then
	echo "[ci_pre_xcodebuild] npx not found. Installing Node.js via Homebrew"
	brew install node@20
	brew link --force node@20 || true
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT=""

if [ -n "$CI_WORKSPACE" ]; then
	PROJECT_ROOT="$(find_project_root "$CI_WORKSPACE" || true)"
fi

if [ -z "$PROJECT_ROOT" ]; then
	PROJECT_ROOT="$(find_project_root "$SCRIPT_DIR" || true)"
fi

if [ -z "$PROJECT_ROOT" ]; then
	echo "[ci_pre_xcodebuild] Could not locate project root containing capacitor.config.ts/json"
	exit 1
fi

echo "[ci_pre_xcodebuild] Using project root: $PROJECT_ROOT"

if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
	echo "[ci_pre_xcodebuild] node_modules missing. Running npm ci"
	cd "$PROJECT_ROOT"
	npm ci --legacy-peer-deps
fi

if [ ! -f "$PROJECT_ROOT/build/index.html" ]; then
	echo "[ci_pre_xcodebuild] build/index.html missing. Running npm run build"
	cd "$PROJECT_ROOT"
	npm run build
fi

echo "[ci_pre_xcodebuild] Syncing Capacitor iOS project"
cd "$PROJECT_ROOT"
if ! npx cap sync ios; then
	echo "[ci_pre_xcodebuild] cap sync failed. Attempting to add iOS platform then retry"
	npx cap add ios
	npx cap sync ios
fi

echo "[ci_pre_xcodebuild] Installing iOS Pods"
cd "$PROJECT_ROOT/ios/App"
pod install --repo-update
