### ⬆️ Upload a raster file

Before uploading the raster file, make sure the .tif file is properly georeferenced.
See [georeference-and-set-srs.sh](../scripts/georeference-and-set-srs.sh) for example.

#### Method 1: use GeoServer web page

- upload the .tif file to the server via SFTP. save the file in $geoserver_data_dir/data/$WORKSPACE_NAME/$DATA_STORE_NAME/
- create a "coveragestore" with name $DATA_STORE_NAME in the web page
  <img width="575" height="607" alt="Screenshot 2025-10-29 at 3 48 48 pm" src="https://github.com/user-attachments/assets/e5dfc062-aa46-4dfa-be5e-9819bd34599d" />
  <img width="684" height="539" alt="Screenshot 2025-10-30 at 10 52 27 am" src="https://github.com/user-attachments/assets/3e60a3bd-7a87-4400-8b05-6f5e8a38a41f" />
- create and publish a layer from the "coveragestore" in the web page
  <img width="995" height="252" alt="Screenshot 2025-10-29 at 3 49 53 pm" src="https://github.com/user-attachments/assets/fe3adcd7-ee41-4921-aeb9-2f3c2c2c50ce" />

- check the "layer preview" to make sure the raster is good

#### Method 2: use Python script

See [upload_local_raster_to_geoserver.py](../scripts/upload_local_raster_to_geoserver.py) for example.

### ⬆️ Upload local shapefiles

#### Method 1: use GeoServer web page

- upload the shapefiles to the server via SFTP. save the files in $geoserver_data_dir/data/$WORKSPACE_NAME/$DATA_STORE_NAME/
- create a "Shapefile" data store with name $DATA_STORE_NAME in the web page
  <img width="561" height="591" alt="Screenshot 2025-11-03 at 8 26 06 am" src="https://github.com/user-attachments/assets/0d52d353-02de-4b1a-9ac1-acb9b9e57f80" />
  <img width="678" height="645" alt="Screenshot 2025-11-03 at 8 30 36 am" src="https://github.com/user-attachments/assets/5532dca1-2e93-48cd-a4f3-3b7478c6e1be" />
- create and publish a layer from the data store in the web page
  <img width="745" height="259" alt="Screenshot 2025-11-03 at 8 31 36 am" src="https://github.com/user-attachments/assets/343c6d64-af00-4357-b98c-ba61edc8af1c" />
- check the "layer preview" to make sure the Shapefile layer is good

#### Method 2: use Python script

See [upload_local_shapefiles_to_geoserver.py](../scripts/upload_local_shapefiles_to_geoserver.py) for example.
