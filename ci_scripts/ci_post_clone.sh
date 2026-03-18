#!/bin/sh
set -e

echo "[ci_post_clone] Installing JavaScript dependencies"
cd "$CI_WORKSPACE"
npm ci
