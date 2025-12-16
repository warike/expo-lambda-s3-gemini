#!/bin/bash

# Test streaming chat endpoint using the currently-deployed Terraform outputs.
#
# It prefers the custom Route53/app domain (var.app_domain_name) if present,
# otherwise falls back to the CloudFront distribution domain, otherwise to the Lambda Function URL.
#
# Usage:
#   CLERK_TOKEN='<jwt>' ./test_stream.sh
#   MESSAGE='Hello' CLERK_TOKEN='<jwt>' ./test_stream.sh

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INFRA_DIR="$SCRIPT_DIR/infra"

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform not found in PATH" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl not found in PATH" >&2
  exit 1
fi

TOKEN="${CLERK_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  echo "Missing CLERK_TOKEN environment variable." >&2
  echo "Example: CLERK_TOKEN='<jwt>' ./test_stream.sh" >&2
  exit 1
fi

MESSAGE="${MESSAGE:-Hello! Can you help me with Vantage Pro2 setup?}"

# Resolve base URL from Terraform outputs.
APP_DOMAIN_NAME=$(terraform -chdir="$INFRA_DIR" output -raw app_domain_name 2>/dev/null || true)
CLOUDFRONT_DOMAIN=$(terraform -chdir="$INFRA_DIR" output -raw cloudfront_distribution_domain_name 2>/dev/null || true)
LAMBDA_URL=$(terraform -chdir="$INFRA_DIR" output -raw lambda_function_url 2>/dev/null || true)

BASE_URL=""
if [ -n "$APP_DOMAIN_NAME" ] && [ "$APP_DOMAIN_NAME" != "null" ]; then
  BASE_URL="https://$APP_DOMAIN_NAME"
elif [ -n "$CLOUDFRONT_DOMAIN" ] && [ "$CLOUDFRONT_DOMAIN" != "null" ]; then
  BASE_URL="https://$CLOUDFRONT_DOMAIN"
elif [ -n "$LAMBDA_URL" ] && [ "$LAMBDA_URL" != "null" ]; then
  # lambda_function_url already includes https:// and may have a trailing slash
  BASE_URL="${LAMBDA_URL%/}"
else
  echo "Could not resolve endpoint from Terraform outputs in $INFRA_DIR." >&2
  echo "Expected at least one of: app_domain_name, cloudfront_distribution_domain_name, lambda_function_url" >&2
  exit 1
fi

URL="$BASE_URL/api/chat"

PAYLOAD=$(cat <<JSON
{"messages":[{"role":"user","parts":[{"type":"text","text":"$MESSAGE"}]}]}
JSON
)

# SHA256 hash of the payload (CloudFront + SigV4 / Lambda URL setups commonly require it)
PAYLOAD_HASH=$(printf "%s" "$PAYLOAD" | shasum -a 256 | awk '{print $1}')

echo "----------------------------------------------------------------"
echo "Testing streaming chat (POST)"
echo "Base URL:      $BASE_URL"
echo "Request URL:   $URL"
echo "Payload Hash:  $PAYLOAD_HASH"
echo "----------------------------------------------------------------"

# -N disables buffering to see the stream in real-time
curl -N -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Clerk-Token: $TOKEN" \
  -H "x-amz-content-sha256: $PAYLOAD_HASH" \
  -d "$PAYLOAD" \
  "$URL"

echo ""
echo "----------------------------------------------------------------"
