from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    geoserver.publish_layer(
        "MULLER2019YC", "subduction-zone", f"subduction-polyline-{i}-Ma"
    )
    print(i)
    time.sleep(0.5)
