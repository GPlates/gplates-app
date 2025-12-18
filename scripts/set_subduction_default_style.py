from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    geoserver.set_default_style(
        f"MULLER2019YC:subduction-polyline-{i}-Ma", "subduction"
    )

    print(i)
    time.sleep(0.5)
