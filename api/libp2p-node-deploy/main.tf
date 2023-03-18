hcl
provider "aws" {
  region = "us-west-2"
}

locals {
  app_name = "libp2p-node-typescript"
}

resource "aws_security_group" "allow_inbound" {
  name        = "${local.app_name}-allow_inbound"
  description = "Allow inbound traffic"

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "${local.app_name}-deployer"
  public_key = file("~/.ssh/id_rsa.pub")
}

resource "aws_instance" "app" {
  ami           = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 LTS AMI
  instance_type = "t2.micro"

  key_name = aws_key_pair.deployer.key_name

  vpc_security_group_ids = [aws_security_group.allow_inbound.id]

  tags = {
    Name = local.app_name
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y git nodejs npm
              git clone https://github.com/yourusername/libp2p-node-typescript.git
              cd libp2p-node-typescript
              npm install
              npm run build
              nohup npm start &
              EOF
}