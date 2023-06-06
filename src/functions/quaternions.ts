import { Vector3DType } from './math-utils.js'

export type QuatType = [number, number, number, number]

/*
 * normalize a vector
 * A normalized vector maintains its direction but its Length becomes 1.
 * The resulting vector is often called a unit vector.
 * A vector is normalized by dividing the vector by its own Length.
 */
export const normalize = (v: number[], tolerance = 0.00001) => {
  let vv = v
  const initialValue = 0
  const mag2 = v.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue * currentValue,
    initialValue
  )
  if (Math.abs(mag2 - 1.0) > tolerance && mag2 > 0) {
    let mag = Math.sqrt(mag2)
    vv = v.map((x) => x / mag)
  }
  return vv
}

/**
 *
 * @param q1
 * @param q2
 * @returns
 */
export const quatMult = (q1: QuatType, q2: QuatType): QuatType => {
  const [w1, x1, y1, z1] = q1
  const [w2, x2, y2, z2] = q2
  const w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
  const x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
  const y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2
  const z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2
  return [w, x, y, z]
}

/**
 *
 * @param q
 * @returns
 */
export const quatConjugate = (q: QuatType): QuatType => {
  let qq = normalize(q)
  const [w, x, y, z] = qq
  return [w, -x, -y, -z]
}

/**
 *
 * @param q1
 * @param v1
 * @returns
 */
export const quatVecMult = (q1: QuatType, v1: Vector3DType): Vector3DType => {
  const v11: Vector3DType = normalize(v1) as Vector3DType
  const q2: QuatType = [0.0, ...v11]
  const r = quatMult(quatMult(q1, q2), quatConjugate(q1))
  return [r[1], r[2], r[3]]
}

/**
 *
 * @param v
 * @param theta
 * @returns
 */
export const axisAngleToQuat = (v: Vector3DType, theta: number): QuatType => {
  const vv = normalize(v)
  const [x, y, z] = vv
  theta /= 2
  const w = Math.cos(theta)
  const xx = x * Math.sin(theta)
  const yy = y * Math.sin(theta)
  const zz = z * Math.sin(theta)
  return [w, xx, yy, zz]
}

/**
 *
 * @param q
 * @returns
 */
export const quatToAxisAngle = (q: QuatType): [Vector3DType, number] => {
  const w = q[0]
  const v = [q[1], q[2], q[3]]
  const theta = Math.acos(w) * 2.0
  return [normalize(v) as Vector3DType, theta]
}

/*
 * quaternion dot (The dot product for quaternions is simply the standard Euclidean dot product in 4D)
 */
const quatDot = (q1: QuatType, q2: QuatType) => {
  let sum = 0
  q1.forEach((val, idx) => {
    sum += val * q2[idx]
  })
  return sum
}

/*
 * quaternion add
 */
const quatAdd = (q1: QuatType, q2: QuatType) => {
  let ret: QuatType = [0, 0, 0, 0]
  q1.forEach((val, idx) => {
    ret[idx] = val + q2[idx]
  })
  return ret
}

/*
 * quaternion multiply with a number
 */
const quatMultNumber = (q: QuatType, t: number) => {
  let ret: QuatType = [0, 0, 0, 0]
  q.forEach((val, idx) => {
    ret[idx] = t * val
  })
  return ret
}

/**
 *
 * quaternion negate
 */
const quatNegate = (q: QuatType) => {
  let ret: QuatType = [-q[0], -q[1], -q[2], -q[3]]
  return ret
}

/*
 *  quaternion slerp (spherical linear interpolation)
 *  Slerp(ql,q2,t) = sin((1-t)*theta)/sin(theta)*q1 + sin(t*theta)/sin(theta)*q2
 */
export const quatSlerp = (q1: QuatType, q2: QuatType, t: number) => {
  let cos_theta = quatDot(q1, q2)
  if (cos_theta < 0) {
    //we don't want to interpolate the path along the longer path
    //the earth is sperical, there are two way to retaton from one point to another(forward and backward)
    cos_theta = -cos_theta
    q1 = quatNegate(q1)
  }
  if (Math.abs(cos_theta - 1) < Number.EPSILON || cos_theta > 1) {
    //two identical quaternions
    return q2
  }

  let theta = Math.acos(cos_theta)

  // 1/sin(theta)
  let factor = 1.0 / Math.sqrt(1.0 - cos_theta * cos_theta)

  let c1 = Math.sin((1.0 - t) * theta) * factor // sin((1-t)*theta)/sin(theta)
  let c2 = Math.sin(t * theta) * factor //sin(t*theta)/sin(theta)

  //sin((1-t)*theta)/sin(theta)*q1 + sin(t*theta)/sin(theta)*q2
  return quatAdd(quatMultNumber(q1, c1), quatMultNumber(q2, c2))
}
