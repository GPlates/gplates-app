export type Vector3DType = [number, number, number]
export type LatLon = { lat: number; lon: number }
export type AxisAngle = { lat: number; lon: number; angle: number }

/**
 *
 * cross product of two vectors defined only in three-dimensional space
 * https://www.mathsisfun.com/algebra/vectors-cross-product.html
 * https://en.wikipedia.org/wiki/Cross_product#Computing
 *
 * @param a
 * @param b
 * @returns
 */
export const cross = (a: Vector3DType, b: Vector3DType): Vector3DType => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ]
}

/**
 *
 * dot product of two vectors
 * the two vectors must have the same length
 * https://www.mathsisfun.com/algebra/vectors-dot-product.html
 *
 * @param q1
 * @param q2
 * @returns
 */
export const dot = (q1: number[], q2: number[]): number => {
  if (q1.length !== q2.length) {
    throw Error('the two vectors must have the same length!')
  }
  let sum = 0
  q1.forEach((val, idx) => {
    sum += val * q2[idx]
  })
  return sum
}

/**
 *
 * @param lat
 * @param lon
 * @returns
 */
export const latLonToCart = (lat: number, lon: number): Vector3DType => {
  const x = Math.cos(lat) * Math.cos(lon)
  const y = Math.cos(lat) * Math.sin(lon)
  const z = Math.sin(lat)
  return [x, y, z]
}

/**
 *
 * @param v
 * @returns
 */
export const cartToLatLon = (v: Vector3DType): LatLon => {
  const [x, y, z] = v
  const lat = Math.asin(z)
  const lon = Math.atan2(y, x)
  return { lat, lon }
}

/**
 * Convert from degrees to radians.
 * @param degree
 * @returns
 */
export const radians = (degree: number) => {
  return (degree * Math.PI) / 180
}

/**
 * Convert from radians to degrees.
 * @param radian
 * @returns
 */
export const degrees = function (radian: number) {
  return (radian * 180) / Math.PI
}
