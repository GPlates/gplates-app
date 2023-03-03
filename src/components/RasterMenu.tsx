import React, { useEffect, useState } from 'react'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperType, { FreeMode, Navigation } from 'swiper'

import './RasterMenu.scss'
import {
  SetterOrUpdater,
  useRecoilState,
  useSetRecoilState,
  useRecoilValue,
} from 'recoil'
import {
  isRasterMenuShow,
  age,
  animateRange,
  showTimeStampState,
  rasterGroupState,
  currentRasterIDState,
} from '../functions/atoms'
import { getRasters, getRasterByID } from '../functions/rasterMaps'
import { cesiumViewer } from '../functions/cesiumViewer'
import { WebMapTileServiceImageryProvider } from 'cesium'
import { timeRange } from '../functions/util'
import RotationModel, {
  rotationModels,
  setCurrentModel,
} from '../functions/rotationModel'
import { loadVectorLayers, getVectorLayers } from '../functions/vectorLayers'
import { createCesiumImageryProvider } from '../functions/dataLoader'
import { AnimationService } from '../functions/animation'
import { RasterGroup } from '../functions/types'

interface ContainerProps {
  isViewerLoading: Function
  isCesiumViewerReady: boolean
  setAgeSliderShown: SetterOrUpdater<boolean>
  animationService: AnimationService
}

//
// RasterMenu funtional component
//
export const RasterMenu: React.FC<ContainerProps> = ({
  isCesiumViewerReady,
  setAgeSliderShown,
  animationService,
}) => {
  const [currentRasterID, setCurrentRasterID] =
    useRecoilState(currentRasterIDState)

  const [isShow, setIsShow] = useRecoilState(isRasterMenuShow)
  const setAge = useSetRecoilState(age)
  const setRange = useSetRecoilState(animateRange)
  const setShowTimeStampState = useSetRecoilState(showTimeStampState)

  const [swiper, setSwiper] = useState<SwiperType>()
  const rasterGroup = useRecoilValue(rasterGroupState)

  //
  // switch to another raster
  //
  const switchRaster = (provider: WebMapTileServiceImageryProvider) => {
    animationService.setPlaying(false)
    cesiumViewer.imageryLayers.addImageryProvider(provider)
    // we don't remove the old layer immediately.
    // the "remove" is very fast to complete, but the "add" is slow.
    // if we remove the old layer immediately, user will see something underneath.
    // sometimes, we don't want to show user that.
    if (cesiumViewer.imageryLayers.length > 8) {
      cesiumViewer.imageryLayers.remove(cesiumViewer.imageryLayers.get(0), true)
    }
  }

  //
  //
  //
  useEffect(() => {}, [isCesiumViewerReady]) //initial selection

  //
  //
  //
  useEffect(() => {}, [rasterGroup])

  //
  //
  //
  useEffect(() => {}, [currentRasterID]) // current raster ID changed

  let optionList = []
  let rasters = getRasters(rasterGroup)
  console.log(rasters)
  for (let i = 0; i < rasters.length; i++) {
    //if present-day raster,
    //skip all rasters with a rotation model
    if (rasterGroup == RasterGroup.present) {
      if (rasters[i].model) {
        continue
      }
    } else {
      //if paleo-rasters,
      //skip all rasters without a rotation model
      if (!rasters[i].model) {
        continue
      }
    }
    optionList.push(
      <SwiperSlide style={{ width: 'auto' }} key={rasters[i].id}>
        <IonCard
          key={'raster-menu-element-' + rasters[i].id}
          className={
            currentRasterID === rasters[i].id
              ? 'selected-opt'
              : 'unselected-opt'
          }
          onClick={async (e) => {
            if (currentRasterID !== rasters[i].id) {
              select(rasters[i].id)
              switchRaster(createCesiumImageryProvider(rasters[i]))
            }
          }}
        >
          <img
            src={rasters[i].icon}
            className={'raster-icon'}
            alt={rasters[i].title}
          />
          <IonCardHeader>
            <IonCardTitle>{rasters[i].title}</IonCardTitle>
            <IonCardSubtitle>{rasters[i].subTitle}</IonCardSubtitle>
          </IonCardHeader>
          <div />
        </IonCard>
      </SwiperSlide>
    )
  }

  //
  // select the current raster and deselect all others
  //
  const select = async (rasterID: string) => {
    setCurrentRasterID(rasterID)

    setAge(0)

    let raster = getRasterByID(rasterID)
    if (raster) {
      const endTime = raster.endTime
      const startTime = raster.startTime
      setRange({
        lower: endTime,
        upper: startTime,
      })
      //hide the time widget and time slider if the raster is present-day only
      if (endTime === 0 && startTime === 0) {
        setAgeSliderShown(false)
        setShowTimeStampState(false)
      } else {
        setShowTimeStampState(true)
      }
    }
    cesiumViewer?.entities.removeById('userLocation')

    //find out if the rotation model has been created
    //if not, create one
    if (raster) {
      let modelName = raster.model
      if (modelName) {
        let m = rotationModels.get(modelName)
        if (!m) {
          let times = timeRange(raster.startTime, raster.endTime, raster.step)
          await loadVectorLayers(modelName)
          m = new RotationModel(modelName, times, getVectorLayers(modelName))
          rotationModels.set(modelName, m)
        }
        setCurrentModel(m)
      }
    }
  } //end of select()

  swiper?.destroy() //destroy the old swiper instance. a new one will be created.
  //
  //
  //
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
        centeredSlides={true}
        initialSlide={0}
        watchOverflow={true}
        freeMode={true}
        modules={[FreeMode, Navigation]}
        className="raster-menu-scroll"
        onSwiper={(swiper) => setSwiper(swiper)}
      >
        {optionList}
      </Swiper>
    </div>
  )
}
