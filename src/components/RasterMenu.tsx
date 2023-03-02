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
  currentRasterMapIndexState,
  isRasterMenuShow,
  age,
  animateRange,
  showTimeStampState,
  rasterGroupState,
} from '../functions/atoms'
import { getRasters } from '../functions/rasterMaps'
import { cesiumViewer } from '../functions/cesiumViewer'
import { WebMapTileServiceImageryProvider } from 'cesium'
import { timeout, timeRange } from '../functions/util'
import RotationModel, {
  rotationModels,
  setCurrentModel,
} from '../functions/rotationModel'
import { loadVectorLayers, getVectorLayers } from '../functions/vectorLayers'
import { createCesiumImageryProvider } from '../functions/dataLoader'
import { AnimationService } from '../functions/animation'
import { RasterCfg, RasterGroup } from '../functions/types'

let rasterMaps: RasterCfg[] = []

interface ContainerProps {
  isViewerLoading: Function
  isCesiumViewerReady: boolean
  setAgeSliderShown: SetterOrUpdater<boolean>
  animationService: AnimationService
}

//
//
//
export const RasterMenu: React.FC<ContainerProps> = ({
  isCesiumViewerReady,
  setAgeSliderShown,
  animationService,
}) => {
  const [currentRasterMapIndex, setCurrentRasterMapIndex] = useRecoilState(
    currentRasterMapIndexState
  )
  const [isShow, setIsShow] = useRecoilState(isRasterMenuShow)
  const setAge = useSetRecoilState(age)
  const setRange = useSetRecoilState(animateRange)
  const setShowTimeStampState = useSetRecoilState(showTimeStampState)

  const [swiper, setSwiper] = useState<SwiperType>()
  const [rasterGroup, setRasterGroup] = useRecoilState(rasterGroupState)

  //
  //
  //
  const switchLayer = (provider: WebMapTileServiceImageryProvider) => {
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
  useEffect(() => {
    //by default, select the raster icon in the middle.
    /*
    let middle = Math.floor(getNumberOfRasters() / 2)
    console.log(middle)
    select(middle)
    swiper?.slideTo(middle)
    */
  }, [isCesiumViewerReady]) //initial selection

  //
  //
  //
  useEffect(() => {
    rasterMaps = getRasters(rasterGroup)
    //select the raster icon in the middle.
    let middle = Math.floor(rasterMaps.length / 2)
    //console.log(middle)
    select(middle)
    swiper?.slideTo(middle)
  }, [rasterGroup])

  //
  //
  //
  useEffect(() => {}, [currentRasterMapIndex]) //update current raster index

  let optionList = []
  for (let i = 0; i < rasterMaps.length; i++) {
    //if present-day raster,
    //skip all rasters with a rotation model
    if (rasterGroup == RasterGroup.present) {
      if (rasterMaps[i].model) {
        continue
      }
    } else {
      //if paleo-rasters,
      //skip all rasters without a rotation model
      if (!rasterMaps[i].model) {
        continue
      }
    }
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
              switchLayer(createCesiumImageryProvider(rasterMaps[i]))
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

  //
  // select the current raster and deselect all others
  //
  const select = async (index: number) => {
    setCurrentRasterMapIndex(index)

    setAge(0)
    if (rasterMaps.length > index) {
      const endTime = rasterMaps[index].endTime
      const startTime = rasterMaps[index].startTime
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
  } //end of select()

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
