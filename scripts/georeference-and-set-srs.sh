#!/bin/bash

mkdir georeferenced-tiff


for i in $(seq 0 250); do

  FILE_NAME=asymmetry-platebounds-${i}Ma.tiff
  echo $FILE_NAME
  gdal_translate -a_ullr -180 90 180 -90 -a_srs EPSG:4326  -co compress=LZW -co TILED=YES  $FILE_NAME ./georeferenced-tiff/$FILE_NAME

done
