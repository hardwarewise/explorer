#bin/bash

cd /home/sinteam/explorer

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js topAddress

sleep 5

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js activeAddress

sleep 5

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js totalAddress

sleep 5

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js nodeBurnCoins

sleep 5

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js knownHashrate

sleep 5

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js infExpired

sleep 5

/usr/bin/nodejs --stack-size=35000 scripts/statsFromMongoDB.js tx7days

sleep 5

exit

