#!/bin/bash

USER='root'
HOST='ankker01.vlt.headbits.net'
FOLDER='/var/www/ankker.headbits.net'

echo
echo "deployment to $HOST started..."
echo

au build --env prod

mkdir dist
mv scripts dist/scripts
cp index.html dist/

rsync -az --progress -e "ssh -p22" ./dist/* $USER@$HOST:$FOLDER

rm -r dist