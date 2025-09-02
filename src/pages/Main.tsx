import React, { useEffect, useState, useRef } from 'react'
import { SplashScreen } from '@capacitor/splash-screen'
import {
  IonContent,
  IonPage,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonToast,
  useIonAlert,
} from '@ionic/react'

import './Main.scss'

import { Ion } from 'cesium'
import CustomToolbar from '../components/CustomToolbar'
import { SettingMenuPage } from './SettingMenuPage'
import AgeSlider from '../components/AgeSlider'
import { RasterMenu } from '../components/RasterMenu'
import MajorCities from '../components/MajorCities'
import { AboutPage } from './AboutPage'
import { ModelInfo } from './ModelInfo'
import { CacheInfo } from './CacheInfo'
import { cachingServant } from '../functions/cache'
import { AnimationService } from '../functions/animation'
import { StarrySky } from '../components/StarrySky'
import { VectorDataLayerMenu } from '../components/VectorDataLayerMenu'
import {
  ageState,
  animateExact,
  animateFps,
  animateIncrement,
  animateLoop,
  animatePlaying,
  animateRange,
  backgroundIsStarry,
  isSettingsMenuShow,
  backgroundIsEnabled,
  backgroundIsCustom,
  backgroundColor,
  appDarkMode,
  isAddLocationWidgetShowState,
  networkDownloadOnCellular,
  isAgeSliderShown,
  rasterGroupState,
  currentRasterIDState,
  showTimeStampState,
} from '../functions/appStates'
import { cesiumViewer, initCesiumViewer } from '../functions/cesiumViewer'
import rasterMaps, {
  loadRasterMaps,
  getPaleoRasters,
  getPresentDayRasters,
} from '../functions/rasterMaps'
import { BackgroundService } from '../functions/background'
import { Preferences } from '@capacitor/preferences'
import { setDarkMode } from '../functions/darkMode'
import { serverURL } from '../functions/settings'
import { GraphPanel } from '../components/GraphPanel'
import AddLocationWidget from '../components/AddLocationWidget'
import { ToolMenu } from '../components/ToolMenu'
import { timeRange } from '../functions/util'
import RotationModel, { rotationModels } from '../functions/rotationModel'
import { init as initDefaultStorage } from '../functions/storage'
import { loadVectorLayers, getVectorLayers } from '../functions/vectorLayers'
import { createCesiumImageryProvider } from '../functions/cesiumViewer'
import { setPresentDataAlert } from '../functions/network'
import NetworkIndicator from '../components/NetworkIndicator'
import { DEBUG } from '../functions/settings'
import {
  useAppState,
  useAppStateValue,
  useSetAppState,
} from '../functions/appStates'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk'

let animationService: AnimationService
let backgroundService: BackgroundService

const Main: React.FC = () => {
  const isSettingsShown = useAppStateValue(isSettingsMenuShow)
  const [showAddLocationWidget, setShowAddLocationWidget] = useAppState(
    isAddLocationWidgetShowState,
  )
  const ionAlert = useIonAlert()

  // Animation
  const setAge = useSetAppState(ageState)
  const [exact, setExact] = useAppState(animateExact)
  const [fps, setFps] = useAppState(animateFps)
  const [increment, setIncrement] = useAppState(animateIncrement)
  const [loop, setLoop] = useAppState(animateLoop)
  const [playing, _setPlaying] = useAppState(animatePlaying)
  const [range, setRange] = useAppState(animateRange)

  // App
  const _setDarkMode = useSetAppState(appDarkMode)
  const setDownloadOnCellular = useSetAppState(networkDownloadOnCellular)

  // Background
  const [isBackgroundSettingEnable, setIsBackgroundSettingEnable] =
    useAppState(backgroundIsEnabled)
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] =
    useAppState(backgroundIsStarry)
  const [
    isCustomisedColorBackgroundEnable,
    setIsCustomisedColorBackgroundEnable,
  ] = useAppState(backgroundIsCustom)
  const [color, setColor] = useAppState(backgroundColor)

  // Raster
  const setAgeSliderShown = useSetAppState(isAgeSliderShown)
  const [isRasterMapsLoaded, setIsRasterMapsLoaded] = useState(false)
  const [isCesiumViewerReady, setIsCesiumViewerReady] = useState(false)

  const [currentRasterID, setCurrentRasterID] =
    useAppState(currentRasterIDState)
  const rasterGroup = useAppStateValue(rasterGroupState)
  const setShowTimeStamp = useSetAppState(showTimeStampState)
  const [isOffline, setIsOffline] = useState(false)
  //we don't show message if the app is online at startup
  const isStartupOnline = useRef(true)

  const [presentToast, dismissToast] = useIonToast()

  animationService = new AnimationService(
    cachingServant,
    setAge,
    exact,
    fps,
    increment,
    loop,
    playing,
    _setPlaying,
    range,
    cesiumViewer,
    currentRasterID,
    rasterGroup,
  )

  backgroundService = new BackgroundService(
    isBackgroundSettingEnable,
    isStarryBackgroundEnable,
    isCustomisedColorBackgroundEnable,
    color,
    cesiumViewer,
  )

  setPresentDataAlert(ionAlert, setDownloadOnCellular)

  useEffect(() => {
    if (isSettingsShown && playing) {
      animationService.setPlaying(false)
    }
  })

  useEffect(() => {
    if (isOffline) {
      presentToast({
        buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
        duration: 15000,
        message: 'Network is unavailable',
        onDidDismiss: () => {},
      })
    } else {
      if (!isStartupOnline.current) {
        presentToast({
          buttons: [
            {
              text: 'Reload App',
              role: 'reload',
              handler: () => {
                window.location.reload()
              },
            },
            { text: 'Dismiss', handler: () => dismissToast() },
          ],
          duration: 15000,
          message: 'Back online',
          onDidDismiss: () => {},
        })
      }
    }
    isStartupOnline.current = false
  }, [isOffline])

  //use [] to make this useEffect similar to componentDidMount
  useEffect(() => {
    //initialize the default local storage
    initDefaultStorage()

    //initalize the network monitor, report network outage
    networkMonitor(setIsOffline)

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

      if (DEBUG) console.log('DEBUG: raster maps loaded!')
      setIsRasterMapsLoaded(true) //notify the raster maps have been loaded.

      //init Ceium viewer if has not been done yet
      if (document.getElementsByClassName('cesium-viewer').length === 0) {
        let rasters = getPresentDayRasters()
        if (rasters.length == 0) {
          rasters = getPaleoRasters()
        } else {
          setShowTimeStamp(false)
        }
        if (rasters.length > 0) {
          initCesiumViewer(createCesiumImageryProvider(rasters[0]))
          setCurrentRasterID(rasters[0].id)
        }

        setIsCesiumViewerReady(true) //notify the Ceium viewer is ready
        if (DEBUG) console.log('DEBUG: Ceium viewer is ready!')

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
              settings.isCustomisedColorBackgroundEnable,
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
        Preferences.get({ key: 'networkSettings' }).then((res) => {
          if (res?.value) {
            const settings = JSON.parse(res.value)
            setDownloadOnCellular(settings.downloadOnCellular)
          }
        })
      } //end of init Ceium viewer

      //create a rotation model for each raster
      rasterMaps.forEach(async (raster) => {
        if (!getVectorLayers(raster.id)) {
          loadVectorLayers(raster.id)
        }
        let modelName = raster.model
        if (modelName) {
          let m = rotationModels.get(modelName)
          if (!m) {
            let times = [0]
            if (Math.abs(raster.step) > 0) {
              times = timeRange(raster.startTime, raster.endTime, raster.step)
            }

            m = new RotationModel(modelName, times)
            //console.log(getVectorLayers(modelName))
            rotationModels.set(modelName, m)
          }
        }
      })
      if (DEBUG) console.log('DEBUG: rotation models have been created!')

      //add more init code here

      //start to populate cache
      //keep this the last initialization call
      //populateCache()
    }) // end of load raster maps callback
  }, [])

  //
  useIonViewDidEnter(() => {})

  //only save the DB to disk on "web" platform
  //do not close the DB connection here!!!
  //let's keep the DB connection valid all the time
  //I guess it is OK if the DB connection is still open when the app exits.
  //not ideal, but OK for this App
  useIonViewDidLeave(() => {
    cachingServant.saveToWebStore()
  })

  //todo: this is not working for single tile imagery provider
  const isViewerLoading = () => {
    return cesiumViewer.scene.globe.tilesLoaded
  }

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <StarrySky />

        <div id="cesiumContainer" />
        <div id="credit" style={{ display: 'none' }} />
        <div className="toolbar-top">
          <AgeSlider
            buttons={<CustomToolbar scene={cesiumViewer?.scene} />}
            animationService={animationService}
          />
        </div>
        <ToolMenu />
        <AddLocationWidget
          show={showAddLocationWidget}
          setShow={setShowAddLocationWidget}
        />
        <div className="network-indicator">
          <NetworkIndicator />
        </div>

        <div>
          <SettingMenuPage backgroundService={backgroundService} />
          <RasterMenu
            isViewerLoading={isViewerLoading}
            isCesiumViewerReady={isCesiumViewerReady}
            setAgeSliderShown={setAgeSliderShown}
            animationService={animationService}
          />
          <AboutPage />
          <ModelInfo />
          <CacheInfo />
          <VectorDataLayerMenu />
          <GraphPanel />
        </div>
        <MajorCities />
      </IonContent>
    </IonPage>
  )
}

const networkMonitor = (setIsOffline: any) => {
  setInterval(() => {
    if (!globalThis.navigator.onLine) {
      setIsOffline(true)
    } else {
      setIsOffline(false)
    }
  }, 3 * 1000)
}

export default Main
