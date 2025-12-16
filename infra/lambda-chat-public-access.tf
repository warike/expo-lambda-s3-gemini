
resource "aws_lambda_permission" "warike_development_allow_public_lambda_url" {
  statement_id           = "AllowPublicLambdaUrl"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = module.warike_development_lambda_chat.lambda_function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}
