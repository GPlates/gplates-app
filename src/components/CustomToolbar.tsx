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
import { Cartesian3, Color, Rectangle, Scene, SceneMode } from 'cesium'
import {
  homeOutline,
  helpOutline,
  shareSocialOutline,
  informationOutline,
} from 'ionicons/icons'
import { columbusViewPath, flatMapPath, globePath } from '../theme/paths'
import './CustomToolbar.scss'
import React, { Fragment, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import {
  cesiumViewer,
  HOME_LONGITUDE,
  HOME_LATITUDE,
  DEFAULT_CAMERA_HEIGHT,
} from '../functions/cesiumViewer'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import { Geolocation } from '@capacitor/geolocation'
import {
  isAddLocationWidgetShowState,
  isModelInfoShowState,
} from '../functions/atoms'
import { SocialSharing } from './SocialSharing'

interface ToolbarProps {
  scene: Scene
}

let lat: number
let lon: number

const CustomToolbar: React.FC<ToolbarProps> = ({ scene }) => {
  const setShowModelInfo = useSetRecoilState(isModelInfoShowState)
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
              DEFAULT_CAMERA_HEIGHT
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
    isAddLocationWidgetShowState
  )

  const goHome = async () => {
    //when run in a web browser, cannot request geolocation permission
    if (getPlatforms().includes('desktop')) {
      scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          HOME_LONGITUDE,
          HOME_LATITUDE,
          DEFAULT_CAMERA_HEIGHT
        ),
      })
      return
    }

    if (!lat && !lon) {
      const permissions = await Geolocation.checkPermissions()
      if (permissions.location !== 'denied') {
        try {
          const location = await Geolocation.getCurrentPosition()
          // Only get location once to speed up home button response
          lon = location.coords.longitude
          lat = location.coords.latitude
        } catch (err) {
          console.log(err)
        }
      }
    }

    if (lat && lon) {
      cesiumViewer.entities.removeById('userLocation')
      cesiumViewer.entities.add({
        id: 'userLocation',
        name: 'User Location',
        position: Cartesian3.fromDegrees(lon, lat),
        point: {
          color: Color.DODGERBLUE,
          pixelSize: 10,
          outlineColor: Color.WHITE,
          outlineWidth: 3,
        },
      })
      scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(lon, lat, DEFAULT_CAMERA_HEIGHT),
      })
    } else {
      scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          HOME_LONGITUDE,
          HOME_LATITUDE,
          DEFAULT_CAMERA_HEIGHT
        ),
      })
    }
  }

  // Swiper page indicator
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return (
        '<span class="' +
        className +
        '">' +
        (index ? 'Mouse' : 'Touch') +
        '</span>'
      )
    },
  }

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

      <IonButton
        className="round-button"
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
