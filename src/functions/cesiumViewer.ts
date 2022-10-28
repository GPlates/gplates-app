import { Preferences } from '@capacitor/preferences'
import { Color, Viewer, ImageryProvider, Camera, Rectangle } from 'cesium'
import rasterMaps, { currentRasterIndex } from './rasterMaps'
import { createCesiumImageryProvider } from './dataLoader'
import { getVectorLayers, getEnabledLayers } from '../functions/vectorLayers'
import {
  raiseGraticuleLayerToTop,
  showGraticule,
  setShowGraticuleFlag,
} from './graticule'

//singleton cersium viewer
export let cesiumViewer: Viewer

//initialize the Cesium viewer
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
  Preferences.get({ key: 'showGraticule' }).then((res) => {
    if (res?.value) {
      const flag = JSON.parse(res.value)
      if (flag) {
        setShowGraticuleFlag(true)
        showGraticule()
      }
    }
  })
}

//draw raster layer and vector layers
export const drawLayers = (time: number) => {
  const provider = createCesiumImageryProvider(
    rasterMaps[currentRasterIndex],
    time
  )
  cesiumViewer.imageryLayers.addImageryProvider(provider) //draw the raster layer

  let model = rasterMaps[currentRasterIndex]?.model ?? 'MERDITH2021'
  let vLayers = getVectorLayers(model)
  for (let key in vLayers) {
    let checkedLayers = getEnabledLayers(currentRasterIndex)
    if (checkedLayers.includes(key)) {
      let p = createCesiumImageryProvider(vLayers[key], time)
      cesiumViewer.imageryLayers.addImageryProvider(p) //draw the vector layers
    }
  }
  raiseGraticuleLayerToTop() //raise graticlue layer if enabled
  pruneLayers()
}

//get rid of some old layers
//TODO: need a smarter way to do this
export const pruneLayers = () => {
  while (cesiumViewer.imageryLayers.length > 7) {
    //console.log(cesiumViewer.imageryLayers.length)
    cesiumViewer.imageryLayers.remove(cesiumViewer.imageryLayers.get(0), true)
  }
}
