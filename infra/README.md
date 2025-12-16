# Infrastructure (`infra/`)
Terraform configuration for deploying the chat backend on AWS.

## What it creates
- ECR repository for the Lambda container image
- Image-based AWS Lambda with response streaming enabled and a Function URL
- IAM role/policies (CloudWatch logs, S3 Vectors access, Bedrock invoke permissions)
- CloudFront distribution in front of the Lambda Function URL (with OAC + SigV4)

## Prerequisites
- Terraform installed
- AWS CLI installed and authenticated
- Docker installed (image build + push)

## Configure Terraform variables
Create `terraform.tfvars` in this directory (this file is intentionally gitignored).

Example `terraform.tfvars`:
```hcl
project_name = "project-name"

aws_region  = "us-east-1"
aws_profile = "default"

# LLM / embeddings
google_generative_ai_api_key = "<set-me>"
google_language_model        = "gemini-2.5-flash"
google_model_embedding       = "text-embedding-004"

# S3 Vectors
vector_bucket_index_arn  = "arn:aws:s3vectors:us-east-1:1234567890:bucket/bucket-vector-s3-lambda/index/documents"
vector_bucket_index_name = "documents"
vector_bucket_name       = "bucket-vector-s3-lambda"

# Auth + observability
clerk_secret_key  = "<set-me>"
langwatch_api_key = "<set-me>"

# DNS / domain (used by CloudFront + ACM)
# zone_name       = "example.com"
# app_domain_name = "app.example.com"
```

## Deploy
```bash
terraform init
terraform plan
terraform apply
```

Useful outputs:
- Lambda function URL
- CloudFront distribution domain

## Build/push the Lambda image
The infrastructure expects an image tag referenced in `lambda-chat.tf`.

A helper script exists at the repo root:
- `../push_chat_image.sh`

It reads Terraform outputs (account/region/repo), then builds and pushes the image to ECR.

Example:
```bash
../push_chat_image.sh chat-v1.0
```

## Notes
- The Terraform backend is configured in `provider.tf` and uses an S3 backend; make sure the backend bucket and credentials exist.
- S3 Vectors index creation is not handled here; use the repo root `setup.sh` (AWS CLI) to create the index.
