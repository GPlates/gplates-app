import { cesiumViewer } from '../functions/cesiumViewer'
import rasterMaps from './rasterMaps'
import { LonLatPid } from './types'
import { currentModel } from './rotationModel'

export let presentDayLonLatList: LonLatPid[] = []

export const setPresentDayLonLatList = (newList: LonLatPid[]) =>
  (presentDayLonLatList = newList)

//the reconstruction service uses this "setLonLatListCallback" to update paleo-coordinates in AddLocationWidget
//export let setLonLatListCallback: Function
//the AddLocationWidget uses this "setSetLonLatListCallback" to allow reconstruction service to update paleo-coordinates
//export const setSetLonLatListCallback = (func: Function) =>
//  (setLonLatListCallback = func)

//the reconstruction service use this "updateLocationEntitiesCallback" to notify AddLocationWidget to update locations on Cesium globe
//let updateLocationEntitiesCallback: Function
//export const setUpdateLocationEntitiesCallback = (funcs: Function) =>
//  (updateLocationEntitiesCallback = funcs)

//reconstruct present-day locations
export const reconstructPresentDayLocations = (paleoAge: number) => {
  if (
    rasterMaps.length === 0 ||
    presentDayLonLatList.length === 0 ||
    typeof cesiumViewer === 'undefined'
  )
    return []

  // fetch finite rotation for plate IDs
  currentModel.fetchFiniteRotations(
    presentDayLonLatList.map((lll) => String(lll.pid))
  )

  let paleoCoords: { lon: number; lat: number }[] = []
  presentDayLonLatList.forEach((point) => {
    let rp = currentModel.rotateLonLatPid(
      currentModel.getTimeIndex(paleoAge),
      point
    )
    //console.log(rp)
    paleoCoords.push(rp)
  })
  //setLonLatListCallback(paleoCoords) //notify AddLocationWidget
  //updateLocationEntitiesCallback(paleoCoords) //update points on Cesium globe

  return paleoCoords
}

/*
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
  */
