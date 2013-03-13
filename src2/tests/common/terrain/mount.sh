#!/bin/sh
sudo mkdir -p ./data/$2
sudo mount -o bind $1 ./data/$2