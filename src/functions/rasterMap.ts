import { RasterCfg } from '../functions/types'
import {
  rasterData,
  createCesiumImageryProvider,
} from '../functions/DataLoader'

export const failSafeRasterMaps = [
  {
    layer: rasterData['geology'],
    title: 'Geology',
    subTitle: 'present day',
    icon: 'assets/raster_menu/geology-256x256.png',
  },
  {
    layer: rasterData['agegrid'],
    title: 'Agegrid',
    subTitle: 'present day',
    icon: 'assets/raster_menu/agegrid-256x256.png',
  },
  {
    layer: rasterData['topography'],
    title: 'Topography',
    subTitle: 'present day',
    icon: 'assets/raster_menu/topography-256x256.png',
  },
]

//async version. (NOT IN USE FOR NOW)
export const getRasters = async () => {
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
      }
      rasterMap.push(o)
    }
    console.log(rasterMap)
    return rasterMap
  } catch (err) {
    return failSafeRasterMaps
  }
}

//load rasters from gplates web service
export const getRasterMap = (callback: any) => {
  //try localstorage first TODO
  //and then try the gplates web service server
  fetch('https://gws.gplates.org/mobile/get_rasters')
    .then((response) => response.json())
    .then((json_data) => {
      //console.log(json_data)
      let rasterList: RasterCfg[] = []
      for (let key in json_data) {
        let o: RasterCfg = {
          layer: createCesiumImageryProvider(
            json_data[key].url,
            json_data[key].layer
          ),
          title: json_data[key].title,
          subTitle: json_data[key].subTitle,
          icon: 'data:image/png;base64, ' + json_data[key].icon,
        }
        rasterList.push(o)
      }
      //console.log(rasterList)
      callback(rasterList)
    })
    .catch((error) => {
      console.log(error)
      callback(failSafeRasterMaps)
    })
}
