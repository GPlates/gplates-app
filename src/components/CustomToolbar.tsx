import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  getPlatforms,
  useIonLoading,
  useIonToast,
} from '@ionic/react'
import { Cartesian3, Color, Scene, SceneMode } from 'cesium'
import {
  homeOutline,
  shareSocialOutline,
  informationOutline,
} from 'ionicons/icons'
import { columbusViewPath, flatMapPath, globePath } from '../theme/paths'
import './CustomToolbar.scss'
import React, { Fragment, useState, useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
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
  isAddLocationWidgetShowState,
  isModelInfoShowState,
  currentRasterIDState,
} from '../functions/atoms'
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
const CustomToolbar: React.FC<ToolbarProps> = ({ scene }) => {
  const setShowModelInfo = useSetRecoilState(isModelInfoShowState)
  const paleoAge = useRecoilValue(ageState)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const [presentToast, dismissToast] = useIonToast()
  const [present, dismiss] = useIonLoading()

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
  const setShowAddLocationWidget = useSetRecoilState(
    isAddLocationWidgetShowState,
  )

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

  const getPlateID = async () => {
    if (currentModel !== undefined) {
      let pid = plateIDMap.get(currentModel.name)
      //console.log(plateIDMap)
      if (pid === undefined) {
        let result = await fetch(
          serverURL +
            '/reconstruct/assign_points_plate_ids/' +
            '?points=' +
            currentLocationLon +
            ',' +
            currentLocationLat +
            '&model=' +
            currentModel!.name,
        )
        let jsonData = await result.json()
        plateIDMap.set(currentModel!.name, jsonData[0])
      }
    }
  }

  /**
   *
   */
  const goHome = async () => {
    //when run in a web browser, cannot request geolocation permission
    if (getPlatforms().includes('desktop')) {
      currentLocationLat = HOME_LATITUDE
      currentLocationLon = HOME_LONGITUDE
    } else if (
      currentLocationLat === undefined ||
      currentLocationLon === undefined
    ) {
      const permissions = await Geolocation.checkPermissions()
      if (permissions.location !== 'denied') {
        try {
          const location = await Geolocation.getCurrentPosition()
          // Only get location once to speed up home button response
          currentLocationLon = location.coords.longitude
          currentLocationLat = location.coords.latitude
        } catch (err) {
          console.log(err)
        }
      }
    }

    if (currentLocationLat !== undefined && currentLocationLon !== undefined) {
      if (paleoAge === 0) {
        getPlateID()
        updateCurrentLocationEntity(currentLocationLat, currentLocationLon)
        scene.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            currentLocationLon,
            currentLocationLat,
            getDefaultCameraHeight(),
          ),
        })
      } else {
        if (currentModel !== undefined) {
          await getPlateID()
          let pid = plateIDMap.get(currentModel.name)
          if (pid !== undefined) {
            let newLatLon = currentModel.rotate(
              { lat: currentLocationLat, lon: currentLocationLon, pid: pid },
              paleoAge,
            )
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
    <Fragment>
      <IonButton className="round-button" onClick={goHome}>
        <IonIcon icon={homeOutline} />
      </IonButton>
      <IonButton className="round-button" id="scene-mode-button">
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
                  <svg className="scene-mode-icon" viewBox="0 0 64 64">
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
        className="round-button"
        id="help-button"
        onClick={() => {
          setShowModelInfo(true)
        }}
      >
        <IonIcon icon={informationOutline} />
      </IonButton>

      {/* social sharing button */}
      <IonButton
        className="round-button"
        style={{ display: showSocialSharingButton ? '' : 'none' }}
        id="screenshot-button"
        onClick={async () => {
          await SocialSharing(present, dismiss, presentToast, dismissToast)
        }}
      >
        <IonIcon icon={shareSocialOutline} />
      </IonButton>
    </Fragment>
  )
}
export default CustomToolbar
