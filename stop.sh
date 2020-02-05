#bin/bash

cd /home/sinteam/explorer

PID=`cat tmp/cluster.pid`

if [ $PID -gt 1 ]; then

  echo "Explorer is running with PID: $PID"
  node_modules/forever/bin/forever stop $PID

  sleep 1

  NB=`ps -ef | grep $PID | wc -l`
  if [ "$NB" -eq "0" ]; then
    echo "Explorer is stopped!"
    rm tmp/cluster.pid
  fi

fi
