from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    geoserver.set_default_style(
        f"MULLER2019YC:plate-boundary-polygons-{i}-Ma", "plate-boundary-polyline"
    )

    print(i)
    time.sleep(0.5)
