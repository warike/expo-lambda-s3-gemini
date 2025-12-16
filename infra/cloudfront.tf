locals {
  cloudfront_oac_lambda_function_url = "chat_lambda_function_url"
  zone_name                          = var.zone_name
  app_domain_name                    = var.app_domain_name
}

module "warike_development_cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "5.0.1"

  ## Configuration
  enabled                        = true
  price_class                    = "PriceClass_100"
  retain_on_delete               = false
  wait_for_deployment            = true
  is_ipv6_enabled                = true
  create_monitoring_subscription = true

  ## Extra CNAMEs
  aliases = [local.app_domain_name]
  comment = "Chat CloudFront Distribution"

  ## Origin access control
  create_origin_access_control = true

  origin_access_control = {
    "chat_lambda_function_url" = {
      description      = "CloudFront access to Lambda Function URL"
      origin_type      = "lambda"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  origin = {
    "chat_lambda_function_url" = {
      domain_name           = trimsuffix(replace(module.warike_development_lambda_chat.lambda_function_url, "https://", ""), "/")
      origin_access_control = local.cloudfront_oac_lambda_function_url
      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "match-viewer"
        origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
      }
    }
  }


  default_cache_behavior = {
    target_origin_id       = local.cloudfront_oac_lambda_function_url
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]

    ## Cache policy disabled
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac"

    ## Forwarded values disabled
    use_forwarded_values = false

    ## TTL settings
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
    compress    = true

  }



  viewer_certificate = {
    acm_certificate_arn = module.warike_development_acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  tags = merge(local.tags, { Name = local.cloudfront_oac_lambda_function_url })

  depends_on = [
    module.warike_development_acm,
    module.warike_development_lambda_chat,
  ]
}


resource "aws_lambda_permission" "warike_development_allow_cloudfront" {
  statement_id  = "AllowCloudFrontServicePrincipal"
  action        = "lambda:InvokeFunctionUrl"
  function_name = module.warike_development_lambda_chat.lambda_function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = module.warike_development_cloudfront.cloudfront_distribution_arn
}

resource "aws_lambda_permission" "warike_development_allow_cloudfront_invoke_function" {
  statement_id  = "AllowCloudFrontServicePrincipalInvokeFunction"
  action        = "lambda:InvokeFunction"
  function_name = module.warike_development_lambda_chat.lambda_function_name
  principal     = "cloudfront.amazonaws.com"
  source_arn    = module.warike_development_cloudfront.cloudfront_distribution_arn
}

## Cloudfront distribution domain name
output "cloudfront_distribution_domain_name" {
  value = module.warike_development_cloudfront.cloudfront_distribution_domain_name
}

## Preferred public domain (typically a Route53 / custom domain CNAME to CloudFront)
output "app_domain_name" {
  value = var.app_domain_name
}
