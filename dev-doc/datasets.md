### GeoServer

GPlates app data is stored in our GeoServer.

https://geoserver.gplates.org/geoserver/web/?0

Note: Some information below has been encrypted with Michael Chin's public key for security reasons.

The user name and password is encrypted with Michael Chin's public key.

    MIOYPa6qG7tnyyF6uF8Mi6xt9Jo2keNNOBz0GrJk16TjntQ1nl8odG6snhbGttdXugCW0PqDyJQKN42Pl2gxvZC5hj43QWrfhUXsX3PrHVxwP4wWCHclHlsbwZqgea1O2/QLEZpHcPVUWnT4gOGQtRRJpfDso7UJwV6IgRLOlA92qHkT6OohN0dRhRDeESItf8tf4I8HLo13Ys8DeYgN0rFVkvnB34D/k//cE7guYJJ/xv8bkl8t9ehs1w2IrhKacBFo1IOFLkC86jzPDHuaF+5bPpke68p5i8jEMNKgrqT2CXeV2HZTAI2k+PT6dQrEEhJMsHh9/HhXjgf605+MG7PkxZflk7/sqWvyGjOG5X2Zctn//z7qKPPrO0pMQeQDRFbiNcmfucl3jg7bJUrlxgnf5Ur8WwTS50SkGYMb68wl9m3yG5ZvqKCyuYU+97RaEDNx/3R8uBtDfNrV5SBtoYPg5Y6iwIwV39VabqJE2khXAqhV0g85qflflo7HU5GQ

Use the command below to ssh into the server. Ask Michael Chin to decipher the message and for the private key to login.

    OOuaucdis86mQNg/daUh4ZI3JOVI9ik2V28VrHUrUdS28vC15tbjdPr/V3dQS8arO8RGH2WYYBpkQYTIfkd+rdsliItQn1YDMIPC5J3fnkeKUR+I6Y82nYN8xbtMjnUyw0f9ZYiI5bH7RhkFhOjsEN4RxlvCJFtA+vDXftohAOTTbEd+WQuHIYuzmkfbqAF9ZeldZy7k56ybyBXlt7p8KrdArNmiYCedr2XOQF1ZkINnPN505nq/L3V0CBdQzo+bciZKEcy23wRWOegg8pmgs50OAZ0I7i3/CEM9mSygt2XL6xV7b6RgNc1zHMnpBYZcUHdyZbNTJf8vfPy2U9Ylyp18FE/vdwIrTbkwQrcPa3hjHVU/wQSwLFH+DSW3LDp4GwvCA7rNII9Jqik1eUCbvJ8XXnpyQW0V1VkuYP3k9BDmLh1QaWjhVD9V+2MbK8bIIp2onUqo/XYXZ7WTVZHUDGs/xBd3A0qyIGoGiMT+bl+ccqSDwecRIsqwFGgVmAgl

The folder path containing the data files is in the encrypted message below. Ask Michael Chin to decipher the message.

    TKkKgFqp+Vkakhx9gIZCCWP4gAF0c22ubd+XCYPLeithWJLml3vMfdGIQ+jUhiirsIcGwqnsvsbw2kNdkiDqYoTJrGab88bdvhw60oIo8p0U2d0rZWIbL1spMZuMhTdwNHMQlsx+p/bN2wvq0tzHDonfDGgSkDd3n6apQJkXm1JDDDu4Zr2y5x62rD6PzYPq2ndbISVguJXW8CDsgNKyfa54tWcf7bYuIlN/s9ccIgxmR0szdlCGDRNGAIFuM+WetC0ye2UG+ignxTxYjKt51bZ5744wkPj4sblodlv+LtkBAiK1V+2zGuEFNVIRg7UXdhZD5m2TWbGBea0EauNA3UI1inUpE46Nm/mBhBYRF/mUCjLI/TJl1BYp2hahLAVZQPR2wIRyXHZOETX3J4FhzC9PmSRdR2PMrtpSkZ5qo7sk0yLJY7Tc8OOSs+ih3jIVodDZoAvGLgs90ekVjl6LZAq/2R3YgoFyh6IZ3Rk0Nnnf+aJ8iqzsP8jbif/kPyO3

### GPlates Web Service

The configuration of GPlates app dataset is [here](https://github.com/GPlates/gplates-web-service/tree/master/django/GWS/data/mobile-app).

### Datasets

- [Present-day Rasters](#present-day-rasters)
- [Time-dependent Rasters](#time-dependent-rasters)
- [Present-day Vector Data](#present-day-vector-data)
- [Time-dependent Vector Data](#time-dependent-vector-data)

#### Present-day Rasters

- Topography (GEBCO)
  - layer name:
    - version 1: [gplates:present-day-topography](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-topography&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:GEBCO_2024_sub_ice_topo](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AGEBCO_2024_sub_ice_topo&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/GEBCO_2024_sub_ice_topo/
  - file source:
    - Version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-Topography/GEBCO/GEBCO_2024_sub_ice_topo.tif

- Geology (Hasterok)
  - layer name:
    - version 1: [gplates:present-day-geology](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-geology&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Hasterok_etal_2022_global-gprv](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AHasterok_etal_2022_global-gprv&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Hasterok_etal_2022_global-gprv/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-Geology/Hasterok_etal_2022_global-gprv.tif

- Seafloor Age
  - layer name:
    - version 1: [gplates:present-day-agegrid](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-agegrid&bbox=-180.0%2C-90.0%2C180.00000000000006%2C90.0&width=768&height=383&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Seton_etal_2020_PresentDay_AgeGrid](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ASeton_etal_2020_PresentDay_AgeGrid&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Seton_etal_2020_PresentDay_AgeGrid/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/Agegrid/Seton_etal_2020_PresentDay_AgeGrid.tif

- Crustal Thickness
  - layer name:
    - version 1: [gplates:present-day-crustal-thickness](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-crustal-thickness&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:gplates-app-present-day:Alfonso_etal_2019_crustal-thickness](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AAlfonso_etal_2019_crustal-thickness&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Alfonso_etal_2019_crustal-thickness/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-CrustalThickness/Alfonso_etal_2019_crustal-thickness.tif

- Vertical Gravity Gradient
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Sandwell_etal_curv_SWOT_03](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ASandwell_etal_curv_SWOT_03&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-present-day/Sandwell_etal_curv_SWOT_03/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/VerticalGravityGradient/Sandwell_etal_curv_SWOT_03.tif

- Asymmetry
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Seton_etal_2020_PresentDayAsymmetry6m_GeeK2007](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ASeton_etal_2020_PresentDayAsymmetry6m_GeeK2007&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-present-day/Seton_etal_2020_PresentDayAsymmetry6m_GeeK2007/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-Asymmetry/Seton_etal_2020_PresentDayAsymmetry6m_GeeK2007.tif

- Polymetallic Nodules
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Dutkiewicz_etal_2020_nodule_occurrence_prob_mean](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ADutkiewicz_etal_2020_nodule_occurrence_prob_mean&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-present-day/Dutkiewicz_etal_2020_nodule_occurrence_prob_mean/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-PolymetallicNodules/Dutkiewicz_etal_2020_nodule_occurrence_prob_mean.tif

- Satellite Topography
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Sandwell_etal_topo_27.1](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ASandwell_etal_topo_27.1&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-present-day/Sandwell_etal_topo_27.1/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-SatelliteTopography/Sandwell_etal_topo_27.1.tif

- Seafloor Lithology
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Dutkiewicz_etal_2020_seabed_lithology_v1](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ADutkiewicz_etal_2020_seabed_lithology_v1&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-present-day/Dutkiewicz_etal_2020_seabed_lithology_v1/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-SeafloorLithology/Dutkiewicz_etal_2020_seabed_lithology_v1.tif

- Spreading Rate
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Seton_etal_2020_PresentDaySR6m_GeeK2007](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ASeton_etal_2020_PresentDaySR6m_GeeK2007&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-present-day/Seton_etal_2020_PresentDaySR6m_GeeK2007/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-SpreadingRate/Seton_etal_2020_PresentDaySR6m_GeeK2007.tif

#### Time-dependent Rasters

- paleo-age-grid
  - layer name:
    - version 1: [MULLER2019YC:age-grid-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Aage-grid-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:agegrid-platebounds-{{time}}Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Aagegrid-platebounds-0Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Agegrid-Plate-Boundaries/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/RasterOverlays/Agegrid_PlateBoundaries/

- paleobathymetry
  - layer name:
    - version 1: [MULLER2019YC:paleobathymetry-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Apaleobathymetry-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)

- paleo-topo
  - layer name:
    - version 1: [MULLER2019YC:paleotopo_1.00d\_{{time}}.00Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Apaleotopo_1.00d_0.00Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - note: the store names are "paleo-topography-{{time}}-Ma". Search the store name instead of the layer name.

- EMAG2
  - layer Nname:
    - version 1: [MULLER2019YC:EMAG2-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3AEMAG2-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:EMAG2-{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3AEMAG2-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/EMAG2/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Zahirovic_etal_2022_EMAG2Reconstruction/

- hasterok-geology
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-zahirovic2022:Hasterok*etal_2022_global-gprv*{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3AHasterok_etal_2022_global-gprv_0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Hasterok-Geology-2022/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Hasterok_etal_2022_GeologyReconstruction/

- paleo-geology
  - layer name:
    - version 1: [MULLER2019YC:geology-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Ageology-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:Global_Geology-{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3AGlobal_Geology-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Geology/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Zahirovic_etal_2022_GeologyReconstruction/

- paleobathy-topo
  - layer name:
    - version 1: [MULLER2019YC:paleobathymetry-with-topo-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Apaleobathymetry-with-topo-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)

- asymmetry-platebounds
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-zahirovic2022:asymmetry-platebounds-{{time}}Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Aasymmetry-platebounds-0Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Asymmetry-Plate-Boundaries/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/RasterOverlays/Asymmetry_PlateBoundaries/

- spreadingrate-platebounds
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-zahirovic2022:spreadingrate-platebounds-{{time}}Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Aspreadingrate-platebounds-0Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - file on server:
    - version 1: N/A
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Spreading-Rate-Plate-Boundaries /
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/RasterOverlays/SpreadingRate_PlateBoundaries/

#### Time-dependent Vector Data

- coastlines
  - layer name:
    - version 1: [MULLER2019YC:coastlines-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Acoastlines-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C83.6539835031362&width=768&height=370&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:coastlines-{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Acoastlines-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C83.6539835031362&width=768&height=370&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Coastlines/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Global_EarthByte_GPlates_PresentDay_Coastlines/

- plate-boundary
  - layer name:
    - version 1: [MULLER2019YC:plate-boundary-polygons-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Aplate-boundary-polygons-0-Ma&bbox=-180.0%2C-69.66316744045228%2C180.0%2C86.99049999987092&width=768&height=334&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:plate_boundaries-{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Aplate_boundaries-0-Ma&bbox=-180.0%2C-69.6631674404523%2C180.0%2C86.99049999987092&width=768&height=334&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Plate-Boundaries/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Zahirovic_etal_2022_PlateBoundariesReconstruction/

- subduction
  - layer name:
    - version 1: [MULLER2019YC:subduction-polyline-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Asubduction-polyline-0-Ma&bbox=-180.0%2C-62.5112645472881%2C180.0%2C60.51799771289321&width=768&height=330&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:topology_subduction_boundaries-{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Atopology_subduction_boundaries-0-Ma&bbox=-180.0%2C-62.51126454728802%2C180.0%2C59.34054205789541&width=768&height=330&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Subduction-Zones/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Zahirovic_etal_2022_SubductionZoneReconstruction/

- static-polygons
  - layer name:
    - version 1: [MULLER2019YC:static-polygons-{{time}}-Ma](https://geoserver.gplates.org/geoserver/MULLER2019YC/wms?service=WMS&version=1.1.0&request=GetMap&layers=MULLER2019YC%3Astatic-polygons-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-zahirovic2022:static-polygons-{{time}}-Ma](https://geoserver.gplates.org/geoserver/gplates-app-zahirovic2022/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-zahirovic2022%3Astatic-polygons-0-Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-zahirovic2022/Static-Plate-Polygons/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ReconstructionData/Global_EarthByte_GPlates_PresentDay_StaticPlatePolygons/

#### Present-day Vector Data

- present-day-coastlines
  - layer name:
    - version 1: [gplates:Global_EarthByte_GPlates_PresentDay_Coastlines](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3AGlobal_EarthByte_GPlates_PresentDay_Coastlines&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Zahirovic_etal_2022_Global_coastlines_low_res](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AZahirovic_etal_2022_Global_coastlines_low_res&bbox=-180.0%2C-90.0%2C180.0%2C83.6539835031362&width=768&height=370&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Zahirovic_etal_2022_Global_coastlines_low_res/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/Coastlines/

- present-day-static-polygons
  - layer name:
    - version 1: [gplates:Global_EarthByte_GPlates_PresentDay_StaticPlatePolygons](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3AGlobal_EarthByte_GPlates_PresentDay_StaticPlatePolygons&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Global_EarthByte_GPlates_PresentDay_StaticPlatePolygons](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AGlobal_EarthByte_GPlates_PresentDay_StaticPlatePolygons&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Global_EarthByte_GPlates_PresentDay_StaticPlatePolygons/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-StaticPolygons/

- present-day-plate-boundaries
  - layer name:
    - version 1: [gplates:present-day-plate-boundaries](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-plate-boundaries&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Zahirovic_etal_2022_PresentDay_Plate_Boundaries](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AZahirovic_etal_2022_PresentDay_Plate_Boundaries&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Zahirovic_etal_2022_PresentDay_Plate_Boundaries/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-PlateBoundaries/
  - note: use polylines or polygons? polygons have vertical line along the dateline.

- present-day-continental-polygons
  - layer name:
    - version 1: [gplates:Global_EarthByte_GPlates_PresentDay_ContinentalPolygons](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3AGlobal_EarthByte_GPlates_PresentDay_ContinentalPolygons&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Global_EarthByte_GPlates_PresentDay_ContinentalPolygons](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AGlobal_EarthByte_GPlates_PresentDay_ContinentalPolygons&bbox=-180.0%2C-90.0%2C180.0%2C84.284379223&width=768&height=371&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Global_EarthByte_GPlates_PresentDay_ContinentalPolygons/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/ContinentalPolygons/

- present-day-subduction-zones
  - layer name:
    - version 1: [gplates:present-day-subduction-zones](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-subduction-zones&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Zahirovic_etal_2022_PresentDay_Subduction_Zones](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AZahirovic_etal_2022_PresentDay_Subduction_Zones&bbox=-180.0%2C-62.511264547288086%2C180.0%2C59.34054205789541&width=768&height=330&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Zahirovic_etal_2022_PresentDay_Subduction_Zones/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-SubductionZones/

- present-day-isochrons
  - layer name:
    - version 1: [gplates:present-day-isochrons](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Apresent-day-isochrons&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Seton_etal_2020_Isochrons](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ASeton_etal_2020_Isochrons&bbox=-180.0%2C-74.9045%2C180.0%2C89.81969999999968&width=768&height=351&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Seton_etal_2020_Isochrons/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/Isochrons/

- present-day-LIPs
  - layer name:
    - version 1: [gplates:Johansson_etal_2018_VolcanicProvinces_v2](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3AJohansson_etal_2018_VolcanicProvinces_v2&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Johansson_etal_2018_VolcanicProvinces_v2](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AJohansson_etal_2018_VolcanicProvinces_v2&bbox=-180.0%2C-86.16119956953148%2C180.0%2C86.68269920379208&width=768&height=368&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Johansson_etal_2018_VolcanicProvinces_v2/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-LIPs/

- present-day-seafloor-fabric
  - layer name:
    - version 1: [gplates:seafloor-fabric](https://geoserver.gplates.org/geoserver/gplates/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates%3Aseafloor-fabric&bbox=-180.0%2C-75.8306596426%2C180.0%2C71.8500988122&width=768&height=330&srs=EPSG%3A4326&styles=&format=application/openlayers)
    - version 2: [gplates-app-present-day:Zahirovic_etal_2022_SeafloorFabric](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3AZahirovic_etal_2022_SeafloorFabric&bbox=-180.0%2C-73.71058912280002%2C180.0%2C71.8500988122&width=768&height=330&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Zahirovic_etal_2022_SeafloorFabric/
  - file source:
    - version 1: Unknown
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay-SeafloorFabric/

- drill-sites
  - layer name:
    - version 1: N/A
    - version 2: [gplates-app-present-day:Drilled_Holes_IODP20250818](https://geoserver.gplates.org/geoserver/gplates-app-present-day/wms?service=WMS&version=1.1.0&request=GetMap&layers=gplates-app-present-day%3ADrilled_Holes_IODP20250818&bbox=-179.6718467%2C-77.4413%2C179.7375%2C87.93333&width=768&height=353&srs=EPSG%3A4326&styles=&format=application/openlayers)
  - file on server:
    - version 1: TO BE FOUND
    - version 2: $data_dir/data/gplates-app-present-day/Drilled_Holes_IODP20250818/
  - file source:
    - version 1: N/A
    - version 2: $EarthByteNAS/GPlatesAppData/PresentDay_DSDP-ODP-IODP-Drillsites/
