output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.idp_bucket.bucket
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.idp_bucket.arn
}

output "bucket_region" {
  description = "The region of the S3 bucket"
  value       = aws_s3_bucket.idp_bucket.region
}

output "access_key_id" {
  description = "The access key ID for the bucket"
  value       = aws_iam_access_key.s3_user_key.id
}

output "secret_arn" {
  description = "ARN of the Secrets Manager secret containing credentials"
  value       = aws_secretsmanager_secret.s3_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.s3_credentials.name
}