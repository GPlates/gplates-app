import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  getPlatforms,
  isPlatform,
  useIonLoading,
  useIonToast,
} from '@ionic/react'
import { Cartesian3, Color, Scene, SceneMode } from 'cesium'
import {
  homeOutline,
  shareSocialOutline,
  informationOutline,
  chevronUpCircleOutline,
  timeOutline,
} from 'ionicons/icons'

import { columbusViewPath, flatMapPath, globePath } from '../theme/paths'
import './TopButtons.scss'
import React, { Fragment, useState, useEffect } from 'react'
import { useSetAppState, useAppStateValue } from '../functions/appStates'
import {
  cesiumViewer,
  HOME_LONGITUDE,
  HOME_LATITUDE,
  getDefaultCameraHeight,
} from '../functions/cesiumViewer'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Geolocation } from '@capacitor/geolocation'
import {
  ageState,
  useAppState,
  isAddLocationWidgetShowState,
  isModelInfoShowState,
  currentRasterIDState,
  showTimeButtonState,
  showTimeSliderState,
} from '../functions/appStates'
import { SocialSharing } from './SocialSharing'
import { currentModel } from '../functions/rotationModel'
import { serverURL } from '../functions/settings'

interface ToolbarProps {
  scene: Scene
}

let currentLocationLat: number | undefined = undefined
let currentLocationLon: number | undefined = undefined
let paleoCurrentLocationLat: number | undefined = undefined
let paleoCurrentLocationLon: number | undefined = undefined
//model name -> plate id
let plateIDMap: Map<string, number> = new Map<string, number>()

/**
 *
 * @param param0
 * @returns
 */
const TopButtons: React.FC<ToolbarProps> = ({ scene }) => {
  const setShowModelInfo = useSetAppState(isModelInfoShowState)
  const paleoAge = useAppStateValue(ageState)
  const currentRasterID = useAppStateValue(currentRasterIDState)
  const [presentToast, dismissToast] = useIonToast()
  const [present, dismiss] = useIonLoading()
  const [showTimeButton, setShowTimeButton] = useAppState(showTimeButtonState) //the button to open time slider
  const [showTimeSlider, setShowTimeSlider] = useAppState(showTimeSliderState)

  const sceneModes = [
    {
      id: SceneMode.SCENE3D,
      name: '3D',
      onClick: () => {
        scene.morphTo3D()
        setTimeout(() => {
          scene.camera.flyTo({
            destination: Cartesian3.fromDegrees(
              HOME_LONGITUDE,
              HOME_LATITUDE,
              getDefaultCameraHeight(),
            ),
          })
        }, 2500) //wait for the morphTo3D to finish(by default 2 seconds morphTo3D to finish)
      },
      path: globePath,
    },
    {
      id: SceneMode.SCENE2D,
      name: '2D',
      onClick: () => scene.morphTo2D(),
      path: flatMapPath,
    },
    {
      id: SceneMode.COLUMBUS_VIEW,
      name: 'Columbus View',
      onClick: () => scene.morphToColumbusView(),
      path: columbusViewPath,
    },
  ]
  const [mode, setMode] = useState(sceneModes[0])
  const setShowAddLocationWidget = useSetAppState(isAddLocationWidgetShowState)

  /**
   * update the current location point on Cesium globe
   */
  const updateCurrentLocationEntity = (newLat: number, newLon: number) => {
    if (
      newLat !== undefined &&
      newLon !== undefined &&
      !isNaN(newLat) &&
      !isNaN(newLon)
    ) {
      //console.log(newLat)
      //console.log(newLon)
      cesiumViewer.entities.removeById('userLocation')
      cesiumViewer.entities.add({
        id: 'userLocation',
        name: 'User Location',
        position: Cartesian3.fromDegrees(newLon, newLat),
        point: {
          color: Color.DODGERBLUE,
          pixelSize: 10,
          outlineColor: Color.WHITE,
          outlineWidth: 3,
        },
      })
    }
  }

  const getPlateID = async (lat: number, lon: number) => {
    if (currentModel !== undefined) {
      let pid = plateIDMap.get(currentModel.name)
      //console.log(plateIDMap)
      if (pid === undefined) {
        let result = await fetch(
          serverURL +
            '/reconstruct/assign_points_plate_ids/' +
            '?points=' +
            lon +
            ',' +
            lat +
            '&model=' +
            currentModel!.name,
        )
        let jsonData = await result.json()
        plateIDMap.set(currentModel!.name, jsonData[0])
      }
    }
  }

  const showLocationErrorToast = (message: string) => {
    presentToast({
      buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
      duration: 6000,
      message,
      onDidDismiss: () => {},
    })
  }

  /**
   * Move the camera to the user's current location. Falls back to the
   * app's default view (and tells the user why) when the location is
   * unavailable, e.g. permission denied or location services are off.
   */
  const goHome = async () => {
    let lat = HOME_LATITUDE
    let lon = HOME_LONGITUDE

    if (getPlatforms().includes('desktop')) {
      //cannot request geolocation permission when run in a web browser
    } else if (
      currentLocationLat !== undefined &&
      currentLocationLon !== undefined
    ) {
      // reuse the location fetched earlier in this session
      lat = currentLocationLat
      lon = currentLocationLon
    } else {
      try {
        await present({ message: 'Finding your location…' })
        const permissions = await Geolocation.checkPermissions()
        if (permissions.location === 'denied') {
          throw new Error('permission denied')
        }
        const location = await Geolocation.getCurrentPosition()
        lat = location.coords.latitude
        lon = location.coords.longitude
        // Only cache a real fix so a later retry can pick up a permission
        // grant instead of being stuck on the fallback forever.
        currentLocationLat = lat
        currentLocationLon = lon
      } catch (err) {
        console.log(err)
        showLocationErrorToast(
          err instanceof Error && err.message === 'permission denied'
            ? 'Location permission denied. Enable location access for this app in your device settings to centre the globe on your location.'
            : 'Could not get your location. Please check that location services are turned on. Showing the default view instead.',
        )
      } finally {
        dismiss()
      }
    }

    if (paleoAge === 0) {
      getPlateID(lat, lon)
      updateCurrentLocationEntity(lat, lon)
      scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(lon, lat, getDefaultCameraHeight()),
      })
    } else if (currentModel !== undefined) {
      await getPlateID(lat, lon)
      let pid = plateIDMap.get(currentModel.name)
      if (pid !== undefined) {
        let newLatLon = currentModel.rotate({ lat, lon, pid: pid }, paleoAge)
        //console.log(newLatLon)
        if (newLatLon !== undefined) {
          paleoCurrentLocationLat = newLatLon.lat
          paleoCurrentLocationLon = newLatLon.lon
          updateCurrentLocationEntity(
            paleoCurrentLocationLat,
            paleoCurrentLocationLon,
          )
          scene.camera.flyTo({
            destination: Cartesian3.fromDegrees(
              paleoCurrentLocationLon,
              paleoCurrentLocationLat,
              getDefaultCameraHeight(),
            ),
          })
        }
      }
    }
  }

  /**
   *
   */
  useEffect(() => {
    if (
      currentModel !== undefined &&
      currentLocationLat !== undefined &&
      currentLocationLon !== undefined
    ) {
      let pid = plateIDMap.get(currentModel.name)
      if (pid !== undefined) {
        let newLatLon = currentModel.rotate(
          { lat: currentLocationLat, lon: currentLocationLon, pid: pid },
          paleoAge,
        )

        if (newLatLon !== undefined) {
          paleoCurrentLocationLat = newLatLon.lat
          paleoCurrentLocationLon = newLatLon.lon
          updateCurrentLocationEntity(
            paleoCurrentLocationLat,
            paleoCurrentLocationLon,
          )
        }
      }
    }
  }, [paleoAge])

  /**
   *
   */
  useEffect(() => {
    /*
    if (currentLocationLat !== undefined && currentLocationLon !== undefined) {
      updateCurrentLocationEntity(currentLocationLat, currentLocationLon)
      getPlateID()
    }*/
  }, [currentRasterID])

  //do not show social sharing button on desktop/web browser
  let showSocialSharingButton = getPlatforms().includes('desktop')
    ? false
    : true

  return (
    <div className="top-buttons-container">
      <IonButton className="round-btn" onClick={goHome}>
        <IonIcon icon={homeOutline} />
      </IonButton>
      <IonButton className="round-btn" id="scene-mode-button">
        <svg className="button scene-mode-icon" viewBox="0 0 64 64">
          <path d={mode.path} />
        </svg>

        <IonPopover dismissOnSelect={true} trigger="scene-mode-button">
          <IonContent>
            <IonList>
              {sceneModes.map((m) => (
                <IonItem
                  disabled={m.id === mode.id}
                  key={m.id}
                  onClick={() => {
                    m.onClick()
                    setMode(m)
                    if (m.id !== SceneMode.SCENE3D) {
                      setShowAddLocationWidget(false)
                    }
                  }}
                >
                  <svg
                    className={`scene-mode-icon ${isPlatform('ios') || isPlatform('android') ? 'scene-mode-icon-svg-ios-android' : 'scene-mode-icon-svg-not-ios-android'}`}
                    viewBox="0 0 64 64"
                  >
                    <path d={m.path} />
                  </svg>
                  {m.name}
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonPopover>
      </IonButton>

      <IonButton
        className="round-btn"
        id="help-button"
        onClick={() => {
          setShowModelInfo(true)
        }}
      >
        <IonIcon icon={informationOutline} />
      </IonButton>

      {/* social sharing button */}
      <IonButton
        className="round-btn"
        style={{ display: showSocialSharingButton ? '' : 'none' }}
        id="screenshot-button"
        onClick={async () => {
          await SocialSharing(present, dismiss, presentToast, dismissToast)
        }}
      >
        <IonIcon icon={shareSocialOutline} />
      </IonButton>

      {/* the button to show or hide time slider */}
      <IonButton
        className="round-btn show-button"
        style={{ display: showTimeButton ? '' : 'none' }}
        onClick={() => setShowTimeSlider(showTimeSlider ? false : true)}
        size="default"
      >
        <IonIcon icon={showTimeSlider ? chevronUpCircleOutline : timeOutline} />
      </IonButton>
    </div>
  )
}
export default TopButtons
