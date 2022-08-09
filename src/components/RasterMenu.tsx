import React, { useState } from 'react'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  useIonLoading,
} from '@ionic/react'

import './RasterMenu.scss'
import { chevronBack, chevronForward } from 'ionicons/icons'
import {
  rasterData,
  createCesiumImageryProvider,
} from '../functions/DataLoader'
import { RasterCfg } from '../functions/types'
import { useRecoilState } from 'recoil'
import { isRasterMenuShow, rasterMapState } from '../functions/atoms'
import { viewer } from '../pages/Main'

const failSafeRasterMaps = [
  {
    layer: rasterData['geology'],
    title: 'Geology',
    subTitle: 'present day',
    icon: 'assets/raster_menu/geology-256x256.png',
  },
  {
    layer: rasterData['agegrid'],
    title: 'Agegrid',
    subTitle: 'present day',
    icon: 'assets/raster_menu/agegrid-256x256.png',
  },
  {
    layer: rasterData['topography'],
    title: 'Topography',
    subTitle: 'present day',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
]

let rasterMaps = failSafeRasterMaps

interface ContainerProps {
  addLayer: Function
  isViewerLoading: Function
}

function initialSelection(rasterMaps: RasterCfg[]) {
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
  addLayer,
  isViewerLoading,
}) => {
  const [isShow, setIsShow] = useRecoilState(isRasterMenuShow)
  //const [rasterMaps, setRasterMaps] = useRecoilState(rasterMapState)
  const [isSelectedList, setIsSelectedList] = useState(
    initialSelection(rasterMaps) //fix me
  )
  const [present, dismiss] = useIonLoading()

  let optionList = []
  for (let i = 0; i < rasterMaps.length; i++) {
    optionList.push(
      <IonCard
        key={'raster-menu-element-' + i}
        className={isSelectedList[i] ? 'selected-opt' : 'unselected-opt'}
        onClick={async (e) => {
          if (!isSelectedList[i]) {
            select(i)
            await present({ message: 'Loading...' })
            //addLayer(rasterMaps[i].layer)
            //addLayer(rasterData['geology'])
            viewer.imageryLayers.addImageryProvider(rasterData['geology'])
            await delay(500)
            while (!isViewerLoading()) {
              await delay(500)
            }
            await dismiss()
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
          setIsShow(false)
        }}
      />
      <div className={'raster-menu-scroll'}>{optionList}</div>
      <IonIcon icon={chevronForward} className={'raster-menu-arrow right'} />
      <IonIcon icon={chevronBack} className={'raster-menu-arrow left'} />
    </div>
  )
}
