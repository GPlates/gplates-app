import React, { useState } from 'react'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle, IonCardTitle,
  IonIcon
} from '@ionic/react'

import './RasterMenu.scss'
import { Credit, GeographicTilingScheme, WebMapTileServiceImageryProvider } from 'cesium'

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
  'EPSG:4326:21'
]

const gplates_test = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
  layer: 'gplates:topography',
  style: '',
  format: 'image/png',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Coastlines')
})

const gplates_wmts = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org//geoserver/gwc/service/wmts',
  layer: 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref',
  style: '',
  format: 'image/jpeg',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Geology')
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
  credit: new Credit('EarthByte Coastlines')
})

const rasterMaps = [
  {
    layer: gplates_test,
    title: 'Clouds',
    subTitle: 'Current'
  },
  {
    layer: gplates_wmts,
    title: 'Clouds',
    subTitle: 'Current'
  },
  {
    layer: gplates_coastlines,
    title: 'Clouds',
    subTitle: 'Current'
  },
  {
    layer: gplates_coastlines,
    title: 'Clouds',
    subTitle: 'Current'
  },
  {
    layer: gplates_coastlines,
    title: 'Clouds',
    subTitle: 'Current'
  },
  {
    layer: gplates_coastlines,
    title: 'Clouds',
    subTitle: 'Current'
  },
  {
    layer: gplates_coastlines,
    title: 'Clouds',
    subTitle: 'Current'
  }
]

interface ContainerProps {
  isShow: boolean
  closeWindow: Function
  addLayer: Function
}


function initialSelection() {
  let isSelectedList = [true]
  for (let i = 1; i < rasterMaps.length; i++) {
    isSelectedList.push(false)
  }
  return isSelectedList
}

export const RasterMenu: React.FC<ContainerProps> = ({ isShow, closeWindow, addLayer }) => {
  const [isSelectedList, setIsSelectedList] = useState(initialSelection())

  let optionList = []
  for (let i = 0; i < rasterMaps.length; i++) {
    optionList.push(
      <IonCard className={isSelectedList[i] ? 'selected_opt' : 'unselected_opt'}
               onClick={(e) => {
                 select(i)
                 addLayer(rasterMaps[i].layer)
               }}>
        <IonIcon class={'demo_raster_map_icon'} />
        <IonCardHeader>
          <IonCardTitle>{rasterMaps[i].title}</IonCardTitle>
          <IonCardSubtitle>{rasterMaps[i].subTitle}</IonCardSubtitle>
        </IonCardHeader>
        <div />
      </IonCard>
    )
  }

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
      <div className={'raster_menu_backdrop'} onClick={() => {
        closeWindow()
      }} />
      <div className={'raster_menu_scroll'}>
        {optionList}
      </div>
    </div>
  )
}