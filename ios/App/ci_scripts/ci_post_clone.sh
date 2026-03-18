#!/bin/sh
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
	echo "[ci_post_clone] npm not found. Installing Node.js via Homebrew"
	brew install node@20
	brew link --force node@20 || true
fi

echo "[ci_post_clone] Installing JavaScript dependencies"
cd "$CI_WORKSPACE"
npm ci
