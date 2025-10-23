from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    print(i)
    r = geoserver.create_coveragestore(
        "MULLER2019YC",
        f"paleo-topography-{i}-Ma",
        f"data/paleo-topo-images/paleo-topo-image-{i}-Ma/paleotopo_1.00d_{i}.00Ma.tiff",
    )
    print(r)
    r = geoserver.publish_raster_layer(
        "MULLER2019YC", f"paleo-topography-{i}-Ma", f"paleotopo_1.00d_{i}.00Ma"
    )
    print(r)
    time.sleep(0.5)
