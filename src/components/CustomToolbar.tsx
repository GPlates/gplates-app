import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
} from '@ionic/react'
import { SceneMode } from 'cesium'
import { homeOutline, helpOutline } from 'ionicons/icons'
import { columbusViewPath, flatMapPath, globePath } from '../theme/paths'
import './CustomToolbar.scss'
import { useState } from 'react'

// https://stackoverflow.com/a/69736635/15379768
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'

// Swiper styles must use direct files import
import 'swiper/swiper.scss' // core Swiper
import 'swiper/modules/navigation/navigation.scss' // Navigation module
import 'swiper/modules/pagination/pagination.scss'
import { Pagination } from 'swiper' // Pagination module

const CustomToolbar = (props: any) => {
  const sceneModes = [
    {
      id: SceneMode.SCENE3D,
      name: '3D',
      onClick: () => props.scene.morphTo3D(),
      path: globePath,
    },
    {
      id: SceneMode.SCENE2D,
      name: '2D',
      onClick: () => props.scene.morphTo2D(),
      path: flatMapPath,
    },
    {
      id: SceneMode.COLUMBUS_VIEW,
      name: 'Columbus View',
      onClick: () => props.scene.morphToColumbusView(),
      path: columbusViewPath,
    },
  ]
  const [mode, setMode] = useState(sceneModes[0])

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
    <div>
      <IonButton
        onClick={() => {
          props.scene.camera.flyHome()
        }}
      >
        <IonIcon icon={homeOutline} />
      </IonButton>
      <IonButton id="scene-mode-button">
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
      <IonButton id="help-button">
        <IonIcon icon={helpOutline} />
        <IonPopover trigger="help-button">
          <IonContent>
            <Swiper
              pagination={pagination}
              modules={[Pagination]}
              className="swiper"
            >
              <SwiperSlide>
                <div className="help">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <img
                            alt="touch-drag"
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
    </div>
  )
}
export default CustomToolbar
