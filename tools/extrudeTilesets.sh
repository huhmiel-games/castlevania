#!/usr/bin/env bash
clear;
echo "$(tput setaf 2) Starting extrudes tilesets in $1 ";
for file in $1/*; do 
    case $file in
        (*extruded*) continue
    esac
    tile-extruder --tileWidth 16 --tileHeight 16 --input $file
    echo "$(tput setaf 4)$file $(tput setaf 2)Done";
done