provider "aws" {
  region = var.region
}

# Generate random suffix for unique bucket name
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# S3 Bucket
resource "aws_s3_bucket" "idp_bucket" {
  bucket = "${var.bucket_name}-${random_id.bucket_suffix.hex}"
  
  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_s3_bucket_versioning" "idp_bucket_versioning" {
  bucket = aws_s3_bucket.idp_bucket.id
  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "idp_bucket_encryption" {
  bucket = aws_s3_bucket.idp_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "idp_bucket_public_access" {
  bucket = aws_s3_bucket.idp_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Generate random access key
resource "random_password" "s3_secret_key" {
  length  = 40
  special = false
}

# IAM User for bucket access
resource "aws_iam_user" "s3_user" {
  name = "idp-s3-user-${var.environment}-${random_id.bucket_suffix.hex}"

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_iam_access_key" "s3_user_key" {
  user = aws_iam_user.s3_user.name
}

resource "aws_iam_user_policy" "s3_user_policy" {
  name = "idp-s3-policy-${var.environment}"
  user = aws_iam_user.s3_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.idp_bucket.arn,
          "${aws_s3_bucket.idp_bucket.arn}/*"
        ]
      }
    ]
  })
}

# Store credentials in Secrets Manager
resource "aws_secretsmanager_secret" "s3_credentials" {
  name                    = "idp-s3-${var.environment}-credentials-${random_id.bucket_suffix.hex}"
  recovery_window_in_days = 7

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_secretsmanager_secret_version" "s3_credentials" {
  secret_id = aws_secretsmanager_secret.s3_credentials.id
  secret_string = jsonencode({
    access_key_id     = aws_iam_access_key.s3_user_key.id
    secret_access_key = aws_iam_access_key.s3_user_key.secret
    bucket_name       = aws_s3_bucket.idp_bucket.bucket
    region            = var.region
  })
}