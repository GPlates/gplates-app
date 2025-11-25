#!/bin/bash
set -euo pipefail

# --- GMT styling
gmt gmtset FONT_ANNOT_PRIMARY 0p FONT_LABEL 0p 

# --- map params
region=d
projection=X18/9

ridge_colour=black
ridge_thickness=0.8p

platebounds_col=black
platebounds_thickness=0.8p

subductionzone_col=red
subductionzone_thickness=0.8p

grid_file=./agegrid.nc
cpt_file=./agegrid.cpt
psfile=./agegrid.ps

# ----- draw raster background (age grid)
gmt grdimage -R${region} -J${projection} ${grid_file} -C${cpt_file} -Xc -Yc -K > ${psfile}

gmt pscoast -R${region} -J${projection} -Glightyellow -O -K >> ${psfile}


gmt psxy ./z22/topology_boundaries_0.00Ma.xy -R -J -W0.4p,black -O -K >> ${psfile}

# subduction left
gmt psxy -R ./z22/topology_subduction_boundaries_sL_0.00Ma.xy -J -Sf0.3/0.09+l+t -Gblue -W0.8p,blue -K -O >> ${psfile}

# subduction right
gmt psxy -R ./z22/topology_subduction_boundaries_sR_0.00Ma.xy -J -Sf0.3/0.09+r+t -Gblue -W0.8p,blue -K -O >> ${psfile}

# ----- finalize the PostScript file (no drawing, just close)
gmt psxy -R -J -T -O >> ${psfile}

# ----- convert to PNG and GeoTIFF
gmt psconvert ${psfile} -P -A+r -W1 -Tg

# Georeference world bounds; compress; tile
gdal_translate \
    -mo TIFFTAG_XRESOLUTION=300 -mo TIFFTAG_YRESOLUTION=300 \
    -a_ullr -180.0000000 90.0000000 180.0000000 -90.0000000 \
    -a_srs EPSG:4326 \
    -co COMPRESS=LZW -co TILED=YES \
    agegrid.png \
    agegrid.tif

  
