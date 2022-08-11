import { Color, Viewer, ImageryProvider } from 'cesium'

export const initCesiumViewer = (provider: ImageryProvider) => {
  let viewer: Viewer = new Viewer('cesiumContainer', {
    baseLayerPicker: false,
    imageryProvider: provider,
    animation: false,
    creditContainer: 'credit',
    timeline: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    contextOptions: {
      webgl: {
        alpha: true,
      },
    },
  })
  viewer.scene.fog.enabled = false
  viewer.scene.globe.showGroundAtmosphere = false
  viewer.scene.skyAtmosphere.show = false
  viewer.scene.backgroundColor = Color.BLACK

  viewer.scene.globe.tileCacheSize = 1000
  return viewer
}
