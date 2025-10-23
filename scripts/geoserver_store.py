#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

from geoserver_pyadm import geoserver

print(geoserver.get_datastores("gplates"))

print(geoserver.get_coverage_stores("gplates"))
