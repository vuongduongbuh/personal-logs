#!/bin/bash

USER='nowatwor'
HOST='s031.cyon.net'
DEST='www/headbits/ankker.headbits.net'

echo
echo "deployment to $HOST started..."
echo

au build --env prod

ssh $USER@$HOST "cd $DEST; rm *.js; rm *.css; rm -r assets"
rsync -az --force --delete --progress --prune-empty-dirs -e "ssh -p22" ./dist/* $USER@$HOST:$DEST
