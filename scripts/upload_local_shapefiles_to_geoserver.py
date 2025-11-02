#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
# you also need a .env file to run this script. see https://github.com/michaelchin/geoserver-pyadm/blob/main/src/geoserver_pyadm/env-template.txt
#
from geoserver_pyadm import geoserver

workspace_name = "gplates-app-present-day"

# create the workspace if it doesn't exist already
# geoserver.create_workspace(workspace_name)

# configure="none", upload local shapefiles only, the new layers will be published in next function call
# the file will be stored in $geoserver_data_dir/data/gplates-app-present-day/Zahirovic_etal_2022_Global_coastlines_low_res/ on the server.
r = geoserver.upload_shapefile(
    workspace_name,
    "Zahirovic_etal_2022_Global_coastlines_low_res",
    f"../GPlatesAppData/Coastlines/Zahirovic_etal_2022_Global_coastlines_low_res.shp",
    "none",
)
print(r)

# publish the layers
r = geoserver.publish_layer(
    workspace_name,
    "Zahirovic_etal_2022_Global_coastlines_low_res",
    "Zahirovic_etal_2022_Global_coastlines_low_res",
)
print(r)


# upload all shapefiles in a local folder
# use configure="all" to upload all shapefiles and publish them
# be aware, all the shapefiles in store_name_2 will be published(not only the ones you just uploaded)
# r = geoserver.upload_shapefile_folder(ws_name_2, store_name_2, f"shapefiles", "all")
# print(r)
