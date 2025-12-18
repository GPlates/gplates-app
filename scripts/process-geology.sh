mkdir geology-output

for i in $(seq 0 250); do 
  convert MULLER2019YC/geology/Global_Geology-$i-Ma.tif -background "#cccccc" -alpha remove -alpha off tmp.png

  gdal_translate -a_ullr -180 90 180 -90 -a_srs EPSG:4326  -co compress=LZW -co TILED=YES  tmp.png ./geology-output/geology-$i-Ma.tiff
  
  rm tmp.png
done


