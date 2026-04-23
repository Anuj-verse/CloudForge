output "cluster_endpoint" {
  description = "The cluster endpoint for writing data"
  value       = aws_rds_cluster.idp_cluster.endpoint
}

output "reader_endpoint" {
  description = "The cluster reader endpoint for scaling reads"
  value       = aws_rds_cluster.idp_cluster.reader_endpoint
}

output "database_name" {
  description = "Target provisioned database name"
  value       = aws_rds_cluster.idp_cluster.database_name
}

output "secret_arn" {
  description = "ARN of the Secrets Manager secret containing credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.db_credentials.name
}
