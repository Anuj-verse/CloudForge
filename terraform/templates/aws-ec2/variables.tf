variable "environment" {
  type        = string
  description = "The target environment (e.g., dev, staging, production)"
  default     = "dev"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "region" {
  type        = string
  description = "Target deployment region"
  default     = "eu-north-1"
}