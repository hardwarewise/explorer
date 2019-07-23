#bin/bash

/usr/local/bin/sind &

sleep 5

/usr/local/bin/sind -datadir=/home/xtdevcoin/statsdata &

sleep 15

echo "Start explorer" >> /home/xtdevcoin/sin_explorer_control.log

cd /home/xtdevcoin/explorer && forever start bin/cluster &

sleep 5

