export type QuatType = [number, number, number, number]
export type VectorType = [number, number, number]
export type LatLon = { lat: number; lon: number }

export const normalize = (v: number[], tolerance = 0.00001) => {
  let vv = v
  const initialValue = 0
  const mag2 = v.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue * currentValue,
    initialValue
  )
  if (Math.abs(mag2 - 1.0) > tolerance) {
    let mag = Math.sqrt(mag2)
    vv = v.map((x) => x / mag)
  }
  return vv
}

/*
def normalize(v, tolerance=0.00001):
    mag2 = sum(n * n for n in v)
    if abs(mag2 - 1.0) > tolerance:
        mag = sqrt(mag2)
        v = tuple(n / mag for n in v)
    return v
*/
export const quat_mult = (q1: QuatType, q2: QuatType): QuatType => {
  const [w1, x1, y1, z1] = q1
  const [w2, x2, y2, z2] = q2
  const w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
  const x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
  const y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2
  const z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2
  return [w, x, y, z]
}
/*
def quat_mult(q1, q2):
    w1, x1, y1, z1 = q1
    w2, x2, y2, z2 = q2
    w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
    x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
    y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2
    z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2
    return w, x, y, z
*/

export const quat_conjugate = (q: QuatType): QuatType => {
  let qq = normalize(q)
  const [w, x, y, z] = qq
  return [w, -x, -y, -z]
}

/*
def quat_conjugate(q):
    q = normalize(q)
    w, x, y, z = q
    return (w, -x, -y, -z)
*/

export const quat_vec_mult = (q1: QuatType, v1: VectorType): VectorType => {
  const v11: VectorType = normalize(v1) as VectorType
  const q2: QuatType = [0.0, ...v11]
  const r = quat_mult(quat_mult(q1, q2), quat_conjugate(q1))
  return [r[1], r[2], r[3]]
}

/*
def quat_vec_mult(q1, v1):
    v1 = normalize(v1)
    q2 = (0.0,) + v1
    return quat_mult(quat_mult(q1, q2), quat_conjugate(q1))[1:]
*/

export const axis_angle_to_quat = (v: VectorType, theta: number): QuatType => {
  const vv = normalize(v)
  const [x, y, z] = vv
  theta /= 2
  const w = Math.cos(theta)
  const xx = x * Math.sin(theta)
  const yy = y * Math.sin(theta)
  const zz = z * Math.sin(theta)
  return [w, xx, yy, zz]
}

/*
def axis_angle_to_quat(v, theta):
    v = normalize(v)
    x, y, z = v
    theta /= 2
    w = cos(theta)
    x = x * sin(theta)
    y = y * sin(theta)
    z = z * sin(theta)
    return w, x, y, z
*/

export const quat_to_axis_angle = (q: QuatType): [VectorType, number] => {
  const w = q[0]
  const v = [q[1], q[2], q[3]]
  const theta = Math.acos(w) * 2.0
  return [normalize(v) as VectorType, theta]
}

/*
def quat_to_axis_angle(quat):
    w, v = q[0], q[1:]
    theta = acos(w) * 2.0
    return normalize(v), theta
*/

export const lat_lon_to_cart = (lat: number, lon: number): VectorType => {
  const x = Math.cos(lat) * Math.cos(lon)
  const y = Math.cos(lat) * Math.sin(lon)
  const z = Math.sin(lat)
  return [x, y, z]
}

/*
def lat_lon_to_cart(lat, lon):
    x = cos(lat) * cos(lon)
    y = cos(lat) * sin(lon)
    z = sin(lat)
    return x, y, z
*/

export const cart_to_lat_lon = (v: VectorType): LatLon => {
  const [x, y, z] = v
  const lat = Math.asin(z)
  const lon = Math.atan2(y, x)
  return { lat, lon }
}

/*
def cart_to_lat_lon(x, y, z):
    lat = asin(z)
    lon = atan2(y, x)
    return lat, lon
*/

// Convert from degrees to radians.
const radians = (degree: number) => {
  return (degree * Math.PI) / 180
}
// Convert from radians to degrees.
const degrees = function (radian: number) {
  return (radian * 180) / Math.PI
}
/*
# point: lat lon coordinates in degrees
# axis:  lat lon coordinates in degrees
# angle: degree
# return: lat lon in degrees
*/
export const rotate = (point: LatLon, axis: LatLon, angle: number): LatLon => {
  let v = lat_lon_to_cart(radians(point.lat), radians(point.lon))
  let axis_v = lat_lon_to_cart(radians(axis.lat), radians(axis.lon))
  let quat = axis_angle_to_quat(axis_v, radians(angle))
  let ret = quat_vec_mult(quat, v)
  let ret_lat_lon = cart_to_lat_lon(ret)
  return { lat: degrees(ret_lat_lon.lat), lon: degrees(ret_lat_lon.lon) }
}

/*
# point: lat lon coordinates
# axis:  lat lon coordinates
# angle: degree
# return: lat lon
def rotate(point, axis, angle):
    v = lat_lon_to_cart(radians(point[0]), radians(point[1]))
    axis = lat_lon_to_cart(radians(axis[0]), radians(axis[1]))
    quat = axis_angle_to_quat(axis, radians(angle))
    ret = quat_vec_mult(quat, v)
    ret_lat_lon = cart_to_lat_lon(ret[0], ret[1], ret[2])
    return degrees(ret_lat_lon[0]), degrees(ret_lat_lon[1])
*/
