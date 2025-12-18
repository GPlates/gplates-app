#!/bin/bash
set -euo pipefail

# plot paleo-bathymetry grid with GMT.

# --- GMT styling ---
# gmt gmtset FONT_ANNOT_PRIMARY 0p FONT_LABEL 0p 

# --- map params ---
region=d
projection=X18/9

cpt_file=pbathy.cpt

# if the files does not exist, they will not be plotted.
topology_boundaries=
subduction_left=
subduction_right=
# topology_boundaries=./z22/topology_boundaries_0.00Ma.xy
# subduction_left=./z22/topology_subduction_boundaries_sL_0.00Ma.xy
# subduction_right=./z22/topology_subduction_boundaries_sR_0.00Ma.xy


# set to 0 if you don't want GMT coastlines.
PLOT_GMT_COASTLINES=0

# set to 0 if you don't want NaN values are transparent, then NaN values will be plotted using the "N" colour in the cpt file.
TRANSPARENT_NAN=0

age=0
max_age=410

mkdir -p paleobathymetry-tif

while (( age <= max_age )); do
    grid_file=Paleobathymetry/paleobathymetry_${age}Ma.nc
    file_basename=paleobathymetry_${age}

    # plot grid
    # add -Q to make NaN transparent. you also need -TG in "gmt psconvert" below
    if [[ "$TRANSPARENT_NAN" -eq 0 ]]; then
        gmt grdimage -R${region} -J${projection} ${grid_file} -C${cpt_file} -Xc -Yc -K > ${file_basename}.ps
    else
        gmt grdimage -R${region} -J${projection} ${grid_file} -C${cpt_file} -Xc -Yc -Q -K > ${file_basename}.ps
    fi

    # draw present-day coastlines
    if [[ "$PLOT_GMT_COASTLINES" -eq 1 ]]; then
        gmt pscoast -R${region} -J${projection} -Glightyellow -O -K >> ${file_basename}.ps
    fi

    # draw topological polygons
    if [ -f "${topology_boundaries}" ]; then
        gmt psxy $topology_boundaries -R -J -W0.4p,black -O -K >> ${file_basename}.ps
    fi

    # subduction left
    if [ -f "${subduction_left}" ]; then
        gmt psxy -R $subduction_left -J -Sf0.3/0.09+l+t -Gblue -W0.8p,blue -K -O >> ${file_basename}.ps
    fi

    # subduction right
    if [ -f "${subduction_right}" ]; then
        gmt psxy -R $subduction_right -J -Sf0.3/0.09+r+t -Gblue -W0.8p,blue -K -O >> ${file_basename}.ps
    fi

    # finalize the PostScript file (no drawing, just close)
    gmt psxy -R -J -T -O >> ${file_basename}.ps

    # convert to PNG and GeoTIFF
    gmt psconvert ${file_basename}.ps -P -A+r -W1 -TG

    # Georeference world bounds; compress; tile; set SRS
    gdal_translate \
        -mo TIFFTAG_XRESOLUTION=300 -mo TIFFTAG_YRESOLUTION=300 \
        -a_ullr -180.0000000 90.0000000 180.0000000 -90.0000000 \
        -a_srs EPSG:4326 \
        -co COMPRESS=LZW -co TILED=YES \
        $file_basename.png \
        $file_basename.tif

    rm $file_basename.png $file_basename.ps $file_basename.pgw
    mv $file_basename.tif paleobathymetry-tif
    age=$((age + 1))
done

