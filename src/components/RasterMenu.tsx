import React, { useState } from 'react'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from '@ionic/react'

import './RasterMenu.scss'
import {
  Credit,
  GeographicTilingScheme,
  WebMapTileServiceImageryProvider,
} from 'cesium'
import { chevronBack, chevronForward } from 'ionicons/icons'

var gridsetName = 'EPSG:4326'
var gridNames = [
  'EPSG:4326:0',
  'EPSG:4326:1',
  'EPSG:4326:2',
  'EPSG:4326:3',
  'EPSG:4326:4',
  'EPSG:4326:5',
  'EPSG:4326:6',
  'EPSG:4326:7',
  'EPSG:4326:8',
  'EPSG:4326:9',
  'EPSG:4326:10',
  'EPSG:4326:11',
  'EPSG:4326:12',
  'EPSG:4326:13',
  'EPSG:4326:14',
  'EPSG:4326:15',
  'EPSG:4326:16',
  'EPSG:4326:17',
  'EPSG:4326:18',
  'EPSG:4326:19',
  'EPSG:4326:20',
  'EPSG:4326:21',
]

const topography = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
  layer: 'gplates:topography',
  style: '',
  format: 'image/png',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Coastlines'),
})

const geology = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org//geoserver/gwc/service/wmts',
  layer: 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref',
  style: '',
  format: 'image/jpeg',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Geology'),
})

const agegrid = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
  layer: 'gplates:agegrid',
  style: '',
  format: 'image/jpeg',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Geology'),
})

const gplates_coastlines = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org//geoserver/gwc/service/wmts',
  layer: 'gplates:Matthews_etal_GPC_2016_Coastlines_Polyline',
  style: '',
  format: 'image/png',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Coastlines'),
})

const rasterMaps = [
  {
    layer: geology,
    title: 'Geology',
    subTitle: '???',
    icon: 'assets/raster_menu/geology-256x256.png',
  },
  {
    layer: agegrid,
    title: 'Agegrid',
    subTitle: '???',
    icon: 'assets/raster_menu/agegrid-256x256.png',
  },
  {
    layer: topography,
    title: 'Topography',
    subTitle: '???',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
  {
    layer: topography,
    title: 'Topography',
    subTitle: '???',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
  {
    layer: topography,
    title: 'Topography',
    subTitle: '???',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
  {
    layer: topography,
    title: 'Topography',
    subTitle: '???',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
  {
    layer: topography,
    title: 'Topography',
    subTitle: '???',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
]

interface ContainerProps {
  isShow: boolean
  closeWindow: Function
  addLayer: Function
  isViewerLoading: Function
}

function initialSelection() {
  let isSelectedList = [true]
  for (let i = 1; i < rasterMaps.length; i++) {
    isSelectedList.push(false)
  }
  return isSelectedList
}

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const RasterMenu: React.FC<ContainerProps> = ({
  isShow,
  closeWindow,
  addLayer,
  isViewerLoading,
}) => {
  const [isSelectedList, setIsSelectedList] = useState(initialSelection())
  const [isLoading, setIsLoading] = useState(false)

  let optionList = []
  for (let i = 0; i < rasterMaps.length; i++) {
    optionList.push(
      <IonCard
        key={'raster-menu-element-' + i}
        className={isSelectedList[i] ? 'selected-opt' : 'unselected-opt'}
        onClick={async (e) => {
          if (!isSelectedList[i]) {
            select(i)
            setIsLoading(true)
            addLayer(rasterMaps[i].layer)
            await delay(500)
            while (!isViewerLoading()) {
              await delay(500)
            }
            setIsLoading(false)
          }
        }}
      >
        <img
          src={rasterMaps[i].icon}
          className={'map-icon'}
          alt={'global icon'}
        />
        <IonCardHeader>
          <IonCardTitle>{rasterMaps[i].title}</IonCardTitle>
          <IonCardSubtitle>{rasterMaps[i].subTitle}</IonCardSubtitle>
        </IonCardHeader>
        <div />
      </IonCard>
    )
  }

  // select the target one and unselect rest all
  const select = (index: number) => {
    let temp = [...isSelectedList]
    for (let i = 0; i < isSelectedList.length; i++) {
      temp[i] = false
    }
    temp[index] = true
    setIsSelectedList(temp)
    console.log(isSelectedList)
  }

  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      <div
        className={'raster-menu-backdrop'}
        onClick={() => {
          closeWindow()
        }}
      />
      <div className={'raster-menu-scroll'}>{optionList}</div>
      <div
        className={'raster-menu-loading'}
        style={{ visibility: isLoading ? 'visible' : 'hidden' }}
      >
        <p>Loading...</p>
      </div>
      <IonIcon icon={chevronForward} className={'raster-menu-arrow right'} />
      <IonIcon icon={chevronBack} className={'raster-menu-arrow left'} />
    </div>
  )
}
