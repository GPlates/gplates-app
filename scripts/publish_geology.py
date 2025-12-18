from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    print(i)
    r = geoserver.create_coveragestore(
        "MULLER2019YC",
        f"geology-{i}-Ma",
        f"data/MULLER2019YC/geology/geology-{i}-Ma.tiff",
    )
    print(r)
    r = geoserver.publish_raster_layer(
        "MULLER2019YC", f"geology-{i}-Ma", f"geology-{i}-Ma"
    )
    print(r)
    time.sleep(0.5)
