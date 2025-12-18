#!/bin/bash

mkdir paleotopo-3601x1801

for i in {0..250}
do  
    echo $i
    gmt grd2xyz grids-MULLER2019/paleotopo_0.50d_${i}.00Ma.nc | gmt surface -Rd -I0.5 -Gtmp.nc
    gdal_translate -outsize 3601 1801 tmp.nc paleotopo-3601x1801/paleotop-3601x1801-${i}Ma.nc
    rm tmp.nc
done