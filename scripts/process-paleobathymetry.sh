mkdir paleobathymetry-output

for i in $(seq 0 250); do 

  gdal_translate -a_ullr -180 90 180 -90 -a_srs EPSG:4326  -co compress=LZW -co TILED=YES  MULLER2019YC/paleobathymetry/paleobathymetry-${i}Ma.tiff ./paleobathymetry-output/paleobathymetry-$i-Ma.tiff
  
  
done


