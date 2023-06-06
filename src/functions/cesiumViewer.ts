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

/**
 *
 * @returns
 */
export const getDefaultCameraHeight = () => {
  if (window.innerWidth < 500 || window.innerHeight < 500) {
    return 19000000
  } else {
    return DEFAULT_CAMERA_HEIGHT
  }
}

/**
 * initialize the Cesium viewer
 * @param provider
 */
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
      getDefaultCameraHeight()
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

/**
 * draw raster layer and vector layers
 * @param time
 * @param rasterCfg
 */
export const drawLayers = (time: number, rasterCfg: RasterCfg) => {
  //draw the raster layer
  const provider = createCesiumImageryProvider(rasterCfg, time)
  cesiumViewer.imageryLayers.addImageryProvider(provider)

  //draw the vector layers
  let vectorLayers = getVectorLayers(rasterCfg.id)
  for (let id in vectorLayers) {
    let enabledLayers = getEnabledLayers(rasterCfg.id)

    if (enabledLayers.includes(id)) {
      let imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
        createCesiumImageryProvider(vectorLayers[id], time)
      )
      updateImageryLayer(id, imageryLayer)
    }
  }
  raiseGraticuleLayerToTop() //raise graticlue layer if enabled
  pruneLayers()
}

/**
 * get rid of some old layers
 * TODO: need a smarter way to do this
 */
export const pruneLayers = () => {
  while (cesiumViewer.imageryLayers.length > 7) {
    //console.log(cesiumViewer.imageryLayers.length)
    cesiumViewer.imageryLayers.remove(cesiumViewer.imageryLayers.get(0), true)
  }
}
