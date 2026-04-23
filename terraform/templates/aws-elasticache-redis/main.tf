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

# Security Group for Redis
resource "aws_security_group" "redis_sg" {
  name        = "idp-redis-sg-${var.environment}"
  description = "Security group for IDP provisioned Redis cluster"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.default.cidr_block]
  }

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

# Subnet Group
resource "aws_elasticache_subnet_group" "idp_redis" {
  name       = "idp-redis-subnet-${var.environment}"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

# Generate random password for Redis AUTH
resource "random_password" "redis_password" {
  length  = 32
  special = false
}

# Redis Replication Group
resource "aws_elasticache_replication_group" "idp_redis" {
  replication_group_id       = "idp-redis-${var.environment}"
  replication_group_description = "IDP provisioned Redis cluster"
  
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = var.node_type
  num_cache_clusters   = var.num_cache_nodes
  
  subnet_group_name    = aws_elasticache_subnet_group.idp_redis.name
  security_group_ids   = [aws_security_group.redis_sg.id]
  
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                  = random_password.redis_password.result
  
  automatic_failover_enabled = var.num_cache_nodes > 1
  
  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

# Store credentials in Secrets Manager
resource "aws_secretsmanager_secret" "redis_credentials" {
  name                    = "idp-redis-${var.environment}-credentials"
  recovery_window_in_days = 7

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_secretsmanager_secret_version" "redis_credentials" {
  secret_id = aws_secretsmanager_secret.redis_credentials.id
  secret_string = jsonencode({
    host         = aws_elasticache_replication_group.idp_redis.primary_endpoint_address
    port         = 6379
    password     = random_password.redis_password.result
    cluster_id   = aws_elasticache_replication_group.idp_redis.id
    node_type    = var.node_type
  })
}