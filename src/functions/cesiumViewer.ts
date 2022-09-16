import { Color, Viewer, ImageryProvider, Camera, Rectangle } from 'cesium'

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

  // Rough bounding box of Australia
  Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
    112.8,
    -43.7,
    153.7,
    -10.4
  )

  return viewer
}
