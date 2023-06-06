import { RasterCfg, RasterGroup } from './types'
import { serverURL } from './settings'
import { getDefaultStore } from './storage'

/**
 * hardcode configuration in case the network is not working and
 * there is no local cache available.
 */
export const failSafeRasterMaps: RasterCfg[] = [
  {
    id: 'geology',
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    wmsUrl: 'https://geosrv.earthbyte.org/geoserver/gplates/wms',
    paleoMapUrl: '',
    layerName: 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref',
    style: '',
    title: 'Geology',
    subTitle: 'present day',
    icon: 'assets/raster_menu/geology-256x256.png',
    startTime: 0,
    endTime: 0,
    step: 0,
  },
  {
    id: 'agegrid',
    url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
    wmsUrl: 'https://geosrv.earthbyte.org/geoserver/gplates/wms',
    paleoMapUrl: '',
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
]

const rasterMaps: RasterCfg[] = []
export default rasterMaps

const presentDayRasters: RasterCfg[] = []
const paleoRasters: RasterCfg[] = []

/**
 * find basemap configuration by ID
 *
 * @param id - basemap ID
 * @returns - basemap configuration
 */
export const getRasterByID = (id: string) => {
  for (let i = 0; i < rasterMaps.length; i++) {
    if (rasterMaps[i].id === id) return rasterMaps[i]
  }
  return undefined
}

/**
 * find basemap index config by ID
 *
 * @param id - basemap ID
 * @returns - basemap index
 */
export const getRasterIndexByID = (id: string) => {
  for (let i = 0; i < rasterMaps.length; i++) {
    if (rasterMaps[i].id === id) return i
  }
  return undefined
}

/**
 * return the basemaps according to which basemap group is in use
 *
 * @param rasterGroup - basemap group
 * @returns - a list of basemap configuration
 */
export const getRasters = (rasterGroup: RasterGroup) => {
  if (rasterGroup == RasterGroup.present) {
    return getPresentDayRasters()
  } else if (rasterGroup == RasterGroup.paleo) {
    return getPaleoRasters()
  } else {
    return [] //should never happen
  }
}

/**
 * get present-day basemaps
 * @returns present day basemaps
 */
export const getPresentDayRasters = () => {
  if (presentDayRasters.length == 0) {
    groupRasters()
  }
  return presentDayRasters
}

/**
 * get paleo-basemaps
 * @returns paleo-basemaps
 */
export const getPaleoRasters = () => {
  if (presentDayRasters.length == 0) {
    groupRasters()
  }
  return paleoRasters
}

/**
 * divide the basemaps into two groups, present-day and paleo
 */
const groupRasters = () => {
  for (let i = 0; i < rasterMaps.length; i++) {
    //without a rotation model, it means present-day raster

    if (!rasterMaps[i].model) {
      presentDayRasters.push(rasterMaps[i])
    } else {
      // with a rotation model, it means paleo-raster
      paleoRasters.push(rasterMaps[i])
    }
  }
}

/**
 *  async version. (NOT IN USE FOR NOW)
 *  keep the code here, may be useful in the future
 */
/*
const getRasters = async () => {
  try {
    let rasterMap: RasterCfg[] = []
    let res = await fetch('https://gws.gplates.org/mobile/get_basemaps')
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
}
*/

/**
 * load rasters from gplates web service
 *
 * @param callback - the callback function when done loading
 */
export const loadRasterMaps = (callback: Function) => {
  fetch(serverURL.replace(/\/+$/, '') + '/mobile/get_basemaps')
    .then((response) => response.json())
    .then((jsonData) => {
      //console.log(json_data)
      rasterMaps.length = 0
      //rasterMaps.splice(0, rasterMaps.length)
      rasterMaps.push(...convertJsonToRasterMaps(jsonData))
      callback(false) //network fail=false
      //save the data to local storage
      getDefaultStore()
        .then((store) => {
          store.set('rasters', jsonData)
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(async (error) => {
      console.log(error)
      //network failed, not try local storage
      try {
        let store = await getDefaultStore()
        let localData = await store.get('rasters')
        console.log('localData')
        console.log(localData)
        if (localData) {
          rasterMaps.push(...convertJsonToRasterMaps(localData))
        } else {
          rasterMaps.push(...convertJsonToRasterMaps(failSafeRasterMaps))
        }
      } catch (err) {
        console.log(err)
      }
      callback(true) //network fail=true
    })
}

/**
 * this function convert the JSON data retrieved from server to a
 * list of RasterCfg objects
 *
 * @param jsonData - data in JSON format
 * @returns
 */
const convertJsonToRasterMaps = (jsonData: any) => {
  let maps = []
  for (let key in jsonData) {
    let iconStr: string = jsonData[key].icon
    if (!iconStr.startsWith('assets')) {
      iconStr = 'data:image/png;base64, ' + iconStr
    }
    let o: RasterCfg = {
      id: key,
      layerName: jsonData[key].layerName,
      url: jsonData[key].url,
      wmsUrl: jsonData[key].wmsUrl,
      paleoMapUrl: jsonData[key].paleoMapUrl,
      style: jsonData[key].style,
      title: jsonData[key].title,
      subTitle: jsonData[key].subTitle,
      icon: iconStr,
      startTime: jsonData[key].startTime,
      endTime: jsonData[key].endTime,
      step: jsonData[key].step,
      model: jsonData[key].model,
    }
    maps.push(o)
  }
  return maps
}
