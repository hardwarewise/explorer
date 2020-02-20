#!/bin/bash

function download_pool_stats() {
        DATE_WITH_TIME=`date "+%Y%m%d-%H:%M:%S"`

        cd ~/explorer && wget --timeout=0 -O cache/$1.json_temp --timeout=0 http://$1/api/currencies
        RESULT=$?

        if [ "$RESULT" -eq "0" ]; then
                echo "$DATE_WITH_TIME: get stats from $1" >> ~/sin_explorer_control.log
                rm cache/$1.json
                mv cache/$1.json_temp cache/$1.json
        else
                exit 1;
        fi
}

download_pool_stats icemining.ca

sleep 5

download_pool_stats zergpool.com

sleep 5

download_pool_stats zpool.ca

sleep 5

download_pool_stats pool.sinovate.io
