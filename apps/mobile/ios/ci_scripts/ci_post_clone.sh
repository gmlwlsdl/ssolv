#!/bin/zsh

set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing node_modules ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"
pnpm install --frozen-lockfile

echo "=== Installing CocoaPods ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/apps/mobile/ios"
pod install
