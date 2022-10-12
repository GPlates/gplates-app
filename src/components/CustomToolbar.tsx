import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  getPlatforms,
} from '@ionic/react'
import { Cartesian3, Color, Rectangle, Scene, SceneMode } from 'cesium'
import { homeOutline, helpOutline } from 'ionicons/icons'
import { columbusViewPath, flatMapPath, globePath } from '../theme/paths'
import './CustomToolbar.scss'
import React, { Fragment, useState } from 'react'
import { useSetRecoilState } from 'recoil'

// https://stackoverflow.com/a/69736635/15379768
//import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import { Swiper, SwiperSlide } from 'swiper/react'

// Swiper styles must use direct files import
import 'swiper/swiper.scss' // core Swiper
import 'swiper/modules/navigation/navigation.scss' // Navigation module
import 'swiper/modules/pagination/pagination.scss'
import { Pagination } from 'swiper'
import { cesiumViewer } from '../functions/cesiumViewer'
import { Geolocation } from '@capacitor/geolocation'
import { isAddLocationWidgetShowState } from '../functions/atoms'

interface ToolbarProps {
  scene: Scene
}

let lat: number
let lon: number

const CustomToolbar: React.FC<ToolbarProps> = ({ scene }) => {
  const sceneModes = [
    {
      id: SceneMode.SCENE3D,
      name: '3D',
      onClick: () => scene.morphTo3D(),
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
      scene.camera.flyHome()
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
      // Rectangle animates nicer than Cartesian3
      const width = 40.9
      const height = 33.3
      const rectangle = Rectangle.fromDegrees(
        lon - width,
        lat - height,
        lon + width,
        lat + height
      )
      scene.camera.flyTo({ destination: rectangle })
    } else {
      scene.camera.flyHome()
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
      <IonButton className="round-button" id="help-button">
        <IonIcon icon={helpOutline} />
        <IonPopover className="popover" trigger="help-button">
          <IonContent>
            <Swiper
              pagination={pagination}
              modules={[Pagination]}
              className="help-swiper"
            >
              <SwiperSlide>
                <div className="help">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img
                            alt="touch-drag"
                            className="drop-shadow"
                            src="cesium/Widgets/Images/NavigationHelp/TouchDrag.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-pan">
                            Pan view
                          </div>
                          <div className="cesium-navigation-help-details">
                            One finger drag
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            alt="touch-zoom"
                            className="drop-shadow"
                            src="cesium/Widgets/Images/NavigationHelp/TouchZoom.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-zoom">
                            Zoom view
                          </div>
                          <div className="cesium-navigation-help-details">
                            Two finger pinch
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            alt="touch-tilt"
                            className="drop-shadow"
                            src="cesium/Widgets/Images/NavigationHelp/TouchTilt.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-rotate">
                            Tilt view
                          </div>
                          <div className="cesium-navigation-help-details">
                            Two finger drag, same direction
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            alt="touch-rotate"
                            className="drop-shadow"
                            src="cesium/Widgets/Images/NavigationHelp/TouchRotate.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-tilt">
                            Rotate view
                          </div>
                          <div className="cesium-navigation-help-details">
                            Two finger drag, opposite direction
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="help">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img
                            alt="mouse-left"
                            src="cesium/Widgets/Images/NavigationHelp/MouseLeft.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-pan">
                            Pan view
                          </div>
                          <div className="cesium-navigation-help-details">
                            Left click + drag
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            alt="mouse-right"
                            src="cesium/Widgets/Images/NavigationHelp/MouseRight.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-zoom">
                            Zoom view
                          </div>
                          <div className="cesium-navigation-help-details">
                            Right click + drag, or Mouse wheel scroll
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <img
                            alt="mouse-middle"
                            src="cesium/Widgets/Images/NavigationHelp/MouseMiddle.svg"
                          />
                        </td>
                        <td>
                          <div className="cesium-navigation-help-rotate">
                            Rotate view
                          </div>
                          <div className="cesium-navigation-help-details">
                            Middle click + drag, or CTRL + Left/Right click +
                            drag
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </SwiperSlide>
            </Swiper>
          </IonContent>
        </IonPopover>
      </IonButton>
    </Fragment>
  )
}
export default CustomToolbar
