variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "my_project"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "aws_profile" {
  description = "AWS profile name"
  type        = string
  default     = "default"
}

variable "google_generative_ai_api_key" {
  description = "Google token api key"
  type        = string
}

variable "google_language_model" {
  description = "Google language model"
  type        = string
}

variable "google_model_embedding" {
  description = "Google gemini embedding model"
  type        = string
}

variable "vector_bucket_name" {
  description = "Vector S3 Bucket name"
  type        = string
}

variable "vector_bucket_index_name" {
  description = "AWS S3 Vectos index name"
  type        = string
}

variable "vector_bucket_index_arn" {
  description = "AWS S3 Vectos index arn"
  type        = string
}

variable "clerk_secret_key" {
  description = "Clerk secret key"
  type        = string
}

variable "langwatch_api_key" {
  description = "langwatch api key"
  type        = string
}

variable "zone_name" {
  description = "Zone name"
  type        = string
}

variable "app_domain_name" {
  description = "App domain name"
  type        = string
}

