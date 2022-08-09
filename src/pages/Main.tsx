import React, { useEffect, useState } from 'react'

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonPage,
  useIonLoading,
  useIonViewDidEnter,
} from '@ionic/react'

import {
  cogOutline,
  earthOutline,
  exitOutline,
  layersOutline,
  informationOutline,
} from 'ionicons/icons'

import './Main.scss'

import {
  Camera,
  Credit,
  GeographicTilingScheme,
  Ion,
  Rectangle,
  Viewer,
  WebMapTileServiceImageryProvider,
} from 'cesium'
import CustomToolbar from '../components/CustomToolbar'
import { SettingMenuPage } from './SettingMenuPage'
import AgeSlider from '../components/AgeSlider'
import { RasterMenu } from '../components/RasterMenu'
import { AboutPage } from './AboutPage'
import { sqlite } from '../App'
import { CachingService } from '../functions/cache'
import { AnimationService } from '../functions/animation'
import { StarrySky } from '../components/StarrySky'
import { SocialSharing } from '../components/SocialSharing'
import { VectorDataLayerMenu } from '../components/VectorDataLayerMenu'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  age,
  animateExact,
  animateFps,
  animateIncrement,
  animateLoop,
  animatePlaying,
  animateRange,
  backgroundIsStarry,
  isAboutPageShow,
  isRasterMenuShow,
  isVectorMenuShow,
  isSettingsMenuShow,
} from '../functions/atoms'
import { initCesiumViewer } from '../functions/cesiumViewer'
import { gplates_coastlines } from '../functions/DataLoader'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk'

let animationService: AnimationService
let cachingService: CachingService

//singleton cersium viewer
export let viewer: Viewer

const Main: React.FC = () => {
  const [present, dismiss] = useIonLoading()

  const [vectorData, setVectorData] = useState({})

  const setIsAboutPageShow = useSetRecoilState(isAboutPageShow)
  const setRasterMenuPageShow = useSetRecoilState(isRasterMenuShow)
  const [isSettingMenuPageShow, setMenuPageShow] =
    useRecoilState(isSettingsMenuShow)
  const setIsVectorDataLayerMenuShow = useSetRecoilState(isVectorMenuShow)

  // Animation
  const setAge = useSetRecoilState(age)
  const [exact, setExact] = useRecoilState(animateExact)
  const fps = useRecoilValue(animateFps)
  const increment = useRecoilValue(animateIncrement)
  const [loop, setLoop] = useRecoilState(animateLoop)
  const [playing, _setPlaying] = useRecoilState(animatePlaying)
  const [range, setRange] = useRecoilState(animateRange)

  animationService = new AnimationService(
    cachingService,
    setAge,
    exact,
    setExact,
    fps,
    increment,
    loop,
    setLoop,
    playing,
    _setPlaying,
    range,
    setRange,
    viewer
  )
  useEffect(() => {
    if (isSettingMenuPageShow) {
      animationService.setPlaying(false)
    }
  })

  //use [] to make this useEffect similar to componentDidMount
  useEffect(() => {
    if (document.getElementsByClassName('cesium-viewer').length === 0) {
      viewer = initCesiumViewer()
    }
  }, [])

  const isStarryBackgroundEnable = useRecoilValue(backgroundIsStarry)

  useIonViewDidEnter(async () => {
    // Initialize SQLite connection
    const db = await sqlite.createConnection(
      'db_main',
      false,
      'no-encryption',
      1
    )
    await db.open()
    cachingService = new CachingService(db)

    // Rough bounding box of Australia
    Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      112.8,
      -43.7,
      153.7,
      -10.4
    )
    if (document.getElementsByClassName('cesium-viewer').length === 0) {
      viewer = initCesiumViewer()
    }
    //maybe we don't need the initial value here
    let initialVectorLayer =
      viewer.imageryLayers.addImageryProvider(gplates_coastlines)
    setVectorData({ coastlines: initialVectorLayer })
  })

  const isViewerLoading = () => {
    return viewer.scene.globe.tilesLoaded
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <StarrySky />

        <div id="cesiumContainer" />
        <div id="credit" style={{ display: 'none' }} />
        <div className="toolbar-top">
          <AgeSlider
            buttons={<CustomToolbar scene={viewer?.scene} />}
            animationService={animationService}
          />
        </div>
        <IonFab
          vertical="bottom"
          horizontal="start"
          className={'toolbar-bottom'}
        >
          <IonFabButton
            onClick={() => {
              setRasterMenuPageShow(false)
            }}
          >
            <IonIcon
              src={'/assets/setting_menu_page/toolbox.svg'}
              style={{ fontSize: '2rem' }}
            />
          </IonFabButton>
          <IonFabList side="end">
            <IonFabButton
              onClick={() => {
                setMenuPageShow(true)
              }}
            >
              <IonIcon icon={cogOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={() => {
                setRasterMenuPageShow(true)
              }}
            >
              <IonIcon icon={earthOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={async () => {
                await SocialSharing(
                  viewer,
                  isStarryBackgroundEnable,
                  present,
                  dismiss
                )
              }}
            >
              <IonIcon icon={exitOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={async () => {
                setIsVectorDataLayerMenuShow(true)
              }}
            >
              <IonIcon icon={layersOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={() => {
                setIsAboutPageShow(true)
              }}
            >
              <IonIcon icon={informationOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/question_icon.svg'} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/question_icon.svg'} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/question_icon.svg'} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <div>
          <SettingMenuPage viewer={viewer} />
          <RasterMenu
            addLayer={(newLayer: any) => {
              viewer.imageryLayers.addImageryProvider(newLayer)
              // viewer.imageryLayers.remove()
            }}
            isViewerLoading={isViewerLoading}
          />
          <AboutPage />
          <VectorDataLayerMenu
            checkedVectorData={vectorData}
            setVectorData={setVectorData}
            addLayer={(newLayer: WebMapTileServiceImageryProvider) => {
              return viewer.imageryLayers.addImageryProvider(newLayer)
            }}
            removeLayer={(targetLayer: any) => {
              viewer.imageryLayers.remove(targetLayer)
            }}
            isViewerLoading={isViewerLoading}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Main
