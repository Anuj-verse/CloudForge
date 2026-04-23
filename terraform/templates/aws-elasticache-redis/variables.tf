variable "environment" {
  type        = string
  description = "The target environment (e.g., dev, staging, production)"
  default     = "dev"
}

variable "node_type" {
  type        = string
  description = "ElastiCache node type"
  default     = "cache.t2.micro"
}

variable "num_cache_nodes" {
  type        = number
  description = "Number of cache nodes"
  default     = 1
}

variable "region" {
  type        = string
  description = "Target deployment region"
  default     = "eu-north-1"
}