provider "aws" {
  region = var.region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_caller_identity" "current" {}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "idp-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Lambda function code
data "archive_file" "lambda_code" {
  type        = "zip"
  output_path = "${path.module}/lambda_function.zip"

  source {
    content  = <<-EOF
      exports.handler = async (event) => {
        console.log('IDP Lambda Function Executed');
        console.log('Event:', JSON.stringify(event, null, 2));
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Hello from IDP Lambda!',
            environment: '${var.environment}',
            timestamp: new Date().toISOString()
          })
        };
      };
    EOF
    filename = "index.js"
  }
}

# Lambda Function
resource "aws_lambda_function" "idp_lambda" {
  filename         = data.archive_file.lambda_code.output_path
  function_name    = "idp-lambda-${var.environment}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_code.output_base64sha256
  runtime          = var.runtime
  timeout          = var.timeout
  memory_size      = var.memory_size

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  vpc_config {
    subnet_ids         = data.aws_subnets.default.ids
    security_group_ids = [aws_security_group.lambda_sg.id]
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

# Security Group for Lambda
resource "aws_security_group" "lambda_sg" {
  name        = "idp-lambda-sg-${var.environment}"
  description = "Security group for IDP provisioned Lambda function"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

# API Gateway
resource "aws_apigatewayv2_api" "lambda_api" {
  name          = "idp-lambda-api-${var.environment}"
  protocol_type = "HTTP"

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_apigatewayv2_stage" "lambda_api_stage" {
  api_id      = aws_apigatewayv2_api.lambda_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.lambda_api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.idp_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "lambda_route" {
  api_id    = aws_apigatewayv2_api.lambda_api.id
  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.idp_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda_api.execution_arn}/*/*"
}

# Store credentials in Secrets Manager
resource "aws_secretsmanager_secret" "lambda_credentials" {
  name                    = "idp-lambda-${var.environment}-credentials"
  recovery_window_in_days = 7

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_secretsmanager_secret_version" "lambda_credentials" {
  secret_id = aws_secretsmanager_secret.lambda_credentials.id
  secret_string = jsonencode({
    function_name = aws_lambda_function.idp_lambda.function_name
    function_arn  = aws_lambda_function.idp_lambda.arn
    api_endpoint  = aws_apigatewayv2_api.lambda_api.api_endpoint
    runtime       = var.runtime
    memory_size   = var.memory_size
    timeout       = var.timeout
  })
}