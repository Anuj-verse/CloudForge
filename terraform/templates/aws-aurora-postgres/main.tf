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

resource "aws_db_subnet_group" "idp_default" {
  name       = "idp-aurora-subnet-group-${var.environment}"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

# Generate random password for the database
resource "random_password" "db_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store password in Secrets Manager
resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "idp-aurora-${var.environment}-credentials"
  recovery_window_in_days = 7

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = "orchestrator_admin"
    password = random_password.db_password.result
    host     = aws_rds_cluster.idp_cluster.endpoint
    port     = 5432
    database = aws_rds_cluster.idp_cluster.database_name
  })
}

resource "aws_rds_cluster" "idp_cluster" {
  cluster_identifier      = "aurora-cluster-${var.environment}"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "15.3"
  database_name           = "idp_application_db"
  master_username         = "orchestrator_admin"
  master_password         = random_password.db_password.result
  
  db_subnet_group_name    = aws_db_subnet_group.idp_default.name
  skip_final_snapshot     = true

  serverlessv2_scaling_configuration {
    max_capacity = 4.0
    min_capacity = 0.5
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "IDP-Orchestrator"
  }
}

resource "aws_rds_cluster_instance" "idp_instances" {
  count              = 1
  identifier         = "aurora-instance-${var.environment}-${count.index}"
  cluster_identifier = aws_rds_cluster.idp_cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.idp_cluster.engine
  engine_version     = aws_rds_cluster.idp_cluster.engine_version
}
