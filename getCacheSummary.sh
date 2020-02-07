#bin/bash

#Update address stats before generate the summary. coinstats is updated
#cd /home/sinteam/explorer && wget --timeout=0 -O cache/address.json "http://explorer3.sinovate.io/ext/addressstats"

cd /home/sinteam/explorer && wget --timeout=0 -O cache/summary.json.tmp "http://explorer3.sinovate.io/ext/summary"

sleep 15

ERROR=`grep "There was an error" /home/sinteam/explorer/summary.json.tmp | wc -l`

if [ "$ERROR" -eq "0" ]; then

echo "no ERROR found!"
rm /home/sinteam/explorer/cache/summary.json
cp /home/sinteam/explorer/cache/summary.json.tmp /home/sinteam/explorer/cache/summary.json

else

echo "ERROR found!"

fi
