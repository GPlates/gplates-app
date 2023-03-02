import { Preferences } from '@capacitor/preferences'
import { Color, Viewer, ImageryProvider, Cartesian3 } from 'cesium'
import { createCesiumImageryProvider } from './dataLoader'
import { getVectorLayers, getEnabledLayers } from '../functions/vectorLayers'
import {
  raiseGraticuleLayerToTop,
  showGraticule,
  setShowGraticuleFlag,
} from './graticule'
import { updateImageryLayer } from '../components/VectorDataLayerMenu'
import { RasterCfg } from './types'

//singleton cersium viewer
export let cesiumViewer: Viewer

export const HOME_LONGITUDE = 135.0
export const HOME_LATITUDE = -25.0
export const DEFAULT_CAMERA_HEIGHT = 15000000

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

  viewer.scene.camera.setView({
    destination: Cartesian3.fromDegrees(
      HOME_LONGITUDE,
      HOME_LATITUDE,
      DEFAULT_CAMERA_HEIGHT
    ),
  })
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
export const drawLayers = (
  time: number,
  rasterMaps: RasterCfg[],
  currentRasterIndex: number
) => {
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
      let imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
        createCesiumImageryProvider(vLayers[key], time)
      ) //draw the vector layers
      updateImageryLayer(key, imageryLayer)
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
