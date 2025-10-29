#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

from geoserver_pyadm import geoserver

# list all data stores in workspace "gplates"
print(geoserver.get_datastores("gplates"))

# list all coverage stores in workspace "gplates"
print(geoserver.get_coverage_stores("gplates"))
