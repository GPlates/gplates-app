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

coverage_store_names = geoserver.get_coverage_stores(workspace_name)

store_name_to_del = r"^asymmetry-platebounds"  # use regular expression

names_to_del = []
for name in coverage_store_names:
    if re.search(store_name_to_del, name):
        names_to_del.append(name)
        print(name)

if len(names_to_del) > 0:
    user_response = input("Type YES to confirm deletion: ")
    if user_response == "YES":
        for name in names_to_del:
            # delete a data stores by name
            print(geoserver.delete_coverage_store(workspace_name, name))
    else:
        print("User did not type YES to confirm the deletion.")
else:
    print("Nothing to delete.")
