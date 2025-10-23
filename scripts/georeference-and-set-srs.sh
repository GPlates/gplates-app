mkdir georeferenced-image

for i in $(seq 0 250); do 
  convert ./MULLER2019YC/age-grids-pngs/Muller2019-Young2019-Cao2020_AgeGrid-$i.png -crop 4838x2419+0+1 cropped.png

  gdal_translate -a_ullr -180 90 180 -90 -a_srs EPSG:4326  -co compress=LZW -co TILED=YES  cropped.png ./georeferenced-image/age-grid-$i-Ma.tiff
  
  rm cropped.png
done


