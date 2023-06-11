#!/bin/bash

# Update the system
sudo apt update

# Install unzip utility
sudo apt install -y unzip

# Install Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get install -f

# Install ChromeDriver
CHROME_DRIVER_VERSION=`curl -sS https://chromedriver.storage.googleapis.com/LATEST_RELEASE`
wget https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip
unzip chromedriver_linux64.zip

# Move the ChromeDriver to /usr/bin directory
sudo mv chromedriver /usr/bin/chromedriver

# Change the owner and permission of the ChromeDriver
sudo chown root:root /usr/bin/chromedriver
sudo chmod +x /usr/bin/chromedriver

# Test Chrome and ChromeDriver installation
google-chrome --version && chromedriver --version

echo "Google Chrome and ChromeDriver have been installed successfully."
