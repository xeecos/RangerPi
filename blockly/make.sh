#!/bin/bash

# delete bin folder if it exists
if [ -e ./bin ] 
then
    rm -rf ./bin
fi

mkdir bin/
mkdir bin/blockly-for-mbot

#build
echo "building blockly_compressed.js..."
./build.py

#copy files to bin folder
echo "copying files..."
cp -r blocks ./bin/blockly-for-mbot/
cp -r blockly-extend ./bin/blockly-for-mbot/
cp -r generators ./bin/blockly-for-mbot/
cp -r media ./bin/blockly-for-mbot/
cp -r msg ./bin/blockly-for-mbot/
mkdir bin/blockly-for-mbot/demos
cp -r demos/mblockly ./bin/blockly-for-mbot/demos/
cp blockly_compressed.js ./bin/blockly-for-mbot/
rm blockly_compressed.js

echo "finalizing..."
sed -i -e 's/blockly_uncompressed\.js/blockly_compressed\.js/g' bin/blockly-for-mbot/demos/mblockly/index*.html

echo "finished!"
