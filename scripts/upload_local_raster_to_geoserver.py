#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
# you also need a .env file to run this script. see https://github.com/michaelchin/geoserver-pyadm/blob/main/src/geoserver_pyadm/env-template.txt
#
from geoserver_pyadm import geoserver

workspace_name = "gplates-app-present-day"

# create the workspace if it doesn't exist already
# geoserver.create_workspace(workspace_name)

# upload the local raster file
# the file will be stored in $geoserver_data_dir/data/gplates-app-present-day/Seton_etal_2020_PresentDay_AgeGrid/ on the server.
r = geoserver.upload_raster(
    workspace_name,
    "Seton_etal_2020_PresentDay_AgeGrid",  # data store name, this function will create a new datastore with this name
    f"../GPlatesAppData/Agegrid/Seton_etal_2020_PresentDay_AgeGrid.tif",  # the local path to the raster file
    coverage_name="Seton_etal_2020_PresentDay_AgeGrid",  # the layer name, this function will create a new layer with this name
    file_fmt="geotiff",
    configure="all",
)
print(r)
