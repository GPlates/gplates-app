#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#
from geoserver_pyadm import geoserver
import time

for i in range(0, 411):
    print(i)
    r = geoserver.create_coverage_store(
        "gplates-app-zahirovic2022",
        f"paleo-topography-{i}-Ma",
        f"data/gplates-app-zahirovic2022/Paleotopography/paleotopo_{i}.tif",
    )
    print(r)
    r = geoserver.publish_raster_layer(
        "gplates-app-zahirovic2022",
        f"paleo-topography-{i}-Ma",
        f"paleotopo_{i}",
    )
    print(r)
    time.sleep(0.5)
