output "primary_endpoint" {
  description = "The primary endpoint for the Redis cluster"
  value       = aws_elasticache_replication_group.idp_redis.primary_endpoint_address
}

output "reader_endpoint" {
  description = "The reader endpoint for the Redis cluster"
  value       = aws_elasticache_replication_group.idp_redis.reader_endpoint_address
}

output "cluster_id" {
  description = "The ID of the Redis cluster"
  value       = aws_elasticache_replication_group.idp_redis.id
}

output "port" {
  description = "The Redis port"
  value       = 6379
}

output "secret_arn" {
  description = "ARN of the Secrets Manager secret containing credentials"
  value       = aws_secretsmanager_secret.redis_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.redis_credentials.name
}