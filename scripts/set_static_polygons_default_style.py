from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    geoserver.set_default_style(
        f"MULLER2019YC:static-polygons-{i}-Ma", "static-polygons"
    )

    print(i)
    time.sleep(0.5)
