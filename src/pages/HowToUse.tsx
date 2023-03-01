import React from 'react'
import { IonContent } from '@ionic/react'
import './AboutPage.scss'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'

interface ContainerProps {}

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

export const HowToUse: React.FC<ContainerProps> = () => {
  return (
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
                    <div className="cesium-navigation-help-pan">Pan view</div>
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
                    <div className="cesium-navigation-help-zoom">Zoom view</div>
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
                    <div className="cesium-navigation-help-pan">Pan view</div>
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
                    <div className="cesium-navigation-help-zoom">Zoom view</div>
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
                      Middle click + drag, or CTRL + Left/Right click + drag
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SwiperSlide>
      </Swiper>
    </IonContent>
  )
}
