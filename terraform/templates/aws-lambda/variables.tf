variable "environment" {
  type        = string
  description = "The target environment (e.g., dev, staging, production)"
  default     = "dev"
}

variable "runtime" {
  type        = string
  description = "Lambda runtime"
  default     = "nodejs18.x"
}

variable "memory_size" {
  type        = number
  description = "Lambda memory size in MB"
  default     = 128
}

variable "timeout" {
  type        = number
  description = "Lambda timeout in seconds"
  default     = 30
}

variable "region" {
  type        = string
  description = "Target deployment region"
  default     = "eu-north-1"
}