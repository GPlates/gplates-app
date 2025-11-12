#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
# you also need a .env file to run this script. see https://github.com/michaelchin/geoserver-pyadm/blob/main/src/geoserver_pyadm/env-template.txt
#
from geoserver_pyadm import geoserver
import time

workspace_name = "gplates-app-zahirovic2022"

# create the workspace if it doesn't exist already
# geoserver.create_workspace(workspace_name)


for i in range(0, 411):
    store_name = f"Hasterok_etal_2022_global-gprv_{i}-Ma"
    data_path = f"data/{workspace_name}/Hasterok-Geology-2022/{store_name}.tif"
    layer_name = store_name

    print(store_name)
    print(data_path)

    r = geoserver.create_coverage_store(
        workspace_name,
        store_name,
        data_path,
    )
    print(r)
    r = geoserver.publish_raster_layer(workspace_name, store_name, layer_name)
    print(r)
    time.sleep(0.5)
