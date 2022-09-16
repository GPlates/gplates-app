import assert from 'assert'

/*
 *
 */
export const timeout = async (time: number) => {
  await new Promise((resolve) => setTimeout(resolve, time))
}

//
export const timeRange = (begin: number, end: number, step: number) => {
  //I believe Number.EPSILON is good enough in this case
  assert(Math.abs(step) > Number.EPSILON) //step too small
  if (step < 0) step = -step //negative step

  if (Math.abs(begin - end) < Number.EPSILON) return [] //begin and end are the same

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

//
export const buildAnimationURL = (wmsUrl: string, layerName: string) => {
  return (
    wmsUrl +
    '?service=WMS&version=1.1.0&request=GetMap&layers=' +
    layerName +
    '&bbox=-180.0,-90.0,180.0,90.0&width=768&height=384' +
    '&srs=EPSG:4326&styles=&format=image/png; mode=8bit'
  )
}
