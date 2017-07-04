#!/bin/bash

USER='root'
HOST='ankker01.vlt.headbits.net'
FOLDER='/var/www/ankker.headbits.net'

echo
echo "deployment to $HOST started..."
echo

au build --env prod

rsync -az --progress -e "ssh -p22" ./dist/* $USER@$HOST:$FOLDER
