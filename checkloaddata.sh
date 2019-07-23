#bin/bash

cd /home/xtdevcoin/explorer
NB=`pgrep -f "nodejs --stack-size=15000" | wc -l`
echo $NB
if [ "$NB" -eq "0" ]; then 
rm tmp/index.pid
/usr/bin/nodejs --stack-size=15000 scripts/sync.js index check &
fi
