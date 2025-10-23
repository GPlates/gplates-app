#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

from geoserver_pyadm import geoserver

# list all workspaces
print(geoserver.get_all_workspaces())

# get details about a workspace
print(geoserver.get_workspace("gplates"))

# create a workspace
# geoserver.create_workspace("test-workspace-123")

# delete a workspace by name
# geoserver.delete_workspace("test-workspace-123")
