import { cesiumViewer } from '../pages/Main'
import { serverURL } from './settings'
import rasterMaps, { currentRasterIndex } from './rasterMaps'

export let presentDayLonLatList: { lon: number; lat: number }[] = []

export const setPresentDayLonLatList = (
  newList: { lon: number; lat: number }[]
) => (presentDayLonLatList = newList)

//for the reconstruction service to upload paleo-coordinates in AddLocationWidget
export let setLonLatListCallback: Function
export const setSetLonLatListCallback = (func: Function) =>
  (setLonLatListCallback = func)

let updateLocationEntitiesCallback: Function
export const setUpdateLocationEntitiesCallback = (funcs: Function) =>
  (updateLocationEntitiesCallback = funcs)

//reconstruct present-day locations
export const reconstructPresentDayLocations = async (paleoAge: number) => {
  if (
    rasterMaps.length === 0 ||
    presentDayLonLatList.length === 0 ||
    typeof cesiumViewer === 'undefined'
  )
    return

  let coordsStr = ''
  presentDayLonLatList.forEach((item) => {
    coordsStr += item.lon.toFixed(4) + ',' + item.lat.toFixed(4) + ','
  })
  coordsStr = coordsStr.slice(0, -1)
  let data = await fetch(
    serverURL +
      `/reconstruct/reconstruct_points/?points=${coordsStr}&time=${paleoAge}&model=` +
      rasterMaps[currentRasterIndex].model
  )
  let dataJson = await data.json()
  //console.log(dataJson['coordinates'])
  let paleoCoords: { lon: number; lat: number }[] = []
  dataJson['coordinates'].forEach((coord: [number, number]) => {
    paleoCoords.push({ lon: coord[0], lat: coord[1] })
  })
  console.log(`paleoAge:${paleoAge}`)
  setLonLatListCallback(paleoCoords) //notify AddLocationWidget
  updateLocationEntitiesCallback(paleoCoords) //update points on Cesium globe
  return
}
