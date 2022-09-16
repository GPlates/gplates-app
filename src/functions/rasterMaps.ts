import { RasterCfg } from './types'
import { rasterData, createCesiumImageryProvider } from './dataLoader'
import { serverURL } from './settings'

export const failSafeRasterMaps: RasterCfg[] = [
  {
    layer: rasterData['geology'],
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    wmsUrl: 'https://geosrv.earthbyte.org/geoserver/gplates/wms',
    layerName: 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref',
    style: '',
    title: 'Geology',
    subTitle: 'present day',
    icon: 'assets/raster_menu/geology-256x256.png',
    startTime: 0,
    endTime: 0,
    step: 0,
    model: 'MULLER2019',
  },
  {
    layer: rasterData['agegrid'],
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    wmsUrl: 'https://geosrv.earthbyte.org/geoserver/gplates/wms',
    layerName: 'gplates:agegrid',
    style: '',
    title: 'Agegrid',
    subTitle: 'present day',
    icon: 'assets/raster_menu/agegrid-256x256.png',
    startTime: 0,
    endTime: 0,
    step: 0,
    model: 'SETON2012',
  },
  {
    layer: rasterData['topography'],
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    wmsUrl: 'https://geosrv.earthbyte.org/geoserver/gplates/wms',
    layerName: 'gplates:topography',
    style: '',
    title: 'Topography',
    subTitle: 'present day',
    icon: 'assets/raster_menu/topography-256x256.png',
    startTime: 0,
    endTime: 0,
    step: 0,
    model: 'MERDITH2021',
  },
]

//TODO: save in localstorage
const rasterMaps: RasterCfg[] = []
export default rasterMaps
export let currentRasterIndex: number = 0

export const setCurrentRasterIndex = (idx: number) => {
  if (rasterMaps.length > idx) {
    currentRasterIndex = idx
  } else {
    console.log('Error: setCurrentRasterIndex() try to set an invalid index')
  }
}

//async version. (NOT IN USE FOR NOW)
//keep the code here, may be useful in the future
/*const getRasters = async () => {
  try {
    let rasterMap: RasterCfg[] = []
    let res = await fetch('https://gws.gplates.org/mobile/get_rasters')
    let json_data = await res.json()

    //console.log(json_data)
    for (let key in json_data) {
      let o = {
        layer: createCesiumImageryProvider(
          json_data[key].url,
          json_data[key].layer
        ),
        title: json_data[key].title,
        subTitle: json_data[key].subTitle,
        icon: 'data:image/png;base64, ' + json_data[key].icon,
        model: json_data[key].model,
      }
      rasterMap.push(o)
    }
    console.log(rasterMap)
    return rasterMap
  } catch (err) {
    return failSafeRasterMaps
  }
}*/

//
// when layer is time-dependent, the layerName is a template.
// the {{time}} is the placeholder for the real time
// replace {{time}} with the startTime
//
function getStartLayerName(layerData: any) {
  let layerName = layerData.layerName
  if (layerData.startTime > layerData.endTime) {
    layerName = layerName.replace('{{time}}', layerData.endTime.toString())
  }
  return layerName
}

//
//load rasters from gplates web service
//
export const loadRasterMaps = (callback: Function) => {
  //try localstorage first TODO
  //and then try the gplates web service server
  while (rasterMaps.length) {
    rasterMaps.pop()
  } //empty the list and then reload
  fetch(serverURL.replace(/\/+$/, '') + '/mobile/get_rasters')
    .then((response) => response.json())
    .then((jsonData) => {
      //console.log(json_data)
      for (let key in jsonData) {
        let o: RasterCfg = {
          layer: createCesiumImageryProvider(
            jsonData[key].url,
            getStartLayerName(jsonData[key]),
            jsonData[key].style
          ),
          layerName: jsonData[key].layerName,
          url: jsonData[key].url,
          wmsUrl: jsonData[key].wmsUrl,
          style: jsonData[key].style,
          title: jsonData[key].title,
          subTitle: jsonData[key].subTitle,
          icon: 'data:image/png;base64, ' + jsonData[key].icon,
          startTime: jsonData[key].startTime,
          endTime: jsonData[key].endTime,
          step: jsonData[key].step,
          model: jsonData[key].model,
        }
        rasterMaps.push(o)
      }
      callback(false) //network fail=false
    })
    .catch((error) => {
      console.log(error)
      for (const m of failSafeRasterMaps) {
        let o: RasterCfg = {
          layer: createCesiumImageryProvider(
            m.url,
            getStartLayerName(m),
            m.style
          ),
          layerName: m.layerName,
          url: m.url,
          wmsUrl: m.wmsUrl,
          style: m.style,
          title: m.title,
          subTitle: m.subTitle,
          icon: m.icon,
          startTime: m.startTime,
          endTime: m.endTime,
          step: m.step,
          model: m.model,
        }
        rasterMaps.push(o)
      }
      callback(true) //network fail=true
    })
}
