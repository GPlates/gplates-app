#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

from geoserver_pyadm import geoserver

# workspace_name="gplates"
workspace_name = "gplates-app-present-day"

# list all data stores in workspace
print(geoserver.get_datastores(workspace_name))

# list all coverage stores in workspace
print(geoserver.get_coverage_stores(workspace_name))
