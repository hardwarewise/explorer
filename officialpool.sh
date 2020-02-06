#bin/bash

cd /home/sinteam/explorer && wget --timeout=0 -O cache/sin.pool.sinovate.io.json_temp "https://pool.sinovate.io/api/currencies/SIN"

sleep 15

INFO=`grep "height" sin.pool.sinovate.io.json_temp | wc -l`

if [ "$INFO" -eq "0" ]; then
    echo "ERROR: no new infos"
else
    echo "INFO: updating..."
    rm /home/sinteam/explorer/cache/sin.pool.sinovate.io.json
    cp /home/sinteam/explorer/cache/sin.pool.sinovate.io.json_temp /home/sinteam/explorer/cache/sin.pool.sinovate.io.json
fi

