#!/usr/bin/env python3
#
# pip3 install geoserver-pyadm
#

from geoserver_pyadm import geoserver

import re, sys


# workspace_name="gplates"
# workspace_name = "gplates-app-present-day"
workspace_name = "gplates-app-zahirovic2022"
# workspace_name = "MULLER2019YC"

# allow user to provide workspace name in command line
if len(sys.argv) > 1:
    workspace_name = sys.argv[1]

# list all data stores in workspace
print("\nData stores:")
for n in geoserver.get_datastores(workspace_name):
    print("\t" + n)

# list all coverage stores in workspace
coverage_store_names = geoserver.get_coverage_stores(workspace_name)
# for time-dependent rasters, each time step is a coverage store.
# this will give us lots of coverage stores.
# find the name template of the coverage store names
# for example, only print one "Hasterok_etal_2022_global-gprv_{{time}}-Ma" instead of all the names
name_templates = {}
time_pattern = r"\d+(?:\.\d+)?"

# try to deduce the name templates of time-dependent rasters
for name in coverage_store_names:
    matches = re.findall(time_pattern, name)
    if len(matches) == 0:
        # print(f"Warning: no time found in the store name: {name}.")
        name_templates[name] = set([])
        continue

    time = matches[-1]  # assume the last number is time

    time_start_index = name.rfind(time)
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

# not all coverage stores are time-dependent rasters
# sanity check before printing

print("\nCoverage stores:")
for n in name_templates:
    if len(name_templates[n]) == 0:
        print("\t" + n)
    elif len(name_templates[n]) == 1:
        print("\t" + n.replace(r"{{time}}", str(list(name_templates[n])[0])))
    else:
        times = list(name_templates[n])
        expected_times = set(range(times[0], times[-1]))
        diff = expected_times - name_templates[n]
        print(f"\t{n}: ({times[0]} - {times[-1]} Ma)")
        # print(name_templates[n])
        if len(diff) != 0:
            print("Warning: some rasters may be missing for some time points.")
            print(diff)
