#!/bin/bash

# Build + push the Lambda container image to ECR.
#
# Defaults:
# - Reads AWS/ECR settings from Terraform outputs in ./infra
# - Auto-increments image tag (chat-v1 -> chat-v2 -> ...) based on infra/lambda-chat.tf
#   - If the current tag is "latest" (or cannot be detected), it starts at chat-v1
#
# Usage:
#   ./push_chat_image.sh            # auto tag
#   ./push_chat_image.sh chat-v3    # explicit tag override

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INFRA_DIR="$SCRIPT_DIR/infra"
LAMBDA_DIR="$SCRIPT_DIR/lambda"

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform not found in PATH" >&2
  exit 1
fi
if ! command -v aws >/dev/null 2>&1; then
  echo "aws not found in PATH" >&2
  exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found in PATH" >&2
  exit 1
fi

if [ ! -d "$INFRA_DIR" ]; then
  echo "Error: infra directory not found: $INFRA_DIR" >&2
  exit 1
fi
if [ ! -d "$LAMBDA_DIR" ]; then
  echo "Error: lambda directory not found: $LAMBDA_DIR" >&2
  exit 1
fi

echo "📋 Retrieving configuration from Terraform (infra outputs)..."

# Prefer Terraform outputs; fall back to sane defaults.
AWS_REGION=$(terraform -chdir="$INFRA_DIR" output -raw aws_region 2>/dev/null || echo "us-east-1")
AWS_PROFILE=$(terraform -chdir="$INFRA_DIR" output -raw aws_profile 2>/dev/null || echo "default")
ACCOUNT_ID=$(terraform -chdir="$INFRA_DIR" output -raw account_id 2>/dev/null || aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)
ECR_REPO_NAME=$(terraform -chdir="$INFRA_DIR" output -raw ecr_repository_name 2>/dev/null)

if [ -z "${ECR_REPO_NAME:-}" ]; then
  echo "Error: could not read ecr_repository_name from terraform outputs." >&2
  echo "Run 'terraform apply' in ./infra first." >&2
  exit 1
fi

# Detect current tag from infra/lambda-chat.tf (image_uri local.lambda_chat.image)
DETECTED_TAG=$(sed -nE 's/.*repository_url}:([^\"]+)\".*/\1/p' "$INFRA_DIR/lambda-chat.tf" | head -n 1)

# Compute next tag if not explicitly provided.
# Supports: chat-v1, chat-v1.0, chat-v001, latest
NEXT_TAG=""
if [ -n "${1:-}" ]; then
  NEXT_TAG="$1"
else
  if [ -z "${DETECTED_TAG:-}" ] || [ "${DETECTED_TAG}" = "latest" ] || [[ "${DETECTED_TAG}" == *latest* ]]; then
    NEXT_TAG="chat-v1"
  else
    # Extract the trailing integer after chat-v (ignore any .suffix)
    CURRENT_N=$(echo "$DETECTED_TAG" | sed -nE 's/^chat-v([0-9]+)(\..*)?$/\1/p')
    if [ -z "$CURRENT_N" ]; then
      NEXT_TAG="chat-v1"
    else
      NEXT_N=$((10#$CURRENT_N + 1))
      NEXT_TAG="chat-v${NEXT_N}"
    fi
  fi
fi

ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
FULL_IMAGE_URI="${ECR_URI}/${ECR_REPO_NAME}:${NEXT_TAG}"

echo "----------------------------------------------------------------"
echo "Deploying Chat Lambda Image"
echo "Region:    $AWS_REGION"
echo "Profile:   $AWS_PROFILE"
echo "Repo:      $ECR_REPO_NAME"
echo "Detected:  ${DETECTED_TAG:-<none>}"
echo "Tag:       $NEXT_TAG"
echo "Image URI: $FULL_IMAGE_URI"
echo "Source:    $LAMBDA_DIR"
echo "----------------------------------------------------------------"

echo "1. Logging in to Amazon ECR..."
aws ecr get-login-password --region "$AWS_REGION" --profile "$AWS_PROFILE" \
  | docker login --username AWS --password-stdin "$ECR_URI"

echo "2. Building Docker image..."
# --platform linux/amd64 is important for Lambda when building on Apple Silicon
# --provenance=false avoids Lambda image manifest incompatibilities
docker build --platform linux/amd64 --provenance=false -t "$FULL_IMAGE_URI" "$LAMBDA_DIR"

echo "3. Pushing image to ECR..."
docker push "$FULL_IMAGE_URI"

echo "----------------------------------------------------------------"
echo "Success! Image uploaded:"
echo "$FULL_IMAGE_URI"
echo "----------------------------------------------------------------"

echo "Updating Terraform config (infra/lambda-chat.tf) to use tag: $NEXT_TAG"

TF_FILE="$INFRA_DIR/lambda-chat.tf"
if [ ! -f "$TF_FILE" ]; then
  echo "Error: terraform file not found: $TF_FILE" >&2
  exit 1
fi

# Update the image tag in the local.lambda_chat.image line.
# Example line:
#   image = "${aws_ecr_repository.warike_development_ecr.repository_url}:chat-v1.0"
# Replace whatever tag is after ':' with NEXT_TAG.
perl -0777 -i -pe 's/(repository_url}:)[^\"]+(\")/${1}'"$NEXT_TAG"'${2}/g' "$TF_FILE"

echo "Running: terraform apply (can be disabled with NO_TERRAFORM_APPLY=1)"
if [ "${NO_TERRAFORM_APPLY:-}" = "1" ]; then
  echo "Skipping terraform apply (NO_TERRAFORM_APPLY=1)"
  exit 0
fi

# For safety: require explicit confirmation in interactive shells unless AUTO_TERRAFORM_APPLY=1.
if [ -t 0 ] && [ "${AUTO_TERRAFORM_APPLY:-}" != "1" ]; then
  echo "About to run 'terraform apply' in $INFRA_DIR to deploy the new image tag ($NEXT_TAG)." >&2
  read -r -p "Continue? (yes/no): " CONFIRM
  if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted. Terraform config updated, but not applied." >&2
    exit 0
  fi
fi

terraform -chdir="$INFRA_DIR" apply

echo "----------------------------------------------------------------"
echo "Deploy complete."
echo "----------------------------------------------------------------"
