import { Color, Viewer, ImageryProvider, Camera, Rectangle } from 'cesium'
import rasterMaps, { currentRasterIndex } from './rasterMaps'

import { buildAnimationURL } from './util'
import { currentModel } from './rotationModel'
import { createCesiumImageryProvider } from './dataLoader'
import {
  getVectorLayers,
  enableLayer,
  getEnabledLayers,
  disableLayer,
} from '../functions/vectorLayers'

//singleton cersium viewer
export let cesiumViewer: Viewer

//
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
  cesiumViewer = viewer
}

//
export const drawLayers = (time: number) => {
  const provider = createCesiumImageryProvider(
    rasterMaps[currentRasterIndex],
    time
  )
  cesiumViewer.imageryLayers.addImageryProvider(provider)

  let model = rasterMaps[currentRasterIndex]?.model ?? 'MERDITH2021'
  let vLayers = getVectorLayers(model)
  for (let key in vLayers) {
    let checkedLayers = getEnabledLayers(currentRasterIndex)
    if (checkedLayers.includes(key)) {
      let p = createCesiumImageryProvider(vLayers[key], time)
      cesiumViewer.imageryLayers.addImageryProvider(p)
    }
  }

  if (cesiumViewer.imageryLayers.length > 8) {
    cesiumViewer.imageryLayers.remove(cesiumViewer.imageryLayers.get(0), true)
  }
}
