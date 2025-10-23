from geoserver_pyadm import geoserver
import time

for i in range(0, 251):
    print(i)
    r = geoserver.create_coveragestore(
        "MULLER2019YC",
        f"paleobathymetry-with-topo-{i}-Ma",
        f"data/MULLER2019YC/paleobathymetry-topo/paleobathymetry-with-topo-{i}-Ma.tiff",
    )
    print(r)
    r = geoserver.publish_raster_layer(
        "MULLER2019YC",
        f"paleobathymetry-with-topo-{i}-Ma",
        f"paleobathymetry-with-topo-{i}-Ma",
    )
    print(r)
    time.sleep(0.5)
