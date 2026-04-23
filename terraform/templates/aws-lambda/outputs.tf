output "function_name" {
  description = "The name of the Lambda function"
  value       = aws_lambda_function.idp_lambda.function_name
}

output "function_arn" {
  description = "The ARN of the Lambda function"
  value       = aws_lambda_function.idp_lambda.arn
}

output "api_endpoint" {
  description = "The API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.lambda_api.api_endpoint
}

output "invoke_arn" {
  description = "The invoke ARN of the Lambda function"
  value       = aws_lambda_function.idp_lambda.invoke_arn
}

output "secret_arn" {
  description = "ARN of the Secrets Manager secret containing credentials"
  value       = aws_secretsmanager_secret.lambda_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.lambda_credentials.name
}