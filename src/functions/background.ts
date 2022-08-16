import { Viewer } from 'cesium'
import * as Cesium from 'cesium'

const defaultBackground = () => {
  return new Cesium.SkyBox({
    sources: {
      positiveX: 'cesium/Assets/Textures/SkyBox/tycho2t3_80_px.jpg',
      negativeX: 'cesium/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg',
      positiveY: 'cesium/Assets/Textures/SkyBox/tycho2t3_80_py.jpg',
      negativeY: 'cesium/Assets/Textures/SkyBox/tycho2t3_80_my.jpg',
      positiveZ: 'cesium/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg',
      negativeZ: 'cesium/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg',
    },
  })
}

export class BackgroundService {
  constructor(
    public isBackgroundSettingEnable: boolean,
    public isStarryBackgroundEnable: boolean,
    public isCustomisedColorBackgroundEnable: boolean,
    public color: { r: number; g: number; b: number },
    public viewer: Viewer
  ) {}

  changeBackground = () => {
    if (this.isBackgroundSettingEnable) {
      this.viewer.scene.skyBox = new Cesium.SkyBox({})
      this.viewer.scene.backgroundColor = Cesium.Color.BLACK
      if (this.isStarryBackgroundEnable) {
        this.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
      } else if (this.isCustomisedColorBackgroundEnable) {
        this.viewer.scene.backgroundColor = new Cesium.Color(
          this.color.r / 255,
          this.color.g / 255,
          this.color.b / 255
        )
      }
    } else {
      this.setDefaultBackground()
    }
  }

  setDefaultBackground = () => {
    this.viewer.scene.skyBox = defaultBackground()
  }
}
