#!/bin/zsh

set -e

echo "=== Restoring GoogleService-Info.plist ==="
echo "$GOOGLE_SERVICE_INFO_PLIST" | base64 --decode > "$CI_PRIMARY_REPOSITORY_PATH/apps/mobile/ios/Solv/GoogleService-Info.plist"

echo "=== Installing Node (via nvm) ==="

export NVM_DIR="$HOME/.nvm"
mkdir -p $NVM_DIR

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

source $NVM_DIR/nvm.sh

nvm install 18
nvm use 18

echo "Node version:"
node -v
npm -v

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