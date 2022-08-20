import { RasterCfg } from './types'
import { rasterData, createCesiumImageryProvider } from './DataLoader'
import { serverURL } from './settings'

export const failSafeRasterMaps = [
  {
    layer: rasterData['geology'],
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    layerName: 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref',
    style: '',
    title: 'Geology',
    subTitle: 'present day',
    icon: 'assets/raster_menu/geology-256x256.png',
    model: 'MULLER2019',
  },
  {
    layer: rasterData['agegrid'],
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    layerName: 'gplates:agegrid',
    style: '',
    title: 'Agegrid',
    subTitle: 'present day',
    icon: 'assets/raster_menu/agegrid-256x256.png',
    model: 'SETON2012',
  },
  {
    layer: rasterData['topography'],
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    layerName: 'gplates:topography',
    style: '',
    title: 'Topography',
    subTitle: 'present day',
    icon: 'assets/raster_menu/topography-256x256.png',
    model: 'MERDITH2021',
  },
]

//TODO: save in localstorage
const rasterMaps: RasterCfg[] = []
export default rasterMaps

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

//load rasters from gplates web service
export const loadRasterMaps = (callback: Function) => {
  //try localstorage first TODO
  //and then try the gplates web service server
  while (rasterMaps.length) {
    rasterMaps.pop()
  } //empty the list and then reload
  fetch(serverURL.replace(/\/+$/, '') + '/mobile/get_rasters')
    .then((response) => response.json())
    .then((json_data) => {
      //console.log(json_data)
      for (let key in json_data) {
        let o: RasterCfg = {
          layer: createCesiumImageryProvider(
            json_data[key].url,
            json_data[key].layer,
            json_data[key].style
          ),
          title: json_data[key].title,
          subTitle: json_data[key].subTitle,
          icon: 'data:image/png;base64, ' + json_data[key].icon,
          model: json_data[key].model,
        }
        rasterMaps.push(o)
      }
      callback(false) //network fail=false
    })
    .catch((error) => {
      console.log(error)
      for (const m of failSafeRasterMaps) {
        let o: RasterCfg = {
          layer: createCesiumImageryProvider(m.url, m.layerName, m.style),
          title: m.title,
          subTitle: m.subTitle,
          icon: m.icon,
          model: m.model,
        }
        rasterMaps.push(o)
      }
      callback(true) //network fail=true
    })
}
