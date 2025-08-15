import { getDefaultStore } from './storage'

/**
 *
 * @param time
 */
export const timeout = async (time: number) => {
  await new Promise((resolve) => setTimeout(resolve, time))
}

/**
 *
 */
export const timeRange = (begin: number, end: number, step: number) => {
  //I believe Number.EPSILON is good enough in this case
  if (Math.abs(step) < Number.EPSILON) {
    console.log('timeRange warning: the step is 0!')
    //step too small
    return []
  }
  if (step < 0) step = -step //negative step

  if (Math.abs(begin - end) < Number.EPSILON) {
    console.log('timeRange warning: begin and end are the same!')
    return [] //begin and end are the same
  }

  let small, big
  if (begin > end) {
    big = begin
    small = end
  } else {
    small = begin
    big = end
  }
  let ret = []
  let count = 0
  while (big > small) {
    ret.push(small)
    small += step
    count++
    if (count > 1100) break //safe guard
  }
  //array ends with the exact small number
  ret.push(big)

  return ret
}

/**
 * get the low resolution image URL for geoserver
 *
 * @param wmsUrl
 * @param layerName
 * @param overlays
 * @returns
 */
export const getLowResImageUrlForGeosrv = (
  wmsUrl: string,
  layerName: string,
  overlays: string[] = [],
) => {
  let layerName_ = layerName
  let [workspaceName, _] = layerName.split(':')

  overlays.forEach((overlay: string) => {
    let [wsn, _] = overlay.split(':')
    if (wsn === workspaceName) {
      layerName_ += ',' + overlay
    }
  })

  return (
    wmsUrl +
    '?service=WMS&version=1.1.0&request=GetMap&layers=' +
    layerName_ +
    '&bbox=-180.0,-90.0,180.0,90.0&width=1200&height=600' +
    '&srs=EPSG:4326&styles=&format=image/png; mode=8bit'
  )
}

/**
 *
 * @param url
 * @returns
 */
export const requestDataByUrl = async (url: string) => {
  if (!url) return null

  let data_map: any
  try {
    let data: any = await fetch(url)
    data_map = await data.json()
    getDefaultStore()
      .then((store) => {
        //console.log(url)
        store.set(url, data_map)
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (e) {
    console.log(e)
    let store = await getDefaultStore()
    data_map = await store.get(url)
  }

  return data_map
}
