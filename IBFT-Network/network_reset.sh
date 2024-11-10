#!/bin/bash

# Delete Node directories
rm -rf Node-1 Node-2 Node-3 Node-4

# Copy contents from clean_network to the current folder
cp -r clean_network/* ./
