#!/bin/sh
npm list | grep jquery > /dev/null || npm install jquery
export NODE_PATH=$NODE_PATH:`pwd`/jasmine-node/lib:node_modules/jquery/dist
node jasmine-node/lib/jasmine-node/cli.js spec

