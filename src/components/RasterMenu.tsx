import React, { useEffect } from 'react'
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
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  currentRasterMapIndexState,
  isRasterMenuShow,
  age,
  animateRange,
} from '../functions/atoms'
import rasterMaps, { setCurrentRasterIndex } from '../functions/rasterMaps'
import { cesiumViewer } from '../functions/cesiumViewer'
import { WebMapTileServiceImageryProvider } from 'cesium'
import { timeout, timeRange } from '../functions/util'
import RotationModel, {
  rotationModels,
  setCurrentModel,
} from '../functions/rotationModel'
import { cachingServant } from '../functions/cache'
import { loadVectorLayers, getVectorLayers } from '../functions/vectorLayers'

interface ContainerProps {
  currentLayer: any
  setCurrentLayer: Function
  isViewerLoading: Function
  isCesiumViewerReady: boolean
}

export const RasterMenu: React.FC<ContainerProps> = ({
  currentLayer,
  setCurrentLayer,
  isViewerLoading,
  isCesiumViewerReady,
}) => {
  const [currentRasterMapIndex, setCurrentRasterMapIndex] = useRecoilState(
    currentRasterMapIndexState
  )
  const [isShow, setIsShow] = useRecoilState(isRasterMenuShow)
  const setAge = useSetRecoilState(age)
  const [range, setRange] = useRecoilState(animateRange)
  const [present, dismiss] = useIonLoading()

  const switchLayer = (provider: WebMapTileServiceImageryProvider) => {
    const newLayer = cesiumViewer.imageryLayers.addImageryProvider(provider)
    //if (currentLayer != null) {
    //cesiumViewer.imageryLayers.remove(currentLayer)
    //}
    setCurrentLayer(newLayer)
    // we don't remove the old layer immediately.
    // the "remove" is very fast to complete, but the "add" is slow.
    // if we remove the old layer immediately, user will see something underneath.
    // sometimes, we don't want to show user that.
    if (cesiumViewer.imageryLayers.length > 8) {
      cesiumViewer.imageryLayers.remove(cesiumViewer.imageryLayers.get(0), true)
    }
  }

  useEffect(() => {
    select(0)
  }, [isCesiumViewerReady]) //initial selection

  useEffect(() => {
    setCurrentRasterIndex(currentRasterMapIndex)
  }, [currentRasterMapIndex]) //update current raster index

  let optionList = []
  for (let i = 0; i < rasterMaps.length; i++) {
    optionList.push(
      <IonCard
        key={'raster-menu-element-' + i}
        className={
          currentRasterMapIndex === i ? 'selected-opt' : 'unselected-opt'
        }
        onClick={async (e) => {
          if (currentRasterMapIndex !== i) {
            select(i)
            await present({ message: 'Loading...' })
            switchLayer(rasterMaps[i].layer)
            await timeout(200)
            while (!isViewerLoading()) {
              await timeout(200)
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
  const select = async (index: number) => {
    setCurrentRasterMapIndex(index)
    setAge(0)
    if (rasterMaps.length > 0) {
      setRange({
        lower: rasterMaps[index].endTime,
        upper: rasterMaps[index].startTime,
      })
    }
    cesiumViewer?.entities.removeById('userLocation')

    //find out if the rotation model has been created
    //if not, create one
    if (index < rasterMaps.length) {
      let currentRaster = rasterMaps[index]
      let modelName = currentRaster.model
      if (modelName) {
        let m = rotationModels.get(modelName)
        if (!m) {
          let times = timeRange(
            currentRaster.startTime,
            currentRaster.endTime,
            currentRaster.step
          )
          await loadVectorLayers(modelName)
          m = new RotationModel(modelName, times, getVectorLayers(modelName))
          rotationModels.set(modelName, m)
        }
        setCurrentModel(m)
      }
    }
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
