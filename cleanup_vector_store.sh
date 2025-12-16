#!/bin/bash

# Deletes the S3 Vectors index and vector bucket.
# WARNING: This permanently deletes vector data.
#
# Uses the same configuration conventions as `./setup.sh`.
#
# Usage:
#   ./cleanup_vector_store.sh
#   AWS_PROFILE=default AWS_REGION=us-east-1 VECTOR_BUCKET_NAME=... INDEX_NAME=... ./cleanup_vector_store.sh

set -euo pipefail

# ------------------------------------------------------------
# Configuration (override via environment variables)
# ------------------------------------------------------------
VECTOR_BUCKET_NAME="${VECTOR_BUCKET_NAME:-bucket-vector-s3-lambda}"
INDEX_NAME="${INDEX_NAME:-documents}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_PROFILE="${AWS_PROFILE:-default}"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws not found in PATH" >&2
  exit 1
fi

echo "=========================================="
echo "S3 Vectors Cleanup"
echo "=========================================="
echo "Bucket Name: $VECTOR_BUCKET_NAME"
echo "Index Name:  $INDEX_NAME"
echo "Region:      $AWS_REGION"
echo "Profile:     $AWS_PROFILE"
echo "=========================================="
echo ""
echo "WARNING: This will permanently delete all vectors in this index and delete the bucket."
echo ""

# Confirmation prompt
read -r -p "Type 'delete' to confirm: " CONFIRM
if [ "$CONFIRM" != "delete" ]; then
  echo "Cleanup cancelled."
  exit 0
fi

echo ""

# ------------------------------------------------------------
# Step 1: Delete Index (idempotent)
# ------------------------------------------------------------
echo "Step 1/2: Deleting Vector Index..."
if aws s3vectors delete-index \
  --vector-bucket-name "$VECTOR_BUCKET_NAME" \
  --index-name "$INDEX_NAME" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" 2>&1; then
  echo "✓ Vector index deleted successfully"
else
  ERROR_MSG=$(aws s3vectors delete-index \
    --vector-bucket-name "$VECTOR_BUCKET_NAME" \
    --index-name "$INDEX_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" 2>&1 || true)

  if echo "$ERROR_MSG" | grep -qi "not found\|does not exist"; then
    echo "⚠ Vector index does not exist, continuing..."
  else
    echo "✗ Failed to delete vector index" >&2
    echo "$ERROR_MSG" >&2
    exit 1
  fi
fi

echo ""

# ------------------------------------------------------------
# Step 2: Delete Vector Bucket (idempotent)
# ------------------------------------------------------------
echo "Step 2/2: Deleting S3 Vector Bucket..."
if aws s3vectors delete-vector-bucket \
  --vector-bucket-name "$VECTOR_BUCKET_NAME" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" 2>&1; then
  echo "✓ Vector bucket deleted successfully"
else
  ERROR_MSG=$(aws s3vectors delete-vector-bucket \
    --vector-bucket-name "$VECTOR_BUCKET_NAME" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" 2>&1 || true)

  if echo "$ERROR_MSG" | grep -qi "not found\|does not exist"; then
    echo "⚠ Vector bucket does not exist, continuing..."
  else
    echo "✗ Failed to delete vector bucket" >&2
    echo "$ERROR_MSG" >&2
    exit 1
  fi
fi

echo ""
echo "=========================================="
echo "Cleanup Complete"
echo "=========================================="
echo "All vector data has been deleted."
echo "Run ./setup.sh to recreate the bucket + index."
