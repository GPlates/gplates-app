#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

from geoserver_pyadm import geoserver

import re


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
# find the name template of the coverage store names
# for example, only print one "Hasterok_etal_2022_global-gprv_{{time}}-Ma" instead of all the names
name_templates = {}
time_pattern = r"\d+(?:\.\d+)?"

for name in coverage_store_names:
    matches = re.findall(time_pattern, name)
    if len(matches) == 0:
        print(f"Warning: no time found in the store name: {name}.")

    time = matches[-1]  # assume the last number is time

    time_start_index = name.rfind(time)  # assume the last number is time
    name_template = (
        name[:time_start_index] + r"{{time}}" + name[time_start_index + len(time) :]
    )
    time_number = float(time)
    if time_number.is_integer():
        time_number = int(time)
    if name_template in name_templates:
        name_templates[name_template].add(time_number)
    else:
        name_templates[name_template] = set([time_number])

print(name_templates)
