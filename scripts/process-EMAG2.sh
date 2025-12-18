mkdir EMAG2-output

for i in $(seq 0 250); do 
  convert MULLER2019YC/EMAG2/EMAG2-$i-Ma.tif -background "#cccccc" -alpha remove -alpha off tmp.png

  gdal_translate -a_ullr -180 90 180 -90 -a_srs EPSG:4326  -co compress=LZW -co TILED=YES  tmp.png ./EMAG2-output/EMAG2-$i-Ma.tiff
  
  rm tmp.png
done


