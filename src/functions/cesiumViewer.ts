import { Preferences } from '@capacitor/preferences'
//import { Color, Viewer, ImageryProvider, Cartesian3 } from 'cesium'
import * as Cesium from 'cesium'
import { getVectorLayers, getEnabledLayers } from '../functions/vectorLayers'
import {
  raiseGraticuleLayerToTop,
  showGraticule,
  setShowGraticuleFlag,
} from './graticule'
import { updateImageryLayer } from '../components/VectorDataLayerMenu'
import { RasterCfg } from './types'

/**
 * This module contains functions to manipulate Cesium Viewer.
 */

//singleton Cersium Viewer object
export let cesiumViewer: Cesium.Viewer

export const HOME_LONGITUDE = 135.0
export const HOME_LATITUDE = -25.0
export const DEFAULT_CAMERA_HEIGHT = 15000000
export const DEFAULT_CAMERA_HEIGHT_SMALL_SCREEN = 19000000

let currentBasemapLayer: Cesium.ImageryLayer | null = null
let currentSingleTileImageryLayer: Cesium.ImageryLayer | null = null
export const currentVectorLayers: Cesium.ImageryLayer[] = []

/**
 *
 * @param layer
 */
export const setCurrentBasemapLayer = (layer: Cesium.ImageryLayer | null) => {
  currentBasemapLayer = layer
}

/**
 *
 * @param layer
 */
export const setCurrentSingleTileImageryLayer = (
  layer: Cesium.ImageryLayer | null
) => {
  currentSingleTileImageryLayer = layer
}

/**
 *
 * @returns
 */
export const getCurrentSingleTileImageryLayer = () => {
  return currentSingleTileImageryLayer
}

/**
 *
 * @returns - the default camera height for Cesium Viewer
 */
export const getDefaultCameraHeight = () => {
  if (window.innerWidth < 500 || window.innerHeight < 500) {
    return DEFAULT_CAMERA_HEIGHT_SMALL_SCREEN
  } else {
    return DEFAULT_CAMERA_HEIGHT
  }
}

/**
 * initialize the Cesium viewer
 * @param provider
 */
export const initCesiumViewer = (provider: Cesium.ImageryProvider) => {
  let viewer: Cesium.Viewer = new Cesium.Viewer('cesiumContainer', {
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
  viewer.scene.backgroundColor = Cesium.Color.BLACK

  viewer.scene.globe.tileCacheSize = 1000

  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      HOME_LONGITUDE,
      HOME_LATITUDE,
      getDefaultCameraHeight()
    ),
  })
  cesiumViewer = viewer
  currentBasemapLayer = viewer.imageryLayers.get(0) //the only imagery layer so far
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
 * draw basemap layer and vector layers
 * maily being used in animation
 *
 * @param time - paleo-age
 * @param rasterCfg - basemap configuration
 */
export const drawLayers = (time: number, rasterCfg: RasterCfg) => {
  //draw the basemap layer
  const provider = createCesiumImageryProvider(rasterCfg, time)
  let newBasemapLayer = cesiumViewer.imageryLayers.addImageryProvider(provider)
  removeCurrentImageryLayers()
  currentBasemapLayer = newBasemapLayer

  //draw the vector layers
  let vectorLayers = getVectorLayers(rasterCfg.id)
  for (let id in vectorLayers) {
    let enabledLayers = getEnabledLayers(rasterCfg.id)

    if (enabledLayers.includes(id)) {
      let imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
        createCesiumImageryProvider(vectorLayers[id], time)
      )
      currentVectorLayers.push(imageryLayer)
      updateImageryLayer(id, imageryLayer)
    }
  }
  raiseGraticuleLayerToTop() //raise graticlue layer if enabled
  //pruneLayers()
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

/**
 * remove basemap imagery layer after 2 seconds delay
 *
 * @param layer
 */
const delayRemoveBaseLayer = (layer: Cesium.ImageryLayer) => {
  setTimeout(() => {
    if (layer) {
      if (!cesiumViewer.imageryLayers.remove(layer, true)) {
        console.log('Failed to remove basemap layer: ', layer)
      }
    }
  }, 2000)
}

/**
 *
 * remove all vector layers and basemap layer
 */
export const removeCurrentImageryLayers = () => {
  if (currentBasemapLayer) {
    delayRemoveBaseLayer(currentBasemapLayer)
  }
  currentBasemapLayer = null

  for (let i = 0; i < currentVectorLayers.length; i++) {
    //console.log('removing: ', currentVectorLayers[i])
    if (!cesiumViewer.imageryLayers.remove(currentVectorLayers[i])) {
      console.log('failed to remove vector layer:', currentVectorLayers[i])
    }
  }
  currentVectorLayers.length = 0
}

/**
 *
 * @param raster - new base map configuration
 */
export const drawBasemap = (raster: RasterCfg) => {
  //draw a new basemap
  let provider = createCesiumImageryProvider(raster)
  let newBasemapLayer = cesiumViewer.imageryLayers.addImageryProvider(provider)
  removeCurrentImageryLayers()
  setCurrentBasemapLayer(newBasemapLayer)
}

const gridsetName = 'EPSG:4326'
const gridNames = [
  'EPSG:4326:0',
  'EPSG:4326:1',
  'EPSG:4326:2',
  'EPSG:4326:3',
  'EPSG:4326:4',
  'EPSG:4326:5',
  'EPSG:4326:6',
  'EPSG:4326:7',
  'EPSG:4326:8',
  'EPSG:4326:9',
  'EPSG:4326:10',
  'EPSG:4326:11',
  'EPSG:4326:12',
  'EPSG:4326:13',
  'EPSG:4326:14',
  'EPSG:4326:15',
  'EPSG:4326:16',
  'EPSG:4326:17',
  'EPSG:4326:18',
  'EPSG:4326:19',
  'EPSG:4326:20',
  'EPSG:4326:21',
]

/**
 *
 * @param image - the input "image:any" must have properties: "url", "layerName", "style", "wmsUrl"
 * @param time - the paleo-age for paleo-maps
 * @returns
 */
export const createCesiumImageryProvider = (image: any, time = 0) => {
  if (image.layerName == 'bing-map') {
    const bing = new Cesium.BingMapsImageryProvider({
      url: image.url,
      key: image.style,
      mapStyle: Cesium.BingMapsStyle.AERIAL,
    })
    return bing
  }

  let url_str = image.url
  let layer_name = image.layerName
  let style_name = image.style
  let provider = new Cesium.WebMapTileServiceImageryProvider({
    url: url_str,
    layer: layer_name.replace('{{time}}', String(time)),
    style: style_name,
    format: 'image/png',
    tileMatrixSetID: gridsetName,
    tileMatrixLabels: gridNames,
    //minimumLevel: 1,
    maximumLevel: 8,
    tilingScheme: new Cesium.GeographicTilingScheme(),
    credit: new Cesium.Credit('EarthByte, The University of Sydney'),
  })

  //if the network is disconnected, use this error handler to load stored low resolution image
  const handler = (providerError: any) => {
    console.log(providerError)
    //cesiumViewer.imageryLayers.removeAll()
    //console.log(url_str, layer_name, style_name)
    /*
    let url_ = getLowResImageUrlForGeosrv(image.wmsUrl, layer_name)
    cachingServant
      .getCachedRequest(url_.replace('{{time}}', String(time)))
      .then((dataURL) => {
        let stp = new Cesium.SingleTileImageryProvider({
          url: dataURL,
        })
        stp.errorEvent.addEventListener((err) => {
          console.log(err)
          err.provider.readyPromise.catch((err: any) => console.log(err))
        })
        cesiumViewer.imageryLayers.addImageryProvider(stp)
      })
      .catch((err) => {
        console.log('Error: createCesiumImageryProvider error handler')
        console.log(err)
      })
    */
  }
  //provider.errorEvent.addEventListener(handler)

  //cache the low resolution image
  //let url = getLowResImageUrlForGeosrv(image.wmsUrl, layer_name)
  //cachingServant?.cacheURL(url.replace('{{time}}', String(time)))
  return provider
}
