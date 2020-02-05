#bin/bash

~/SIN-core/src/sind &

sleep 15

cd ~/explorer && node_modules/forever/bin/forever start bin/cluster &

sleep 5

