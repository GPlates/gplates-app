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
  statsChartOutline,
  addOutline,
} from 'ionicons/icons'

import './Main.scss'

import {
  Camera,
  Ion,
  Rectangle,
  Viewer,
  WebMapTileServiceImageryProvider,
  Color,
  Cartographic,
  Cartesian3,
  Cartesian2,
  Entity,
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
  appDarkMode,
  isGraphPanelShowState,
} from '../functions/atoms'
import { initCesiumViewer } from '../functions/cesiumViewer'
import rasterMaps, { loadRasterMaps } from '../functions/rasterMaps'
import { BackgroundService } from '../functions/background'
import { Preferences } from '@capacitor/preferences'
import { setDarkMode } from '../functions/darkMode'
import { serverURL } from '../functions/settings'
import { GraphPanel } from '../components/GraphPanel'
import AddLocationWidget from '../components/AddLocationWidget'

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
  const [isGraphPanelShow, setIsGraphPanelShow] = useRecoilState(
    isGraphPanelShowState
  )
  const [showAddLocationWidget, setShowAddLocationWidget] = useState(false)

  // Animation
  const setAge = useSetRecoilState(age)
  const _setDarkMode = useSetRecoilState(appDarkMode)
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
    loadRasterMaps((networkFail: boolean) => {
      //if the network is not working
      if (networkFail) {
        presentToast({
          buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
          duration: 5000,
          message:
            'Failed to load raster maps from server(' +
            serverURL +
            '). Check your server URL setting.',
          onDidDismiss: () => {},
        })
      }

      setIsRasterMapsLoaded(true) //notify the raster maps have been loaded.

      //init Ceium viewer if has not been done yet
      if (document.getElementsByClassName('cesium-viewer').length === 0) {
        cesiumViewer = initCesiumViewer(rasterMaps[0].layer)
        setIsCesiumViewerReady(true) //notify the Ceium view is ready

        // Load settings
        Preferences.get({ key: 'animationSettings' }).then((res) => {
          if (res?.value) {
            const settings = JSON.parse(res.value)
            setExact(settings.exact)
            setFps(settings.fps)
            setIncrement(settings.increment)
            setLoop(settings.loop)
            setRange(settings.range)
          }
        })
        Preferences.get({ key: 'appSettings' }).then((res) => {
          if (res?.value) {
            const settings = JSON.parse(res.value)
            _setDarkMode(settings.darkMode)
            setDarkMode(settings.darkMode)
          } else {
            setDarkMode()
          }
        })
        Preferences.get({ key: 'backgroundSettings' }).then((res) => {
          if (res?.value) {
            const settings = JSON.parse(res.value)
            setIsBackgroundSettingEnable(settings.isBackgroundSettingEnable)
            setIsStarryBackgroundEnable(settings.isStarryBackgroundEnable)
            setIsCustomisedColorBackgroundEnable(
              settings.isCustomisedColorBackgroundEnable
            )
            setColor(settings.color)
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
        <AddLocationWidget show={showAddLocationWidget} />
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
            <IonFabButton
              onClick={() => {
                setIsGraphPanelShow(!isGraphPanelShow)
              }}
            >
              <IonIcon icon={statsChartOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={() => {
                setShowAddLocationWidget(!showAddLocationWidget)
                var pointerEntity: Entity
                cesiumViewer.camera.changed.addEventListener(function (
                  percentage
                ) {
                  let ray = cesiumViewer.scene.camera.getPickRay(
                    new Cartesian2(
                      cesiumViewer.scene.canvas.clientWidth / 2,
                      cesiumViewer.scene.canvas.clientHeight / 2
                    )
                  )

                  if (ray != undefined) {
                    var p = cesiumViewer.scene.globe.pick(
                      ray,
                      cesiumViewer.scene
                    )
                    if (pointerEntity)
                      cesiumViewer.entities.remove(pointerEntity)
                    pointerEntity = cesiumViewer.entities.add({
                      name: 'center',
                      position: p,
                      point: {
                        color: Color.BLACK,
                        pixelSize: 10,
                        outlineColor: Color.YELLOW,
                        outlineWidth: 3,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                      },
                    })
                  }
                })
              }}
            >
              <IonIcon icon={addOutline} />
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
          <GraphPanel />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Main
