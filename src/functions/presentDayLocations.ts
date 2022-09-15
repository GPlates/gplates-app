import { cesiumViewer } from '../pages/Main'
import { serverURL } from './settings'
import rasterMaps, { currentRasterIndex } from './rasterMaps'
import { LonLatPid } from './types'
import { rotate } from './quaternions'

export let presentDayLonLatList: LonLatPid[] = []

export const setPresentDayLonLatList = (newList: LonLatPid[]) =>
  (presentDayLonLatList = newList)

//the reconstruction service uses this "setLonLatListCallback" to update paleo-coordinates in AddLocationWidget
export let setLonLatListCallback: Function
//the AddLocationWidget uses this "setSetLonLatListCallback" to allow reconstruction service to update paleo-coordinates
export const setSetLonLatListCallback = (func: Function) =>
  (setLonLatListCallback = func)

//the reconstruction service use this "updateLocationEntitiesCallback" to notify AddLocationWidget to update locations on Cesium globe
let updateLocationEntitiesCallback: Function
export const setUpdateLocationEntitiesCallback = (funcs: Function) =>
  (updateLocationEntitiesCallback = funcs)

let finiteRotations = new Map<string, any>()

// /rotation/get_euler_pole_and_angle?times=0,50,100&group_by_pid
export const getFiniteRotations = (times: number[]) => {
  let pids: number[] = []
  presentDayLonLatList.forEach((value) => {
    if (pids.indexOf(value.pid) < 0) {
      pids.push(value.pid)
    }
  })
  fetch(
    serverURL +
      `/rotation/get_euler_pole_and_angle?times=${times.join()}` +
      `&pids=${pids.join()}&model=` +
      rasterMaps[currentRasterIndex].model +
      '&group_by_pid'
  )
    .then((response) => response.json())
    .then((jsonData) => {
      finiteRotations = new Map(Object.entries(jsonData))
      //console.log(finiteRotations)
    })
    .catch((error) => {
      console.log(error)
    })
}

//reconstruct present-day locations
export const reconstructPresentDayLocations = async (paleoAge: number) => {
  getFiniteRotations(Array.from(new Array(20), (x, i) => i + 1))
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
  let paleoCoords: { lon: number; lat: number }[] = []
  presentDayLonLatList.forEach((item) => {
    let rotations = finiteRotations.get(String(item.pid))
    let poleAndAngle = rotations ? rotations[1] : [0, 90, 0]
    let rp = rotate(
      { lat: item.lat, lon: item.lon },
      { lat: poleAndAngle[1], lon: poleAndAngle[0] },
      poleAndAngle[2]
    )
    //console.log(rp)
    paleoCoords.push({ lon: item.lon + 1, lat: item.lat + 1 })
    item.lon += 1
    item.lat += 1
  })
  setLonLatListCallback(paleoCoords) //notify AddLocationWidget
  updateLocationEntitiesCallback(paleoCoords) //update points on Cesium globe
  return
}
