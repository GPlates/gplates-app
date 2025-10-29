### GeoServer

GPlates app data is stored in a GeoServer.

https://geoserver.gplates.org/geoserver/web/?0

Note: Some information has been encrypted with Michael Chin's public key for security reasons.

The user name and password is encrypted with Michael Chin's public key.

    MIOYPa6qG7tnyyF6uF8Mi6xt9Jo2keNNOBz0GrJk16TjntQ1nl8odG6snhbGttdXugCW0PqDyJQKN42Pl2gxvZC5hj43QWrfhUXsX3PrHVxwP4wWCHclHlsbwZqgea1O2/QLEZpHcPVUWnT4gOGQtRRJpfDso7UJwV6IgRLOlA92qHkT6OohN0dRhRDeESItf8tf4I8HLo13Ys8DeYgN0rFVkvnB34D/k//cE7guYJJ/xv8bkl8t9ehs1w2IrhKacBFo1IOFLkC86jzPDHuaF+5bPpke68p5i8jEMNKgrqT2CXeV2HZTAI2k+PT6dQrEEhJMsHh9/HhXjgf605+MG7PkxZflk7/sqWvyGjOG5X2Zctn//z7qKPPrO0pMQeQDRFbiNcmfucl3jg7bJUrlxgnf5Ur8WwTS50SkGYMb68wl9m3yG5ZvqKCyuYU+97RaEDNx/3R8uBtDfNrV5SBtoYPg5Y6iwIwV39VabqJE2khXAqhV0g85qflflo7HU5GQ

Use the command below to ssh into the server. Ask Michael Chin to decipher the message and for the private key to login.

    OOuaucdis86mQNg/daUh4ZI3JOVI9ik2V28VrHUrUdS28vC15tbjdPr/V3dQS8arO8RGH2WYYBpkQYTIfkd+rdsliItQn1YDMIPC5J3fnkeKUR+I6Y82nYN8xbtMjnUyw0f9ZYiI5bH7RhkFhOjsEN4RxlvCJFtA+vDXftohAOTTbEd+WQuHIYuzmkfbqAF9ZeldZy7k56ybyBXlt7p8KrdArNmiYCedr2XOQF1ZkINnPN505nq/L3V0CBdQzo+bciZKEcy23wRWOegg8pmgs50OAZ0I7i3/CEM9mSygt2XL6xV7b6RgNc1zHMnpBYZcUHdyZbNTJf8vfPy2U9Ylyp18FE/vdwIrTbkwQrcPa3hjHVU/wQSwLFH+DSW3LDp4GwvCA7rNII9Jqik1eUCbvJ8XXnpyQW0V1VkuYP3k9BDmLh1QaWjhVD9V+2MbK8bIIp2onUqo/XYXZ7WTVZHUDGs/xBd3A0qyIGoGiMT+bl+ccqSDwecRIsqwFGgVmAgl

The folder path containing the data files is in the encrypted message below. Ask Michael Chin to decipher the message.

    TKkKgFqp+Vkakhx9gIZCCWP4gAF0c22ubd+XCYPLeithWJLml3vMfdGIQ+jUhiirsIcGwqnsvsbw2kNdkiDqYoTJrGab88bdvhw60oIo8p0U2d0rZWIbL1spMZuMhTdwNHMQlsx+p/bN2wvq0tzHDonfDGgSkDd3n6apQJkXm1JDDDu4Zr2y5x62rD6PzYPq2ndbISVguJXW8CDsgNKyfa54tWcf7bYuIlN/s9ccIgxmR0szdlCGDRNGAIFuM+WetC0ye2UG+ignxTxYjKt51bZ5744wkPj4sblodlv+LtkBAiK1V+2zGuEFNVIRg7UXdhZD5m2TWbGBea0EauNA3UI1inUpE46Nm/mBhBYRF/mUCjLI/TJl1BYp2hahLAVZQPR2wIRyXHZOETX3J4FhzC9PmSRdR2PMrtpSkZ5qo7sk0yLJY7Tc8OOSs+ih3jIVodDZoAvGLgs90ekVjl6LZAq/2R3YgoFyh6IZ3Rk0Nnnf+aJ8iqzsP8jbif/kPyO3

### GPlates Web Service

The configuration of GPlates app dataset is [here](https://github.com/GPlates/gplates-web-service/tree/master/django/GWS/data/mobile-app).

### Datasets

- [Present-day rasters](#present-day-rasters)
- [Paleo-rasters](#paleo-rasters)
- [Vector data](#vector-data)

#### Present-day rasters

- Topography
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/gplates/wms"
  - "layerName": "gplates:present-day-topography",
- Geology
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/gplates/wms"
  - "layerName": "gplates:present-day-geology",
- Agegrid
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/gplates/wms"
  - layer name:
    - version 1: gplates:present-day-agegrid
    - version 2:
- CrustalThickness"
  "wmsUrl": "https://geoserver.gplates.org/geoserver/gplates/wms"
  "layerName": "gplates:present-day-crustal-thickness",

#### Paleo-rasters

- paleo-age-grid
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:age-grid-{{time}}-Ma",
- paleobathymetry
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:paleobathymetry-{{time}}-Ma",
- paleo-topo
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:paleotopo*1.00d*{{time}}.00Ma",
- EMAG2
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:EMAG2-{{time}}-Ma",
- paleo-geology
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:geology-{{time}}-Ma",
- paleobathy-topo
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:paleobathymetry-with-topo-{{time}}-Ma",

#### Vector data

- coastlines
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:coastlines-{{time}}-Ma",
- plate-boundary
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:plate-boundary-polygons-{{time}}-Ma",
- subduction
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:subduction-polyline-{{time}}-Ma",
- static-polygons
  - "wmsUrl": "https://geoserver.gplates.org/geoserver/MULLER2019YC/wms",
  - "layerName": "MULLER2019YC:static-polygons-{{time}}-Ma",
- present-day-coastlines
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:Global_EarthByte_GPlates_PresentDay_Coastlines",
- present-day-static-polygons
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:Global_EarthByte_GPlates_PresentDay_StaticPlatePolygons",
- present-day-subduction-zones
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:present-day-subduction-zones",
- present-day-plate-boundaries
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:present-day-plate-boundaries",
- present-day-continental-polygons
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:Global_EarthByte_GPlates_PresentDay_ContinentalPolygons",
- present-day-isochrons
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:present-day-isochrons",
- present-day-LIPs
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:Johansson_etal_2018_VolcanicProvinces_v2",
- present-day-seafloor-fabric
  - "url": "https://geoserver.gplates.org/geoserver/gwc/service/wmts",
  - "layerName": "gplates:seafloor-fabric",
