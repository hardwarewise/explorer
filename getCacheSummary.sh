#bin/bash

#Update address stats before generate the summary. coinstats is updated
#cd /home/sinteam/explorer && wget --timeout=0 -O cache/address.json "http://explorer3.sinovate.io/ext/addressstats"

cd ~/explorer && wget --timeout=0 -O cache/summary.json.tmp "http://127.0.0.1:8081/ext/summary"

sleep 15

ERROR=`grep "There was an error" ~/explorer/summary.json.tmp | wc -l`

if [ "$ERROR" -eq "0" ]; then

echo "no ERROR found!"
rm ~/explorer/cache/summary.json
cp ~/explorer/cache/summary.json.tmp ~/explorer/cache/summary.json

else

echo "ERROR found!"

fi
