variable "environment" {
  type        = string
  description = "The target environment (e.g., dev, staging, production)"
  default     = "dev"
}

variable "bucket_name" {
  type        = string
  description = "Base name for the S3 bucket"
  default     = "idp-storage"
}

variable "region" {
  type        = string
  description = "Target deployment region"
  default     = "eu-north-1"
}

variable "versioning_enabled" {
  type        = bool
  description = "Enable versioning on the bucket"
  default     = true
}