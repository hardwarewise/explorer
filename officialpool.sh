#bin/bash

cd ~/explorer && wget --timeout=0 -O cache/sin.pool.sinovate.io.json_temp "https://pool.sinovate.io/api/currencies/SIN"

sleep 15

INFO=`grep "height" cache/sin.pool.sinovate.io.json_temp | wc -l`

if [ "$INFO" -eq "0" ]; then
    echo "ERROR: no new infos"
else
    echo "INFO: updating..."
    rm ~/explorer/cache/sin.pool.sinovate.io.json
    mv ~/explorer/cache/sin.pool.sinovate.io.json_temp ~/explorer/cache/sin.pool.sinovate.io.json
fi

