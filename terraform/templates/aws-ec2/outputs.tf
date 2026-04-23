output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.idp_instance.id
}

output "public_ip" {
  description = "The public IP of the EC2 instance"
  value       = aws_eip.idp_eip.public_ip
}

output "private_ip" {
  description = "The private IP of the EC2 instance"
  value       = aws_instance.idp_instance.private_ip
}

output "instance_type" {
  description = "The instance type"
  value       = aws_instance.idp_instance.instance_type
}

output "secret_arn" {
  description = "ARN of the Secrets Manager secret containing credentials"
  value       = aws_secretsmanager_secret.ec2_credentials.arn
}

output "secret_name" {
  description = "Name of the Secrets Manager secret"
  value       = aws_secretsmanager_secret.ec2_credentials.name
}