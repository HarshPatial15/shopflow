resource "aws_key_pair" "shopflow" {
  key_name   = "shopflow-key"
  public_key = file("~/.ssh/shopflow.pub")
}
resource "aws_security_group" "shopflow" {
  name = "shopflow-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 31958
    to_port     = 31958
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "shopflow" {
  ami = "ami-0f5ee92e2d63afc18"
  instance_type          = "t3.small"               # free tier
  key_name = aws_key_pair.shopflow.key_name
  vpc_security_group_ids = [aws_security_group.shopflow.id]

  root_block_device {
    volume_size = 20  # free tier = up to 30GB
  }

  tags = {
    Name = "shopflow"
  }
}
