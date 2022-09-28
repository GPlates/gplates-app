import React, { useEffect } from 'react'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonLoading,
} from '@ionic/react'

import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper'

import './RasterMenu.scss'
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil'
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
import { loadVectorLayers, getVectorLayers } from '../functions/vectorLayers'
import { createCesiumImageryProvider } from '../functions/dataLoader'

interface ContainerProps {
  currentLayer: any
  setCurrentLayer: Function
  isViewerLoading: Function
  isCesiumViewerReady: boolean
  setAgeSliderShown: SetterOrUpdater<boolean>
}

export const RasterMenu: React.FC<ContainerProps> = ({
  currentLayer,
  setCurrentLayer,
  isViewerLoading,
  isCesiumViewerReady,
  setAgeSliderShown,
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
      <SwiperSlide style={{ width: 'auto' }} key={i}>
        <IonCard
          key={'raster-menu-element-' + i}
          className={
            currentRasterMapIndex === i ? 'selected-opt' : 'unselected-opt'
          }
          onClick={async (e) => {
            if (currentRasterMapIndex !== i) {
              select(i)
              await present({ message: 'Loading...' })
              switchLayer(createCesiumImageryProvider(rasterMaps[i]))
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
      </SwiperSlide>
    )
  }

  // select the target one and unselect rest all
  const select = async (index: number) => {
    setCurrentRasterMapIndex(index)
    setAge(0)
    if (rasterMaps.length > 0) {
      const endTime = rasterMaps[index].endTime
      const startTime = rasterMaps[index].startTime
      setRange({
        lower: endTime,
        upper: startTime,
      })
      if (endTime === 0 && startTime === 0) {
        setAgeSliderShown(false)
      }
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
  let winWidth = screen.width
  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      <div
        className={'raster-menu-backdrop'}
        onClick={() => {
          setIsShow(false)
        }}
      />
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={30}
        navigation={true}
        freeMode={true}
        modules={[FreeMode, Navigation]}
        className="raster-menu-scroll"
      >
        {optionList}
      </Swiper>
    </div>
  )
}
