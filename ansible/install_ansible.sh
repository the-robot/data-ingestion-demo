#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update and upgrade the system packages
echo "Updating system packages..."
sudo apt update -y && sudo apt upgrade -y

# Install software-properties-common if not installed
echo "Installing prerequisites..."
sudo apt install -y software-properties-common

# Add Ansible PPA (Personal Package Archive)
echo "Adding Ansible PPA..."
sudo add-apt-repository --yes --update ppa:ansible/ansible

# Install Ansible
echo "Installing Ansible..."
sudo apt install -y ansible

# Verify installation
echo "Verifying Ansible installation..."
ansible --version

# Success message
echo "Ansible installed successfully!"
