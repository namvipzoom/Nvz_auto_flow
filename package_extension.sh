#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
EXT_DIR="$ROOT_DIR/extension"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_NAME="auto-flow-extension.zip"
TARGET="$DIST_DIR/$PACKAGE_NAME"

if [[ ! -d "$EXT_DIR" ]]; then
  echo "Extension directory not found at $EXT_DIR" >&2
  exit 1
fi

mkdir -p "$DIST_DIR"

if [[ -f "$TARGET" ]]; then
  echo "Removing existing package at $TARGET"
  rm -f "$TARGET"
fi

cd "$EXT_DIR"
zip -r "$TARGET" . -x "*/.*"

echo "Created package: $TARGET"
