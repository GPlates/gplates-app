import React, { useEffect, useState } from 'react'
import { SplashScreen } from '@capacitor/splash-screen'
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonPage,
  useIonLoading,
  useIonViewDidEnter,
  useIonToast,
} from '@ionic/react'

import {
  cogOutline,
  earthOutline,
  layersOutline,
  informationOutline,
  shareSocialOutline,
  helpOutline,
} from 'ionicons/icons'

import './Main.scss'

import {
  Camera,
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
import { useRecoilState, useSetRecoilState } from 'recoil'
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
  backgroundIsEnabled,
  backgroundIsCustom,
  backgroundColor,
} from '../functions/atoms'
import { initCesiumViewer } from '../functions/cesiumViewer'
import { gplates_coastlines } from '../functions/DataLoader'
import rasterMaps, { loadRasterMaps } from '../functions/rasterMaps'
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences'
import { BackgroundService } from '../functions/background'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk'

let animationService: AnimationService
let backgroundService: BackgroundService
let cachingService: CachingService

//singleton cersium viewer
export let cesiumViewer: Viewer

const Main: React.FC = () => {
  const [present, dismiss] = useIonLoading()

  const [vectorData, setVectorData] = useState({})
  const [rasterMenuCurrentLayer, setRasterMenuCurrentLayer] = useState(null)
  const setIsAboutPageShow = useSetRecoilState(isAboutPageShow)
  const setRasterMenuPageShow = useSetRecoilState(isRasterMenuShow)
  const [isSettingMenuPageShow, setMenuPageShow] =
    useRecoilState(isSettingsMenuShow)
  const setIsVectorDataLayerMenuShow = useSetRecoilState(isVectorMenuShow)

  // Animation
  const setAge = useSetRecoilState(age)
  const [exact, setExact] = useRecoilState(animateExact)
  const [fps, setFps] = useRecoilState(animateFps)
  const [increment, setIncrement] = useRecoilState(animateIncrement)
  const [loop, setLoop] = useRecoilState(animateLoop)
  const [playing, _setPlaying] = useRecoilState(animatePlaying)
  const [range, setRange] = useRecoilState(animateRange)

  // Background
  const [isBackgroundSettingEnable, setIsBackgroundSettingEnable] =
    useRecoilState(backgroundIsEnabled)
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] =
    useRecoilState(backgroundIsStarry)
  const [
    isCustomisedColorBackgroundEnable,
    setIsCustomisedColorBackgroundEnable,
  ] = useRecoilState(backgroundIsCustom)
  const [color, setColor] = useRecoilState(backgroundColor)

  const [isRasterMapsLoaded, setIsRasterMapsLoaded] = useState(false)
  const [isCesiumViewerReady, setIsCesiumViewerReady] = useState(false)

  const [presentToast, dismissToast] = useIonToast()

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
    cesiumViewer
  )
  backgroundService = new BackgroundService(
    isBackgroundSettingEnable,
    isStarryBackgroundEnable,
    isCustomisedColorBackgroundEnable,
    color,
    cesiumViewer
  )

  useEffect(() => {
    if (isSettingMenuPageShow) {
      animationService.setPlaying(false)
    }
  })

  //use [] to make this useEffect similar to componentDidMount
  useEffect(() => {
    //load the raster maps from gplates server or localstorage
    loadRasterMaps(() => {
      setIsRasterMapsLoaded(true)
      if (document.getElementsByClassName('cesium-viewer').length === 0) {
        cesiumViewer = initCesiumViewer(rasterMaps[0].layer)
        setIsCesiumViewerReady(true)

        // Load settings
        document.addEventListener('deviceready', () => {
          AppPreferences.fetch('settings', 'animation').then((res) => {
            if (res) {
              setExact(res.exact)
              setFps(res.fps)
              setIncrement(res.increment)
              setLoop(res.loop)
              setRange(res.range)
            }
          })
          AppPreferences.fetch('settings', 'background').then((res) => {
            if (res) {
              setIsBackgroundSettingEnable(res.isBackgroundSettingEnable)
              setIsStarryBackgroundEnable(res.isStarryBackgroundEnable)
              setIsCustomisedColorBackgroundEnable(
                res.isCustomisedColorBackgroundEnable
              )
              setColor(res.color)
              setTimeout(() => {
                backgroundService.changeBackground()
                SplashScreen.hide()
              }, 200)
            } else {
              setTimeout(() => {
                SplashScreen.hide()
              }, 200)
            }
          })
        })

        //maybe we don't need the initial value here
        let initialVectorLayer =
          cesiumViewer.imageryLayers.addImageryProvider(gplates_coastlines)
        setVectorData({ coastlines: initialVectorLayer })
      }
    })
  }, [])

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
  })

  const isViewerLoading = () => {
    return cesiumViewer.scene.globe.tilesLoaded
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <StarrySky />

        <div id="cesiumContainer" />
        <div id="credit" style={{ display: 'none' }} />
        <div className="toolbar-top">
          <AgeSlider
            buttons={<CustomToolbar scene={cesiumViewer?.scene} />}
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
                  present,
                  dismiss,
                  presentToast,
                  dismissToast
                )
              }}
            >
              <IonIcon icon={shareSocialOutline}></IonIcon>
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
              <IonIcon icon={helpOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={helpOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={helpOutline} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <div>
          <SettingMenuPage backgroundService={backgroundService} />
          <RasterMenu
            currentLayer={rasterMenuCurrentLayer}
            setCurrentLayer={setRasterMenuCurrentLayer}
            isViewerLoading={isViewerLoading}
            isCesiumViewerReady={isCesiumViewerReady}
          />
          <AboutPage />
          <VectorDataLayerMenu
            checkedVectorData={vectorData}
            setVectorData={setVectorData}
            addLayer={(newLayer: WebMapTileServiceImageryProvider) => {
              return cesiumViewer.imageryLayers.addImageryProvider(newLayer)
            }}
            removeLayer={(targetLayer: any) => {
              cesiumViewer.imageryLayers.remove(targetLayer)
            }}
            isViewerLoading={isViewerLoading}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Main
