### Upload a raster file

Before uploading the raster file, make sure the .tif file is properly georeferenced.
See [georeference-and-set-srs.sh](../scripts/georeference-and-set-srs.sh) for example.

#### Method 1: use GeoServer web page

- upload the .tif file to the server via SFTP. save the file in $geoserver_data_dir/data/$WORKSPACE_NAME/$DATA_STORE_NAME/
- create a "coveragestore" with name $DATA_STORE_NAME in the web page
- create and publish a layer from the "coveragestore" in the web page
- check the "layer preview" to make sure the raster is good

#### Method 2: use Python script

See [upload_local_raster_to_geoserver.py](../scripts/upload_local_raster_to_geoserver.py) for example.
