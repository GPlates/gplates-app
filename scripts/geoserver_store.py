#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

import os
from geoserver_pyadm import geoserver

# workspace_name="gplates"
# workspace_name = "gplates-app-present-day"
workspace_name = "gplates-app-zahirovic2022"
# workspace_name = "MULLER2019YC"

# list all data stores in workspace
print(geoserver.get_datastores(workspace_name))

# list all coverage stores in workspace
coverage_store_names = geoserver.get_coverage_stores(workspace_name)
# for time-dependent rasters, each time step is a coverage store.
# this will give us lots of coverage stores.
# find the common prefix of the coverage store names
# for example, only print "EMAG2-" for "EMAG2-{{time}}-Ma"
common_prefixes = []
for index, value in enumerate(coverage_store_names):
    if index < len(coverage_store_names) - 1:
        c_pref = os.path.commonprefix([value, coverage_store_names[index + 1]])
        break_flag = False
        for cp in common_prefixes:
            if c_pref.startswith(cp):
                break_flag = True
        if break_flag:
            continue
        else:
            common_prefixes.append(c_pref)
print(common_prefixes)
