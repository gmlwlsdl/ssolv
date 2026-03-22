#!/bin/sh

set -e

echo "=== Installing Homebrew dependencies ==="
brew install node

echo "=== Installing pnpm ==="
npm install -g pnpm

echo "=== Installing node_modules ==="
cd "$CI_WORKSPACE/../../../.."
pnpm install --frozen-lockfile

echo "=== Installing CocoaPods ==="
cd "$CI_WORKSPACE/.."
pod install
