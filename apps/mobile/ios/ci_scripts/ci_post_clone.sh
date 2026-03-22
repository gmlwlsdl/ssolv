#!/bin/zsh

set -e

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing node_modules ==="
export PNPM_HOME=/tmp/pnpm-store
export PATH="$PNPM_HOME:$PATH"
cd "$CI_PRIMARY_REPOSITORY_PATH"
pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store

echo "=== Installing CocoaPods ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/apps/mobile/ios"
pod install
