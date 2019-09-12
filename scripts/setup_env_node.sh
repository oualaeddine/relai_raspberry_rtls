#!/bin/bash

echo "--------------------------------------------------------------------------------"
echo "------------------------------- Update -----------------------------------------"
echo "--------------------------------------------------------------------------------"

sudo apt update

echo "--------------------------------------------------------------------------------"
echo "------------------------------- Upgrade ----------------------------------------"
echo "--------------------------------------------------------------------------------"
sudo apt upgrade

echo "--------------------------------------------------------------------------------"
echo "--------------------- Remove older version of nodejs ---------------------------"
echo "--------------------------------------------------------------------------------"

sudo apt remove nodered -y
sudo apt remove node nodejs nodejs-legacy -y
sudo apt remove npm -y

sudo apt remove --purge node

echo "--------------------------------------------------------------------------------"
echo "----------------------------- Installation of nodejs ---------------------------"
echo "--------------------------------------------------------------------------------"


sudo apt-get install -y npm

wget https://nodejs.org/dist/v8.9.0/node-v8.9.0-linux-armv6l.tar.gz

tar -xzf node-v8.9.0-linux-armv6l.tar.gz

cd node-v8.9.0-linux-armv6l/

sudo cp -R * /usr/local/

cd ..


echo "--------------------------------------------------------------------------------"
echo "-------------- Installation of librairies necessaries to program  --------------"
echo "--------------------------------------------------------------------------------"

sudo apt install -y bluetooth bluez libbluetooth-dev libudev-dev

sudo apt install -y libcap2-bin

echo "--------------------------------------------------------------------------------"
echo "---------------------------- Update project package  ---------------------------"
echo "--------------------------------------------------------------------------------"

cd .. ; npm install --save ; cd scripts/

echo "--------------------------------------------------------------------------------"
echo "------------- Configuration of the LAN : setup an static ipaddress  ------------"
echo "--------------------------------------------------------------------------------"

sudo nano /etc/dhcpcd.conf

echo "--------------------------------------------------------------------------------"
echo "-------------------------- Configuration of the service  -----------------------"
echo "--------------------------------------------------------------------------------"


sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
sudo cp relaiKtalyse.service /etc/systemd/system/relaiKtalyse.service
sudo cp relaiKtalyse.timer /etc/systemd/system/relaiKtalyse.timer
sudo systemctl enable relaiKtalyse.timer

echo "--------------------------------------------------------------------------------"
echo "-------------------------- Reboot in five seconds  -----------------------------"
echo "--------------------------------------------------------------------------------"

sudo reboot now
