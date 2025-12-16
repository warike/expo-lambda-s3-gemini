#!/bin/bash

# Deprecated wrapper.
# The canonical, standard vector store setup script is now: ./setup.sh

set -e

echo "[setup_vector_store.sh] Deprecated: use ./setup.sh instead." >&2

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
exec "$SCRIPT_DIR/setup.sh" "$@"
