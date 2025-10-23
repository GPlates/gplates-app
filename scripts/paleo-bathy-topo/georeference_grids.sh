#!/bin/bash

mkdir -p output/tiff-ref

for i in {0..250}
do  
    echo $i

    gdal_translate -a_ullr -180 90 180 -90 output/tiff/paleobathymetry-with-topo-${i}-Ma.tiff tmp.tiff 
    
    gdalwarp -t_srs EPSG:4326  tmp.tiff output/tiff-ref/paleobathymetry-with-topo-${i}-Ma.tiff

    rm tmp.tiff
done