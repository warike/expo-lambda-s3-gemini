locals {
  lambda_chat = {
    name        = "chat-${basename(path.cwd)}"
    image       = "${aws_ecr_repository.warike_development_ecr.repository_url}:chat-v1.0"
    description = "Lambda chat function for ${local.project_name}"
    memory_size = 1024
    timeout     = 60
    env_vars = {
      GOOGLE_GENERATIVE_AI_API_KEY = var.google_generative_ai_api_key
      GOOGLE_LANGUAGE_MODEL        = var.google_language_model
      GOOGLE_EMBEDDING_MODEL       = var.google_model_embedding

      AWS_S3_VECTORS_BUCKET_NAME = var.vector_bucket_name
      AWS_S3_VECTORS_INDEX_NAME  = var.vector_bucket_index_name

      LANGWATCH_API_KEY = var.langwatch_api_key
      CLERK_SECRET_KEY  = var.clerk_secret_key

      NODE_OPTIONS = "--enable-source-maps --stack-trace-limit=1000"
      NODE_ENV     = "production"
    }
  }
}

## Lambda Chat
module "warike_development_lambda_chat" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 8.1.2"

  ## Configuration
  function_name = local.lambda_chat.name
  description   = local.lambda_chat.description
  memory_size   = local.lambda_chat.memory_size
  timeout       = local.lambda_chat.timeout

  ## Package
  create_package = false
  package_type   = "Image"
  image_uri      = local.lambda_chat.image
  environment_variables = merge(
    local.lambda_chat.env_vars,
    {}
  )

  create_current_version_allowed_triggers = false

  ## Permissions
  create_role = false
  lambda_role = aws_iam_role.warike_development_lambda_chat_role.arn

  ## Logging
  use_existing_cloudwatch_log_group = true
  logging_log_group                 = aws_cloudwatch_log_group.warike_development_lambda_chat_logs.name
  logging_log_format                = "JSON"
  logging_application_log_level     = "INFO"
  logging_system_log_level          = "WARN"

  ## Response Streaming
  invoke_mode = "RESPONSE_STREAM"

  ## Lambda Function URL for testing
  create_lambda_function_url = true
  authorization_type         = "AWS_IAM"

  cors = {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    expose_headers    = ["*"]
    max_age           = 86400
  }

  tags = merge(local.tags, { Name = local.lambda_chat.name })

  depends_on = [
    aws_cloudwatch_log_group.warike_development_lambda_chat_logs,
    aws_ecr_repository.warike_development_ecr,
    null_resource.warike_development_build_image_seed
  ]
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = module.warike_development_lambda_chat.lambda_function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = module.warike_development_lambda_chat.lambda_function_arn
}

output "lambda_function_url" {
  description = "Lambda function URL (for direct testing)"
  value       = module.warike_development_lambda_chat.lambda_function_url
}
