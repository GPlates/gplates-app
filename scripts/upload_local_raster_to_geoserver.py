#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
# you also need a .env file to run this script. see https://github.com/michaelchin/geoserver-pyadm/blob/main/src/geoserver_pyadm/env-template.txt
#
from geoserver_pyadm import geoserver

workspace_name = "gplates-app-present-day"

# create the workspace if it doesn't exist already
# geoserver.create_workspace(workspace_name)

# Age Grid
# store_name = "Seton_etal_2020_PresentDay_AgeGrid"
# raster_path = f"../GPlatesAppData/Agegrid/{store_name}.shp"

# Topography
# store_name = "GEBCO_2024_sub_ice_topo"
# raster_path = f"../GPlatesAppData/PresentDay-Topography/GEBCO/{store_name}.tif"

# Geology
# store_name = "Hasterok_etal_2022_global-gprv"
# raster_path = f"../GPlatesAppData/PresentDay-Geology/{store_name}.tif"

# Crustal Thickness
store_name = "Alfonso_etal_2019_crustal-thickness"
raster_path = f"../GPlatesAppData/PresentDay-CrustalThickness/{store_name}.tif"


layer_name = store_name

# upload the local raster file
# the file will be saved in $geoserver_data_dir/data/$workspace_name/$store_name/ on the server.
r = geoserver.upload_raster(
    workspace_name,
    store_name,  # data store name, this function will create a new datastore with this name
    raster_path,  # the local path to the raster file
    coverage_name=layer_name,  # the layer name, this function will create a new layer with this name
    file_fmt="geotiff",
    configure="all",
)
print(r)
