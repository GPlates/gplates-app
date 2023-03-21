import React, { useEffect, useState } from 'react'
import './SettingMenuPage.scss'
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
  IonToolbar,
  isPlatform,
  useIonAlert,
  IonToggle,
} from '@ionic/react'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { CSSTransition } from 'react-transition-group'
import { BackgroundColorSettings } from '../components/BackgroundColorSettings'
import { AnimationSettings } from './AnimationSettings'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  appDarkMode,
  isAgeSliderShown,
  isSettingsMenuShow,
  settingsPath,
  isCacheInfoShowState,
  networkDownloadOnCellular,
  currentRasterIDState,
} from '../functions/atoms'
import { BackgroundService } from '../functions/background'
import { Preferences } from '@capacitor/preferences'
import { setDarkMode, setStatusBarTheme } from '../functions/darkMode'
import { serverURL, setServerURL } from '../functions/settings'
import rasterMaps, { getRasterByID } from '../functions/rasterMaps'
import { cachingServant } from '../functions/cache'
import { rotationModels } from '../functions/rotationModel'
import { getCacheStatsData } from './CacheInfo'
import {
  showGraticule,
  hideGraticule,
  setShowGraticuleFlag,
  showGraticuleFlag,
} from '../functions/graticule'
//import { useNavigate } from 'react-router'
import { useHistory } from 'react-router'

//
const titles: { [key: string]: string } = {
  root: 'Settings',
  animation: 'Animation Settings',
  backgroundSetting: 'Background Settings',
}

//
// try to cache everything. not in use for now
//
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
                raster.layerName
              ),
            count * 1000
          )
          count += m.times.length
        }
      }
    }
  })
}

//
interface ContainerProps {
  backgroundService: BackgroundService
}

// main component for setting menu
export const SettingMenuPage: React.FC<ContainerProps> = ({
  backgroundService,
}) => {
  const [darkMode, _setDarkMode] = useRecoilState(appDarkMode)
  const [downloadOnCellular, setDownloadOnCellular] = useRecoilState(
    networkDownloadOnCellular
  )
  const [path, setPath] = useRecoilState(settingsPath)
  const [isShow, setIsShow] = useRecoilState(isSettingsMenuShow)
  const isSliderShow = useRecoilValue(isAgeSliderShown)
  const setCacheInfoShow = useSetRecoilState(isCacheInfoShowState)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const [showAnimationSettings, setShowAnimationSettings] = useState(false)

  const [presentAlert] = useIonAlert()

  //const navigate = useNavigate()
  const history = useHistory()

  //
  //
  //
  useEffect(() => {
    if (isShow) {
      setStatusBarTheme(darkMode)
    } else if (isSliderShow) {
      setStatusBarTheme(darkMode)
    } else {
      setStatusBarTheme('dark')
    }
  }, [isShow])

  //
  // Save settings on each change
  //
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

  //
  //
  //
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

  //
  //
  //
  useEffect(() => {
    let raster = getRasterByID(currentRasterID)
    if (!raster) return
    if (raster.endTime == raster.startTime && raster.endTime == 0) {
      setShowAnimationSettings(false)
    } else {
      setShowAnimationSettings(true)
    }
  }, [currentRasterID])

  //
  //
  //
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

  //
  // when the server url has changed, ask user if reload the page
  //
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

  //
  //
  //
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
      <CSSTransition
        in={path === 'root'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
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
            {!isPlatform('ios') && (
              <IonIcon icon={chevronForward} slot={'end'} />
            )}
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
            {!isPlatform('ios') && (
              <IonIcon icon={chevronForward} slot={'end'} />
            )}
            <IonLabel>Tutorial</IonLabel>
          </IonItem>
          {/*--------------------------------------------*/}
          <IonItem
            button
            onClick={() => {
              showReloadPageAlert(
                'Are you sure that you would like to reload the App.'
              )
            }}
          >
            {!isPlatform('ios') && (
              <IonIcon icon={chevronForward} slot={'end'} />
            )}
            <IonLabel>Reload App</IonLabel>
          </IonItem>

          {/*--------------------------------------------*/}
          <IonItemDivider>App Theme</IonItemDivider>
          <IonItem>
            <IonSegment
              onIonChange={(e) => _setDarkMode(e.detail.value!)}
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
            <IonLabel>Use Mobile Data</IonLabel>
            <IonToggle
              class={'single-setting-option'}
              checked={downloadOnCellular}
              onIonChange={(e) => setDownloadOnCellular(e.detail.checked)}
            />
          </IonItem>
          {/*--------------------------------------------*/}
          <IonItem>
            <IonLabel class="server-url-label">Server URL </IonLabel>
            <IonInput
              class="server-url-input"
              value={serverURL}
              onIonBlur={async (e) => {
                //console.log(e.target.value)
                if (e.target.value) {
                  let isChanged = await setServerURL(e.target.value.toString())
                  if (isChanged) {
                    showReloadPageAlert(
                      'The server URL is changed. Would you like to reload the App?'
                    )
                  }
                }
              }}
            />
          </IonItem>
          {/*--------------------------------------------*/}
          <IonItemDivider>Graticules</IonItemDivider>
          <IonItem>
            <IonLabel>Show Graticules</IonLabel>
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
            />
          </IonItem>
          {/*--------------------------------------------*/}
        </IonList>
      </CSSTransition>

      {/* animation settings subpage */}
      <CSSTransition
        in={path === 'animation'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <AnimationSettings />
      </CSSTransition>

      {/* background setting subpage */}
      <CSSTransition
        in={path === 'backgroundSetting'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <BackgroundColorSettings backgroundService={backgroundService} />
      </CSSTransition>
    </IonModal>
  )
}
