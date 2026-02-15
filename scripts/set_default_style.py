#!/usr/bin/env python3
from geoserver_pyadm import geoserver
import time

END_TIME = 410
WORKSPACE = "gplates-app-zahirovic2022"


def set_coastlines_default_style(i):
    geoserver.set_default_style(f"{WORKSPACE}:coastlines-{i}-Ma", "coastline-polygon")

    time.sleep(0.5)


def set_plate_boundaries_default_style(i):
    geoserver.set_default_style(
        f"{WORKSPACE}:plate_boundaries-{i}-Ma",
        "plate-boundary-polyline",
    )

    time.sleep(0.5)


def set_static_polygons_default_style(i):
    geoserver.set_default_style(
        f"{WORKSPACE}:static-polygons-{i}-Ma", "static-polygons"
    )

    time.sleep(0.5)


def set_subduction_default_style(i):
    geoserver.set_default_style(
        f"{WORKSPACE}:topology_subduction_boundaries-{i}-Ma", "subduction"
    )

    time.sleep(0.5)


for i in range(0, END_TIME + 1):
    set_coastlines_default_style(i)
    set_plate_boundaries_default_style(i)
    set_static_polygons_default_style(i)
    set_subduction_default_style(i)

    print(i)
