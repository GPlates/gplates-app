import * as Cesium from 'cesium'
import { buildAnimationURL } from './util'
import { RasterCfg } from './types'
import { cachingServant } from './cache'
import { cesiumViewer } from './cesiumViewer'

var gridsetName = 'EPSG:4326'
var gridNames = [
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

export const createCesiumImageryProvider = (raster: RasterCfg, time = 0) => {
  let url_str = raster.url
  let layer_name = raster.layerName
  let style_name = raster.style
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
  const handler = (providerError: any) => {
    console.log(providerError)
    cesiumViewer.imageryLayers.removeAll()
    //console.log(url_str, layer_name, style_name)
    let url_ = buildAnimationURL(raster.wmsUrl, layer_name)
    cachingServant
      .getCachedRequest(url_.replace('{{time}}', String(time)))
      .then((dataURL) => {
        const provider = new Cesium.SingleTileImageryProvider({
          url: dataURL,
        })
        cesiumViewer.imageryLayers.addImageryProvider(provider)
      })
      .catch((err) => {
        console.log('Error: createCesiumImageryProvider error handler')
        console.log(err)
      })
  }
  provider.errorEvent.addEventListener(handler)

  //cache the low resolution image
  let url = buildAnimationURL(raster.wmsUrl, layer_name)
  cachingServant?.cacheURL(url.replace('{{time}}', String(time)))
  return provider
}
