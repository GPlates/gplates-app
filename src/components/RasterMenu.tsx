import React, { useState, useEffect } from 'react'
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
import { useRecoilState } from 'recoil'
import { isRasterMenuShow } from '../functions/atoms'
import { getRasterMap } from '../functions/rasterMap'
import { RasterCfg } from '../functions/types'
import { viewer } from '../pages/Main'
import { WebMapTileServiceImageryProvider } from 'cesium'

interface ContainerProps {
  currentLayer: any
  setCurrentLayer: Function
  isViewerLoading: Function
}

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const RasterMenu: React.FC<ContainerProps> = ({
  currentLayer,
  setCurrentLayer,
  isViewerLoading,
}) => {
  const [isSelectedList, setIsSelectedList] = useState([] as boolean[])
  const [isShow, setIsShow] = useRecoilState(isRasterMenuShow)
  const [rasterMaps, setRasterMaps] = useState([] as RasterCfg[])
  //LOOK HERE!
  //use useRecoilState here will cause strange "assign readonly" error at "addLayer(rasterMaps[i].layer)"
  //const [rasterMaps, setRasterMaps] = useRecoilState(rasterMapState)
  const [present, dismiss] = useIonLoading()

  const switchLayer = (provider: WebMapTileServiceImageryProvider) => {
    const newLayer = viewer.imageryLayers.addImageryProvider(provider, 1)
    if (currentLayer != null) {
      viewer.imageryLayers.remove(currentLayer)
    }
    setCurrentLayer(newLayer)
  }

  useEffect(() => {
    //TODO: save in localstorage
    getRasterMap((rasters: RasterCfg[]) => {
      setRasterMaps(rasters)
      select(0)
      switchLayer(rasters[0].layer)
    })
  }, []) //use [] to simulate componentDidMount

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
            switchLayer(rasterMaps[i].layer)
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
