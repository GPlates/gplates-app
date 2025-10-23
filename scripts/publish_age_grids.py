from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    print(i)
    r = geoserver.create_coveragestore(
        "MULLER2019YC",
        f"age-grid-{i}-Ma",
        f"data/MULLER2019YC/agegrids/age-grid-{i}-Ma.tiff",
    )
    print(r)
    r = geoserver.publish_raster_layer(
        "MULLER2019YC", f"age-grid-{i}-Ma", f"age-grid-{i}-Ma"
    )
    print(r)
    time.sleep(0.5)
