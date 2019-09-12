#!/bin/sh

while :
do
  read -p "Saisir la commande (status, start, stop, quit): " INPUT_STRING
  case $INPUT_STRING in
	status)
		sudo systemctl status relaiKtalyse
		;;
	start)
		sudo systemctl start relaiKtalyse
		;;
	stop)
		sudo systemctl stop relaiKtalyse
		;;
	quit)
		break
		;;
	*)
		echo "Commande inconnue"
		;;
  esac
done
