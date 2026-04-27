output "public_ip" {
  value = aws_instance.shopflow.public_ip
}
output "ssh_command" {
  value = "ssh -i your-key.pem ec2-user@${aws_instance.shopflow.public_ip}"
}

