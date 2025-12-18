### Steps to create paleo-bathy-topo globe

- get paloe-topo grids at https://repo.gplates.org/mchin/gplates-app/geoserver/MULLER2019YC/paleo-bathy-topo/grids-MULLER2019/
  The paloe-topo grids were created on my Ubuntu desktop `michael@10.66.32.173:/home/michael/workspace/EarthByteWorkflows.git/Paleotopography` by using Simon's workflow. See https://github.sydney.edu.au/EarthByte/EarthByteWorkflows/tree/master/Paleotopography
- get paleo-bathymetry grids at https://repo.gplates.org/mchin/gplates-app/geoserver/MULLER2019YC/paleo-bathy-topo/paleo_bathymetry_6m_1.4_RHCW18_M19/
  The paleo-bathymetry grids were from Nicky Wright
- run **resize_topo_grids.sh** 
  This script needs gmt and gdal_translate. Creating a pygmt env with micromamba is the easy way to run it.
- run **merge-dem-bathy.py**
  Create a virtual env to run this script. `/opt/homebrew/bin/python3 -m venv dem-bathy-env` && `pip3 install -r requirements.txt`
- run **georeference_grids.sh**
  This script needs gdal `brew install gdal`
