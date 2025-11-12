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
    # coastlines
    # store_name = "Coastlines"
    # layer_name = f"coastlines-{i}-Ma"

    # plate boundaries
    # store_name = "Plate-Boundaries"
    # layer_name = f"plate_boundaries-{i}-Ma"

    # static polygons
    # store_name = "Static-Plate-Polygons"
    # layer_name = f"static-polygons-{i}-Ma"

    # subduction zones
    store_name = "Subduction-Zones"
    layer_name = f"topology_subduction_boundaries-{i}-Ma"

    print(layer_name)

    r = geoserver.publish_layer(workspace_name, store_name, layer_name)
    print(r)
    time.sleep(0.5)
