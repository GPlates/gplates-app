/*
 * LOOK HERE!!!
 * This should be replaced with https://www.npmjs.com/package/gplates
 */
import {
  QuatType,
  quatMult,
  quatSlerp,
  quatToAxisAngle,
  axisAngleToQuat,
  quatVecMult,
  quatConjugate,
} from './quaternions'

import {
  AxisAngle,
  LatLon,
  latLonToCart,
  cartToLatLon,
  radians,
  degrees,
} from './math-utils'

/*
Each "moving plate ID" has 1 or several rotation sequences.
For example,
sequence 1
101 0  .... 701
101 10 .... 701
101 20 .... 701 <=====crossover
sequence 2
101 20 .....801
101 30 .....801
101 40 .... 801 <=====crossover
sequence 3
101 40 .... 901
101 50 .... 901
101 60 .... 901

The rotation for "moving plate ID" 101 has three rotation sequences
*/
export class RotationSequence {
  fixedPlateID: number
  times: number[]
  poleLons: number[]
  poleLats: number[]
  angles: number[]
  constructor(
    fixedPlateID: number,
    times: number[],
    poleLons: number[],
    poleLats: number[],
    angles: number[]
  ) {
    this.fixedPlateID = fixedPlateID
    if (
      times.length === poleLats.length &&
      times.length === poleLons.length &&
      times.length === angles.length
    ) {
      this.times = times
      this.poleLons = poleLons
      this.poleLats = poleLats
      this.angles = angles
    } else {
      throw new Error(
        'The size of times, poleLons,poleLats and angles must be the same. '
      )
    }
  }

  /**
   *
   */
  print() {
    console.log(this.fixedPlateID)
    console.log(this.times)
    console.log(this.poleLons)
    console.log(this.poleLats)
    console.log(this.angles)
  }

  /**
   * Given a time, return the relative rotation against fixed plate ID
   * Basically, just slerp the quaternion
   *
   * @param time
   * @returns
   */
  getRotation(time: number): AxisAngle | undefined {
    //only one time in this sequence, return it if time equals, otherwise return undefined
    if (this.times.length === 1) {
      if (Math.abs(this.times[0] - time) < Number.EPSILON) {
        return {
          lat: this.poleLats[0],
          lon: this.poleLons[0],
          angle: this.angles[0],
        }
      }
    } else {
      let qs = this.getQuaternion(time)
      if (qs !== undefined) {
        let [v, theta] = quatToAxisAngle(qs)
        let latLon = cartToLatLon(v)

        return {
          lat: degrees(latLon.lat),
          lon: degrees(latLon.lon),
          angle: degrees(theta),
        }
      }
    }
    return undefined
  }

  /**
   * The given time lies between this.times[index] and this.times[index+1]
   *
   * @param time
   * @returns index or undefined
   */
  getTimeIndex(time: number) {
    if (this.times[0] > time) return undefined
    if (this.times[this.times.length - 1] < time) return undefined
    for (let i = 1; i < this.times.length; i++) {
      if (this.times[i] > time) return i - 1
    }
  }

  /**
   *
   * If the given time falls into this squence, return the ID. Otherwise, return null
   * If not time is given, just return the ID
   *
   * @param time
   */
  getFixedPid(time: number | null = null) {
    if (time !== null) {
      let idx = this.getTimeIndex(time)
      if (idx === undefined) {
        return undefined
      }
    }
    return this.fixedPlateID
  }

  /**
   *
   * Basically just slerp the two quaternions according to the given time
   *
   * @param time
   */
  getQuaternion(time: number): QuatType | undefined {
    //only one time in this sequence, return it if time equals, otherwise return undefined
    if (this.times.length === 1) {
      if (Math.abs(this.times[0] - time) < Number.EPSILON) {
        let v = latLonToCart(
          radians(this.poleLats[0]),
          radians(this.poleLons[0])
        )
        return axisAngleToQuat(v, radians(this.angles[0]))
      }
    } else {
      let timeIdx = this.getTimeIndex(time)
      if (timeIdx !== undefined) {
        let factor =
          (time - this.times[timeIdx]) /
          (this.times[timeIdx + 1] - this.times[timeIdx])
        let lat1 = radians(this.poleLats[timeIdx])
        let lon1 = radians(this.poleLons[timeIdx])
        let angle1 = radians(this.angles[timeIdx])
        let v1 = latLonToCart(lat1, lon1)
        let q1 = axisAngleToQuat(v1, angle1)

        //the time is on the boundary
        if (Math.abs(time - this.times[timeIdx]) < Number.EPSILON) {
          return q1
        }

        let lat2 = radians(this.poleLats[timeIdx + 1])
        let lon2 = radians(this.poleLons[timeIdx + 1])
        let angle2 = radians(this.angles[timeIdx + 1])
        let v2 = latLonToCart(lat2, lon2)
        let q2 = axisAngleToQuat(v2, angle2)

        return quatSlerp(q1, q2, factor)
      }
    }
    return undefined
  }
}

/*
This class contains a rotation Map. Something likes
{
  "101": [
    {"fpid":701, 'times':[1, 2, 3], "plats":[2, 3, 4], "plons":[4, 5, 6], "angles":[7, 8, 9]},
    {"fpid":801, 'times':[1, 2, 3], "plats":[2, 3, 4], "plons":[4, 5, 6], "angles":[7, 8, 9]},
  ],
  "102": [
    {"fpid":701, 'times':[11, 12, 13], "plats":[12, 13, 14], "plons":[14, 15, 16], "angles":[17, 18, 19]},
    {"fpid":801, 'times':[11, 12, 13], "plats":[12, 13, 14], "plons":[14, 15, 16], "angles":[17, 18, 19]},
  ],
  ...
};
The keys are "moving plate IDs". Each "moving plate ID" has one or several rotation sequences, depending on
if this is crossover.
*/
export default class RotationModel {
  private rotationMap: Map<number, RotationSequence[]>
  private modelName: string | undefined
  private modelUrl: string | undefined

  constructor(loadDefaultModel: boolean = true) {
    this.rotationMap = new Map<number, RotationSequence[]>()
    if (loadDefaultModel) {
      this.modelName = 'MERDITH2021'
      this.modelUrl = 'https://gws.gplates.org/rotation/get_rotation_map'
      fetch(this.modelUrl + '/?model=' + this.modelName)
        .then((result) => result.json())
        .then((json_data: any) => {
          RotationModel.loadRotationFromJson(json_data, this)
        })
        .catch(() => {
          console.log('Failed to load rotation map')
        })
    }
  }

  /**
   *
   * @param modelUrl
   * @param modelName
   * @param callback
   */
  public static loadRotationModel(
    modelUrl: string,
    modelName: string,
    callback: Function
  ) {
    let instance = new RotationModel(false)
    instance.setModelName(modelName)
    instance.setModelUrl(modelUrl)

    fetch(modelUrl + '/?model=' + modelName)
      .then((result) => result.json())
      .then((json_data: any) => {
        RotationModel.loadRotationFromJson(json_data, instance)
        callback(instance)
      })
      .catch(() => {
        console.log('Failed to load rotation model.')
      })
  }

  /**
   *
   * @param modelUrl
   * @param modelName
   */
  public static async loadRotationModelAsync(
    modelUrl: string,
    modelName: string
  ) {
    let instance = new RotationModel(false)
    instance.setModelName(modelName)
    instance.setModelUrl(modelUrl)

    let result = await fetch(modelUrl + '/?model=' + modelName)
    let json_data: any = await result.json()
    RotationModel.loadRotationFromJson(json_data, instance)
    return instance
  }

  /**
   *
   * @param json_data
   * @param model
   */
  public static loadRotationFromJson(json_data: any, model: RotationModel) {
    Object.keys(json_data).map((key) => {
      let rs: RotationSequence[] = []
      json_data[key].forEach((v: any) => {
        //console.log(key)
        //console.log(v)
        rs.push(
          new RotationSequence(
            v['fpid'],
            v['times'],
            v['plons'],
            v['plats'],
            v['angles']
          )
        )
      })

      model.insertRotationSequences(parseInt(key), rs)
    })
  }

  /**
   *
   * @param url
   */
  public setModelUrl(url: string) {
    this.modelUrl = url
  }

  /**
   *
   * @returns
   */
  public getModelUrl() {
    return this.modelUrl
  }

  /**
   *
   * @returns
   */
  public getModelName() {
    return this.modelName
  }

  /**
   *
   * @param name
   */
  public setModelName(name: string) {
    this.modelName = name
  }

  /**
   *
   * @returns ture if the model has been loaded, false if not
   */
  public isReady() {
    return this.rotationMap.size !== 0
  }

  /**
   *
   * add a list of RotationSequence into the rotation model
   * The new RotationSequences will be added to key "pid" in the map
   *
   * @param pid
   * @param rs
   */
  insertRotationSequences(pid: number, rs: RotationSequence[]) {
    if (this.rotationMap.has(pid)) {
      this.rotationMap.set(pid, this.rotationMap.get(pid)!.concat(rs))
    } else {
      this.rotationMap.set(pid, rs)
    }
  }

  /**
   *
   * @returns all the plate IDs in this rotation model
   */
  getAllPids() {
    return Array.from(this.rotationMap.keys())
  }

  /**
   *
   * return the rotation relative to the fixed plate ID
   *
   * @param pid
   * @param time
   * @returns
   */
  getRelativeRotation(pid: number, time: number): AxisAngle | undefined {
    if (this.rotationMap.has(pid)) {
      const seqs = this.rotationMap.get(pid)
      for (let i = 0; i < seqs!.length; i++) {
        let rot = seqs![i].getRotation(time)
        if (rot !== undefined) {
          return rot
        }
      }
    } else {
      return undefined
    }
  }

  /**
   *
   * return something like [ 501, 511, 802, 701, 70, 0 ] at given time
   *
   * @param pid
   */
  getPidChain(pid: number, time: number, safeguard: number = 0): number[] {
    if (safeguard > 20) {
      return []
    }
    if (pid === 0) {
      return [0]
    }
    let chain: number[] = [pid]
    if (this.rotationMap.has(pid)) {
      let seqs = this.rotationMap.get(pid)
      for (let i = 0; i < seqs!.length; i++) {
        let fpid = seqs![i].getFixedPid(time)
        if (fpid !== undefined) {
          return chain.concat(this.getPidChain(fpid, time, safeguard + 1))
        }
      }
    }
    return []
  }

  /**
   *
   * return the total rotation quaternion
   *
   * @param pid
   * @param time
   * @returns
   */
  getQuaternion(
    pid: number,
    time: number,
    safeguard: number = 0
  ): QuatType | undefined {
    if (safeguard < 20 && this.rotationMap.has(pid)) {
      const seqs = this.rotationMap.get(pid)
      for (let i = 0; i < seqs!.length; i++) {
        let q1 = seqs![i].getQuaternion(time)
        if (q1 !== undefined) {
          let fpid = seqs![i].getFixedPid()
          if (fpid === 0) {
            return q1
          } else {
            let q2 = this.getQuaternion(fpid!, time, safeguard + 1)
            if (q2 !== undefined) {
              return quatMult(q2, q1)
            } else {
              return q1
            }
          }
        }
      }
    }

    return undefined
  }

  /**
   *
   * return the total rotation axis and angle(in degrees)
   *
   * @param pid
   * @param time
   * @returns
   */
  getRotation(pid: number, time: number): AxisAngle | undefined {
    let q = this.getQuaternion(pid, time)
    if (q !== undefined) {
      let [v, theta] = quatToAxisAngle(q)
      let latLon = cartToLatLon(v)

      return {
        lat: degrees(latLon.lat),
        lon: degrees(latLon.lon),
        angle: degrees(theta),
      }
    }
    return undefined
  }

  /**
   *
   * @param point
   * @param pid
   * @param time
   * @returns new lat lon coordinates in degrees
   */
  public rotate(point: LatLon, pid: number, time: number) {
    let axisAngle = this.getRotation(pid, time)

    if (axisAngle) {
      return rotate(
        point,
        { lat: axisAngle.lat, lon: axisAngle.lon },
        axisAngle.angle
      )
    } else {
      return undefined
    }
  }
}

/**
 *
 * @param point (lat lon coordinates in degrees)
 * @param axis (lat lon coordinates in degrees)
 * @param angle (degree)
 * @returns (lat lon in degrees)
 */
export const rotate = (point: LatLon, axis: LatLon, angle: number): LatLon => {
  let v = latLonToCart(radians(point.lat), radians(point.lon))
  let axis_v = latLonToCart(radians(axis.lat), radians(axis.lon))
  let quat = axisAngleToQuat(axis_v, radians(angle))
  let ret = quatVecMult(quat, v)
  let ret_lat_lon = cartToLatLon(ret)
  return { lat: degrees(ret_lat_lon.lat), lon: degrees(ret_lat_lon.lon) }
}

/**
 * frameOfRefRotation * relativeRotation = totalRotation
 * inverse(frameOfRefRotation) * frameOfRefRotation * relativeRotation = inverse(frameOfRefRotation) * totalRotation
 * relativeRotation = inverse(frameOfRefRotation) * totalRotation
 * @param totalRotation in degrees
 * @param frameOfRefRotation in degrees
 */
export const calRelativeRotation = (
  totalRotation: AxisAngle,
  frameOfRefRotation: AxisAngle
) => {
  let axis_total = latLonToCart(
    radians(totalRotation.lat),
    radians(totalRotation.lon)
  )
  let quat_total = axisAngleToQuat(axis_total, radians(totalRotation.angle))
  //console.log("total");
  //console.log(quat_total);
  let axis_ref = latLonToCart(
    radians(frameOfRefRotation.lat),
    radians(frameOfRefRotation.lon)
  )
  let quat_ref = axisAngleToQuat(axis_ref, radians(frameOfRefRotation.angle))
  //console.log("ref");
  //console.log(quat_ref);

  let inverseRef = quatConjugate(quat_ref)

  let q = quatMult(inverseRef, quat_total)

  //console.log(quatMult(quat_ref, q));

  let [v, theta] = quatToAxisAngle(q)
  let latLon = cartToLatLon(v)

  return {
    lat: degrees(latLon.lat),
    lon: degrees(latLon.lon),
    angle: degrees(theta),
  }
}

/**
 * frameOfRefRotation * relativeRotation = totalRotation
 * frameOfRefRotation * relativeRotation * inverse(relativeRotation) = totalRotation * inverse(relativeRotation)
 * frameOfRefRotation = totalRotation * inverse(relativeRotation)
 * @param totalRotation in degrees
 * @param frameOfRefRotation in degrees
 */
export const calFrameOfRefRotation = (
  totalRotation: AxisAngle,
  relativeRotation: AxisAngle
) => {
  let axis_total = latLonToCart(
    radians(totalRotation.lat),
    radians(totalRotation.lon)
  )
  let quat_total = axisAngleToQuat(axis_total, radians(totalRotation.angle))
  //console.log("total");
  //console.log(quat_total);

  let axis_relative = latLonToCart(
    radians(relativeRotation.lat),
    radians(relativeRotation.lon)
  )
  let quat_relative = axisAngleToQuat(
    axis_relative,
    radians(relativeRotation.angle)
  )
  //console.log("ref");
  //console.log(quat_relative);

  let inverseRelative = quatConjugate(quat_relative)

  let q = quatMult(quat_total, inverseRelative)

  //console.log(quatMult(q, quat_relative));

  let [v, theta] = quatToAxisAngle(q)
  let latLon = cartToLatLon(v)

  return {
    lat: degrees(latLon.lat),
    lon: degrees(latLon.lon),
    angle: degrees(theta),
  }
}
