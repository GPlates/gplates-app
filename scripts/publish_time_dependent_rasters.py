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

max_time = 411
for i in range(0, max_time):
    ext = "tif"
    store_name = f"Zahirovic_etal_2022-v2_PMAG_SEAFLOOR_AGE_grid_{i}"
    data_path = f"data/{workspace_name}/Paleo-Seafloor-Age/{store_name}.{ext}"

    # ext = "tiff"
    # store_name = f"spreadingrate-platebounds-{i}Ma"
    # data_path = (
    #    f"data/{workspace_name}/Spreading-Rate-Plate-Boundaries/{store_name}.{ext}"
    # )

    # ext = "tif"
    # store_name = f"EMAG2-{i}-Ma"
    # data_path = f"data/{workspace_name}/EMAG2/{store_name}.{ext}"

    # ext = "tif"
    # store_name = f"Global_Geology-{i}-Ma"
    # data_path = f"data/{workspace_name}/Geology/{store_name}.{ext}"

    # ext = "tiff"
    # store_name = f"asymmetry-platebounds-{i}Ma"
    # data_path = f"data/{workspace_name}/Asymmetry-Plate-Boundaries/{store_name}.{ext}"

    # Hasterok_etal_2022 Geology
    # store_name = f"Hasterok_etal_2022_global-gprv_{i}-Ma"
    # data_path = f"data/{workspace_name}/Hasterok-Geology-2022/{store_name}.tif"

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
    if r.status_code not in [200, 201]:
        geoserver.delete_coverage_store(workspace_name, store_name)
    print(r)
    time.sleep(0.5)
