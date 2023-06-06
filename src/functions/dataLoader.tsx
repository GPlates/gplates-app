import * as Cesium from 'cesium'
import { getLowResImageUrlForGeosrv } from './util'
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
    cesiumViewer.imageryLayers.removeAll()
    //console.log(url_str, layer_name, style_name)
    let url_ = getLowResImageUrlForGeosrv(image.wmsUrl, layer_name)
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
  let url = getLowResImageUrlForGeosrv(image.wmsUrl, layer_name)
  cachingServant?.cacheURL(url.replace('{{time}}', String(time)))
  return provider
}
