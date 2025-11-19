#!/bin/bash
set -euo pipefail

# --- GMT styling
gmt gmtset FONT_ANNOT_PRIMARY 0p FONT_LABEL 0p 

# ++++++++++++++++++++++++
# Present-day age grid + reconstructed ridges animation (original)
# Modified for overlay of various MORs and plate boundary shapefiles onto various rasters (Agegrid, SR grid etc.)
# Original by Nicky Wright (2022-01-17)


# ----- input directories
gplates_recon_dir=/d/GPlatesApp/RasterOverlays/GMTScripts/Data
recon_ridges_dir=${gplates_recon_dir}/Global_EarthByte_GeeK07_Ridges
recon_boundaries_dir=${gplates_recon_dir}/Zahirovic_etal_2022_PlateBoundaries
agegrid_dir=${gplates_recon_dir}/ReconstructedAgeGrids
asymmetry_dir=${gplates_recon_dir}/ReconstructedAsymmetryGrids
spreadingrate_dir=${gplates_recon_dir}/ReconstructedSpreadingRateGrids

ridges_base=Global_EarthByte_Ridges

agegrid_base=Zahirovic_etal_2022-v2_OPT_AgeGrid

asymmetry_base=Seton_etal_2020_Asymmetry

spreadingrate_base=Seton_etal_2020_SR



# ----- output
product=Z22
#output_dir=Agegrid_PlateBounds
#output_dir=SpreadingRate_PlateBounds
output_dir=Asymmetry_PlateBounds
mkdir -p ${product}/${output_dir}

# ----- map params
region=d
projection=X18/9


ridge_colour=black
ridge_thickness=0.8p

platebounds_col=black
platebounds_thickness=0.8p

subductionzone_col=red
subductionzone_thickness=0.8p

# ----- use existing CPT file
#cpt_file=/d/GPlatesApp/RasterOverlays/GMTScripts/age_2020.cpt
cpt_file=/d/GPlatesApp/RasterOverlays/GMTScripts/asymgrid.cpt
#cpt_file=/d/GPlatesApp/RasterOverlays/GMTScripts/fullrategrid.cpt

# ----- loop controls
age=0
max_age=250      # increase for animation (e.g., 0..140)

while (( age <= max_age )); do

  # Inputs per age
  #agegrid_nc=${agegrid_dir}/${agegrid_base}-${age}.nc

  asymmetry_nc=${asymmetry_dir}/${asymmetry_base}_${age}Ma.nc

  #spreadingrate_nc=${spreadingrate_dir}/${spreadingrate_base}_${age}Ma.nc

  # Reconstructed ridges for this age (adjust extension: .xy or .geojson, etc.)
  #ridges_file_xy=${recon_ridges_dir}/${ridges_base}-${age}.xy
  # Reconstructed plate boundaries and subduction zones
  platebounds_file_xy=${recon_boundaries_dir}/topology_${age}Ma.xy
  subduction_left=${recon_boundaries_dir}/topology_subduction_boundaries_sL_${age}Ma.xy
	subduction_right=${recon_boundaries_dir}/topology_subduction_boundaries_sR_${age}Ma.xy
	ridges_transforms=${recon_boundaries_dir}/topology_ridge_transform_boundaries_${age}Ma.xy

  # Output PS
  psfile=${product}/${output_dir}/asymmetry-platebounds-${age}Ma.ps

    # Check if raster exists
  if [ ! -f "${asymmetry_nc}" ]; then
    echo "Warning: missing grid for ${age} Ma -> ${asymmetry_nc}" >&2
    age=$((age + 1))
    continue
  fi

  # ----- draw raster background (age grid)
  gmt grdimage -R${region} -J${projection} ${asymmetry_nc} -C${cpt_file} -Xc -Yc -K > ${psfile}


  # ----- coastlines (reconstructed to age)
  #if [ -f "${coastlines}" ]; then
  #  gmt psxy ${coastlines} -R -J -W${ridges_col} -G${ridges_col} -O -N >> ${psfile}
  #else
  #  echo "Warning: missing coastlines for ${age} Ma -> ${coastlines}" >&2
  #fi

  # ----- reconstructed ridges (overlay)
  #if [ -f "${ridges_file_xy}" ]; then
  #  # Plain XY
  #  gmt psxy ${ridges_file_xy} -R -J -W${ridge_thickness},${ridge_colour} -O -K >> ${psfile}
  #else
  #  echo "Warning: missing reconstructed ridges for ${age} Ma -> ${ridges_file_xy} (or .geojson)" >&2
  #fi

  # ----- reconstructed plate bounds and SZs (overlay)
  if [ -f "${platebounds_file_xy}" ]; then
    # Plain XY
    gmt psxy ${platebounds_file_xy} -R -J -W${platebounds_thickness},${platebounds_col} -O -K >> ${psfile}
  else
    echo "Warning: missing reconstructed plate bounds for ${age} Ma -> ${platebounds_file_xy} (or .geojson)" >&2
  fi

  if [ -f "${subduction_left}" ]; then
    # Plain XY
    gmt psxy -R ${subduction_left} -J -Sf0.3/0.09+l+t -G${subductionzone_col} -W${subductionzone_thickness},${subductionzone_col} -K -O >> ${psfile}
  else
    echo "Warning: missing reconstructed plate bounds for ${age} Ma -> ${subduction_left} (or .geojson)" >&2
  fi 

  if [ -f "${subduction_right}" ]; then
    # Plain XY
    gmt psxy -R ${subduction_right} -J -Sf0.3/0.09+r+t -G${subductionzone_col} -W${subductionzone_thickness},${subductionzone_col} -K -O >> ${psfile}
  else
    echo "Warning: missing reconstructed plate bounds for ${age} Ma -> ${subduction_right} (or .geojson)" >&2
  fi  

# ----- finalize the PostScript file (no drawing, just close)
gmt psxy -R -J -T -O >> ${psfile}

  # ----- convert to PNG and GeoTIFF
  gmt psconvert ${psfile} -P -A+r -W1 -Tg

  # Georeference world bounds; compress; tile
  gdal_translate \
    -mo TIFFTAG_XRESOLUTION=300 -mo TIFFTAG_YRESOLUTION=300 \
    -a_ullr -180.0000000 90.0000000 180.0000000 -90.0000000 \
    -co COMPRESS=LZW -co TILED=YES \
    ${product}/${output_dir}/asymmetry-platebounds-${age}Ma.png \
    ${product}/${output_dir}/asymmetry-platebounds-${age}Ma.tiff 

  age=$((age + 1))
done
