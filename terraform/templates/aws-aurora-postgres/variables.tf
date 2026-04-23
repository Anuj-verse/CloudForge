variable "environment" {
  type        = string
  description = "The target environment (e.g., dev, staging, production-eu-west-1)"
  default     = "dev"
}

variable "capacity" {
  type        = string
  description = "The instance sizing (e.g., db.r6g.large)"
  default     = "db.r6g.large"
}

variable "region" {
  type        = string
  description = "Target deployment region"
  default     = "eu-north-1"
}
