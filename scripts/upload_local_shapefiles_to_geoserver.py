#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
# you also need a .env file to run this script. see https://github.com/michaelchin/geoserver-pyadm/blob/main/src/geoserver_pyadm/env-template.txt
#
from geoserver_pyadm import geoserver

workspace_name = "gplates-app-present-day"

# coastlines
# store_name = "Zahirovic_etal_2022_Global_coastlines_low_res"
# shapefile_path = f"../GPlatesAppData/Coastlines/{store_name}.shp"

# static polygons
# store_name = "Global_EarthByte_GPlates_PresentDay_StaticPlatePolygons"
# shapefile_path = (
#    f"../GPlatesAppData/PresentDay-StaticPolygons/Shapefile/{store_name}.shp"
# )

# plate boundaries
# store_name = "Zahirovic_etal_2022_PresentDay_Plate_Boundaries"
# shapefile_path = (
#   f"../GPlatesAppData/PresentDay-PlateBoundaries/Shapefile/{store_name}.shp"
# )

# Continental Polygons
# store_name = "Global_EarthByte_GPlates_PresentDay_ContinentalPolygons"
# shapefile_path = f"../GPlatesAppData/ContinentalPolygons/{store_name}.shp"

# Subduction Zones
# store_name = "Zahirovic_etal_2022_PresentDay_Subduction_Zones"
# shapefile_path = f"../GPlatesAppData/PresentDay-SubductionZones/{store_name}.shp"

# Isochrons
# store_name = "Seton_etal_2020_Isochrons"
# shapefile_path = f"../GPlatesAppData/Isochrons/{store_name}.shp"

# LIPs
# store_name = "Johansson_etal_2018_VolcanicProvinces_v2"
# shapefile_path = (
#    f"../GPlatesAppData/PresentDay-LIPs/Johansson_2018/SHP/{store_name}.shp"
# )

# Seafloor Fabric
store_name = "Zahirovic_etal_2022_SeafloorFabric"
shapefile_path = f"../GPlatesAppData/PresentDay-SeafloorFabric/{store_name}.shp"

layer_name = store_name

# create the workspace if it doesn't exist already
# geoserver.create_workspace(workspace_name)

# configure="none", upload local shapefiles only, the new layers will be published in next function call
# the file will be stored in $geoserver_data_dir/data/$workspace_name/$store_name/ on the server.
r = geoserver.upload_shapefile(
    workspace_name,
    store_name,
    shapefile_path,
    "none",
)
print(r)

# publish the layers
r = geoserver.publish_layer(
    workspace_name,
    store_name,
    layer_name,
)
print(r)


# upload all shapefiles in a local folder
# use configure="all" to upload all shapefiles and publish them
# be aware, all the shapefiles in store_name_2 will be published(not only the ones you just uploaded)
# r = geoserver.upload_shapefile_folder(ws_name_2, store_name_2, f"shapefiles", "all")
# print(r)
