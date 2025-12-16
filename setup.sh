#!/bin/bash

# Standard S3 Vectors setup script.
# - Creates (or reuses) a vector bucket
# - Creates (or reuses) an index
#
# Usage:
#   ./setup.sh
#   AWS_PROFILE=default AWS_REGION=us-east-1 VECTOR_BUCKET_NAME=my-bucket INDEX_NAME=documents ./setup.sh

set -euo pipefail

# ------------------------------------------------------------
# Configuration (override via environment variables)
# ------------------------------------------------------------
VECTOR_BUCKET_NAME="${VECTOR_BUCKET_NAME:-bucket-vector-s3-lambda}"
INDEX_NAME="${INDEX_NAME:-documents}"
DATA_TYPE="${DATA_TYPE:-float32}"
DIMENSION="${DIMENSION:-768}"
DISTANCE_METRIC="${DISTANCE_METRIC:-cosine}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_PROFILE="${AWS_PROFILE:-default}"

# Match the metadata keys inserted by ingestion (`data-ingestion/src/app.ts`).
# Note: JSON form is used to support keys like "doc_id" and "sections".
METADATA_CONFIGURATION_JSON='{"nonFilterableMetadataKeys":["type","doc_id","key","product","sections","keywords","id","text"]}'

echo "=========================================="
echo "S3 Vectors Setup"
echo "=========================================="
echo "Bucket Name: $VECTOR_BUCKET_NAME"
echo "Index Name:  $INDEX_NAME"
echo "Region:      $AWS_REGION"
echo "Profile:     $AWS_PROFILE"
echo "Dimension:   $DIMENSION"
echo "Metric:      $DISTANCE_METRIC"
echo "=========================================="
echo ""

# ------------------------------------------------------------
# Step 1: Create Vector Bucket (idempotent)
# ------------------------------------------------------------
echo "Step 1/2: Creating S3 Vector Bucket..."
if aws s3vectors create-vector-bucket \
  --vector-bucket-name "$VECTOR_BUCKET_NAME" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" 2>&1; then
  echo "✓ Vector bucket created successfully"
else
  if aws s3vectors list-vector-buckets \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" 2>&1 | grep -q "$VECTOR_BUCKET_NAME"; then
    echo "⚠ Vector bucket already exists, continuing..."
  else
    echo "✗ Failed to create vector bucket"
    exit 1
  fi
fi

echo ""

# ------------------------------------------------------------
# Step 2: Create Index (idempotent)
# ------------------------------------------------------------
echo "Step 2/2: Creating Vector Index..."
if aws s3vectors create-index \
  --vector-bucket-name "$VECTOR_BUCKET_NAME" \
  --index-name "$INDEX_NAME" \
  --data-type "$DATA_TYPE" \
  --dimension "$DIMENSION" \
  --distance-metric "$DISTANCE_METRIC" \
  --metadata-configuration "$METADATA_CONFIGURATION_JSON" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" 2>&1; then
  echo "✓ Vector index created successfully"
else
  ERROR_MSG=$(aws s3vectors create-index \
    --vector-bucket-name "$VECTOR_BUCKET_NAME" \
    --index-name "$INDEX_NAME" \
    --data-type "$DATA_TYPE" \
    --dimension "$DIMENSION" \
    --distance-metric "$DISTANCE_METRIC" \
    --metadata-configuration "$METADATA_CONFIGURATION_JSON" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" 2>&1 || true)

  if echo "$ERROR_MSG" | grep -qi "already exists"; then
    echo "⚠ Vector index already exists, continuing..."
  else
    echo "✗ Failed to create vector index"
    echo "$ERROR_MSG"
    exit 1
  fi
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""

echo "Vector Bucket ARN:"
aws s3vectors list-vector-buckets \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" \
  --query "VectorBuckets[?VectorBucketName=='$VECTOR_BUCKET_NAME'].VectorBucketArn" \
  --output text 2>/dev/null || echo "Unable to retrieve ARN"

echo ""
echo "Index ARN:"
aws s3vectors list-indexes \
  --vector-bucket-name "$VECTOR_BUCKET_NAME" \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" \
  --query "Indexes[?IndexName=='$INDEX_NAME'].IndexArn" \
  --output text 2>/dev/null || echo "Unable to retrieve ARN"

echo ""
echo "Terraform hint (infra/terraform.tfvars):"
echo "vector_bucket_name       = \"$VECTOR_BUCKET_NAME\""
echo "vector_bucket_index_name = \"$INDEX_NAME\""
echo "vector_bucket_index_arn  = \"<INDEX_ARN_FROM_ABOVE>\""
