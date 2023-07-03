import React, { useEffect, useState } from 'react'
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
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
  ageState,
  animateRange,
  showTimeStampState,
  rasterGroupState,
  currentRasterIDState,
} from '../functions/atoms'
import { getRasters } from '../functions/rasterMaps'
import {
  cesiumViewer,
  pruneLayers,
  drawBasemap,
} from '../functions/cesiumViewer'
import { timeRange } from '../functions/util'
import { raiseGraticuleLayerToTop } from '../functions/graticule'
import RotationModel, {
  rotationModels,
  setCurrentModel,
} from '../functions/rotationModel'
import { loadVectorLayers, getVectorLayers } from '../functions/vectorLayers'
import { AnimationService } from '../functions/animation'
import { RasterCfg, RasterGroup } from '../functions/types'
import { closeCircleOutline } from 'ionicons/icons'
import { DEBUG } from '../functions/settings'

interface ContainerProps {
  isViewerLoading: Function
  isCesiumViewerReady: boolean
  setAgeSliderShown: SetterOrUpdater<boolean>
  animationService: AnimationService
}

/**
 * RasterMenu funtional component
 *
 * @param param0
 * @returns
 */
export const RasterMenu: React.FC<ContainerProps> = ({
  isCesiumViewerReady,
  setAgeSliderShown,
  animationService,
}) => {
  const [currentRasterID, setCurrentRasterID] =
    useRecoilState(currentRasterIDState)

  const [isShow, setIsShow] = useRecoilState(isRasterMenuShow)
  const [age, setAge] = useRecoilState(ageState)
  const setRange = useSetRecoilState(animateRange)
  const setShowTimeStampState = useSetRecoilState(showTimeStampState)

  const [swiper, setSwiper] = useState<SwiperType>()
  const rasterGroup = useRecoilValue(rasterGroupState)

  /**
   * switch to another basemap
   *
   * @param raster - new basemap configuration
   */
  const switchBasemap = async (raster: RasterCfg) => {
    if (DEBUG) {
      console.log(
        'Length of Imagery Layers: ',
        cesiumViewer.imageryLayers.length
      )
      console.log(cesiumViewer.imageryLayers)
    }

    //stop the animation if necessary
    animationService.setPlaying(false)

    drawBasemap(raster)

    let rasterID = raster.id

    setCurrentRasterID(rasterID)

    if (age != 0) {
      setAge(0)
    }

    if (raster) {
      const endTime = raster.startTime
      const startTime = raster.endTime
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

    if (cesiumViewer.entities.getById('userLocation')) {
      if (!cesiumViewer.entities.removeById('userLocation')) {
        console.log('Failed to remove user location.')
      }
    }

    //find out if the rotation model has been created
    //if not, create one
    if (raster) {
      if (!getVectorLayers(raster.id)) {
        loadVectorLayers(raster.id)
      }
      let modelName = raster.model
      if (modelName) {
        let m = rotationModels.get(modelName)
        if (!m) {
          let times = timeRange(raster.startTime, raster.endTime, raster.step)

          m = new RotationModel(modelName, times)
          rotationModels.set(modelName, m)
        }
        setCurrentModel(m)
      } else {
        setCurrentModel(undefined) //present-day only raster, no reconstruction model
      }
    }

    raiseGraticuleLayerToTop() //raise graticlue layer if enabled

    // we don't remove the old layer immediately.
    // the "remove" is very fast to complete, but the "add" is slow.
    // if we remove the old layer immediately, user will see something underneath.
    // sometimes, we don't want to show user that.
    //pruneLayers()
  }

  /**
   *
   */
  useEffect(() => {}, [isCesiumViewerReady]) //initial selection

  /**
   *
   */
  useEffect(() => {}, [rasterGroup])

  /**
   *
   */
  useEffect(() => {}, [currentRasterID]) // current raster ID changed

  let optionList = []
  let rasters = getRasters(rasterGroup)
  //console.log(rasters)
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
              switchBasemap(rasters[i])
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

  //swiper?.destroy(true, false) //destroy the old swiper instance. a new one will be created.

  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      {/*<div
        className={'raster-menu-backdrop'}
        onClick={() => {
          setIsShow(false)
        }}
      />*/}

      <IonIcon
        className="raster-menu-close-button"
        icon={closeCircleOutline}
        size="large"
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
