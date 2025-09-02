import { Preferences } from '@capacitor/preferences'
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonRippleEffect,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform,
  useIonAlert,
} from '@ionic/react'
import { chevronBack, chevronForward } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
//import { useNavigate } from 'react-router'
import { useHistory } from 'react-router'
//import { CSSTransition } from 'react-transition-group'
import {
  useAppState,
  useAppStateValue,
  useSetAppState,
} from '../functions/appStates'
import { BackgroundColorSettings } from '../components/BackgroundColorSettings'
import {
  appDarkMode,
  currentRasterIDState,
  isAgeSliderShown,
  isCacheInfoShowState,
  isSettingsMenuShow,
  networkDownloadOnCellular,
  settingsPath,
} from '../functions/appStates'
import { BackgroundService } from '../functions/background'
import { cachingServant } from '../functions/cache'
import { setDarkMode, setStatusBarTheme } from '../functions/darkMode'
import {
  hideGraticule,
  setShowGraticuleFlag,
  showGraticule,
  showGraticuleFlag,
} from '../functions/graticule'
import rasterMaps, { getRasterByID } from '../functions/rasterMaps'
import { rotationModels } from '../functions/rotationModel'
import { serverURL, setServerURL } from '../functions/settings'
import { AnimationSettings } from './AnimationSettings'
import { getCacheStatsData } from './CacheInfo'
import './SettingMenuPage.scss'

//
const titles: { [key: string]: string } = {
  root: 'Settings',
  animation: 'Animation Settings',
  backgroundSetting: 'Background Settings',
}

/**
 * try to cache everything. not in use for now
 */
export const populateCache = () => {
  let count = 0
  rasterMaps.forEach(async (raster) => {
    let modelName = raster.model
    if (modelName) {
      let m = rotationModels.get(modelName)
      if (m) {
        let rowNum = await cachingServant.getCount(raster.layerName)
        //check if the layer has been cached.
        if (rowNum < m.times.length) {
          setTimeout(
            () =>
              cachingServant.cacheRasterLayer(
                m!,
                raster.wmsUrl,
                raster.layerName,
              ),
            count * 1000,
          )
          count += m.times.length
        }
      }
    }
  })
}

/**
 *
 */
interface ContainerProps {
  backgroundService: BackgroundService
}

/**
 * main component for setting menu
 *
 * @param param0
 * @returns
 */
export const SettingMenuPage: React.FC<ContainerProps> = ({
  backgroundService,
}) => {
  const [darkMode, _setDarkMode] = useAppState(appDarkMode)
  const [downloadOnCellular, setDownloadOnCellular] = useAppState(
    networkDownloadOnCellular,
  )
  const [path, setPath] = useAppState(settingsPath)
  const [isShow, setIsShow] = useAppState(isSettingsMenuShow)
  const isSliderShow = useAppStateValue(isAgeSliderShown)
  const setCacheInfoShow = useSetAppState(isCacheInfoShowState)
  const currentRasterID = useAppStateValue(currentRasterIDState)
  const [showAnimationSettings, setShowAnimationSettings] = useState(false)

  const [presentAlert] = useIonAlert()

  //const navigate = useNavigate()
  const history = useHistory()

  /**
   *
   */
  useEffect(() => {
    if (isShow) {
      setStatusBarTheme(darkMode)
    } else if (isSliderShow) {
      setStatusBarTheme(darkMode)
    } else {
      setStatusBarTheme('dark')
    }
  }, [isShow])

  /**
   * Save settings on each change
   */
  useEffect(() => {
    if (isShow && path === 'root') {
      setDarkMode(darkMode)
      setStatusBarTheme(darkMode)
      const settings = {
        darkMode,
      }
      Preferences.set({
        key: 'appSettings',
        value: JSON.stringify(settings),
      })
    }
  }, [darkMode])

  /**
   *
   */
  useEffect(() => {
    if (isShow && path === 'root') {
      const settings = {
        downloadOnCellular,
      }
      Preferences.set({
        key: 'networkSettings',
        value: JSON.stringify(settings),
      })
    }
  })

  /**
   *
   */
  useEffect(() => {
    let raster = getRasterByID(currentRasterID)
    if (!raster) return
    if (raster.endTime == raster.startTime && raster.endTime == 0) {
      setShowAnimationSettings(false)
    } else {
      setShowAnimationSettings(true)
    }
  }, [currentRasterID])

  /**
   *
   * @param path
   * @param name
   * @returns
   */
  const subPageRouting = (path: string, name: string) => {
    return (
      <IonItem
        button
        onClick={() => {
          setPath(path)
        }}
      >
        {!isPlatform('ios') && <IonIcon icon={chevronForward} slot={'end'} />}
        <IonLabel>{name}</IonLabel>
      </IonItem>
    )
  }

  /**
   * when the server url has changed, ask user if reload the page
   *
   * @param msg
   */
  const showReloadPageAlert = (msg: string) => {
    presentAlert({
      header: 'Confirm Reload',
      message: msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('reload page canceled')
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            window.location.reload()
          },
        },
      ],
      onDidDismiss: (e: CustomEvent) =>
        console.log(`Dismissed with role: ${e.detail.role}`),
    })
  }

  return (
    <IonModal isOpen={isShow} animated backdropDismiss={false}>
      <IonToolbar>
        {path !== 'root' && (
          <IonButtons slot={'start'}>
            <IonButton
              onClick={() => {
                setPath('root')
              }}
              color={'secondary'}
            >
              <IonIcon icon={chevronBack} />
              <IonRippleEffect />
            </IonButton>
          </IonButtons>
        )}
        <IonTitle>{titles[path]}</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              setIsShow(false)
              setPath('root')
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      {/* put new settings in this IonList element below */}
      {/* some demo is shown below */}

      <IonList className={'settings-list'}>
        {showAnimationSettings &&
          subPageRouting('animation', 'Animation Settings')}
        {subPageRouting('backgroundSetting', 'Background Settings')}

        {/*--------------------------------------------*/}
        <IonItem
          button
          onClick={async () => {
            await getCacheStatsData()
            setCacheInfoShow(true)
          }}
        >
          {!isPlatform('ios') && <IonIcon icon={chevronForward} slot={'end'} />}
          <IonLabel>Caching</IonLabel>
        </IonItem>
        {/*--------------------------------------------*/}

        <IonItem
          button
          onClick={() => {
            Preferences.remove({ key: 'hasFinishedTutorial' }).then(() => {
              //navigate('/tutorial', { replace: true })
              history.replace('/tutorial')
              setIsShow(false)
            })
          }}
        >
          {!isPlatform('ios') && <IonIcon icon={chevronForward} slot={'end'} />}
          <IonLabel>Tutorial</IonLabel>
        </IonItem>
        {/*--------------------------------------------*/}
        <IonItem
          button
          onClick={() => {
            showReloadPageAlert(
              'Are you sure that you would like to reload the App.',
            )
          }}
        >
          {!isPlatform('ios') && <IonIcon icon={chevronForward} slot={'end'} />}
          <IonLabel>Reload App</IonLabel>
        </IonItem>

        {/*--------------------------------------------*/}
        <IonItemDivider>App Theme</IonItemDivider>
        <IonItem>
          <IonSegment
            onIonChange={(e) => _setDarkMode(e.detail.value!.toString())}
            value={darkMode}
          >
            <IonSegmentButton value="auto">
              <IonLabel>Auto</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="light">
              <IonLabel>Light</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="dark">
              <IonLabel>Dark</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonItem>
        {/*--------------------------------------------*/}
        <IonItemDivider>Network Settings</IonItemDivider>
        <IonItem>
          <IonToggle
            class={'single-setting-option'}
            checked={downloadOnCellular}
            onIonChange={(e) => setDownloadOnCellular(e.detail.checked)}
          >
            Use Mobile Data
          </IonToggle>
        </IonItem>
        {/*--------------------------------------------*/}
        <IonItem>
          <IonInput
            label="Server URL"
            class="server-url-input"
            value={serverURL}
            onIonBlur={async (e) => {
              //console.log(e.target.value)
              if (e.target.value) {
                let isChanged = await setServerURL(e.target.value.toString())
                if (isChanged) {
                  showReloadPageAlert(
                    'The server URL is changed. Would you like to reload the App?',
                  )
                }
              }
            }}
          />
        </IonItem>
        {/*--------------------------------------------*/}
        <IonItemDivider>Graticules</IonItemDivider>
        <IonItem>
          <IonToggle
            class={'single-setting-option'}
            checked={showGraticuleFlag}
            onIonChange={(e) => {
              //console.log(e.detail.checked)
              if (e.detail.checked) {
                showGraticule()
                setShowGraticuleFlag(true)
              } else {
                hideGraticule()
                setShowGraticuleFlag(false)
              }
              Preferences.set({
                key: 'showGraticule',
                value: JSON.stringify(e.detail.checked),
              })
            }}
          >
            Show Graticules
          </IonToggle>
        </IonItem>
        {/*--------------------------------------------*/}
      </IonList>

      {/* animation settings subpage */}

      <AnimationSettings />

      {/* background setting subpage */}

      <BackgroundColorSettings backgroundService={backgroundService} />
    </IonModal>
  )
}
