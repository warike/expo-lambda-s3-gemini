#!/bin/bash

# Runs the data ingestion pipeline (embeddings + upsert to S3 Vectors).
#
# Usage:
#   ./run_data_ingestion.sh
#
# Notes:
# - Expects required env vars to be set in `data-ingestion/.env` (see data-ingestion/README.md).

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$SCRIPT_DIR/data-ingestion"

# Install deps if needed (helps first-time setup)
if [ ! -d node_modules ]; then
  pnpm install
fi

pnpm start
