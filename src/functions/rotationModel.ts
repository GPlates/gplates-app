/*
 *
 */
import assert from 'assert'
import { serverURL } from './settings'
import { LonLatPid } from './types'
import { rotate } from './quaternions'

export let currentModel: RotationModel
export let currentTimeIndex: number

export const setCurrentModel = (c: RotationModel) => {
  currentModel = c
}

export const rotationModels: Map<string, RotationModel> = new Map<
  string,
  RotationModel
>()

export default class RotationModel {
  name: string
  times: number[]
  finiteRotations!: Map<string, any>

  //
  constructor(name: string, times: number[]) {
    this.name = name
    this.times = times
    this.getFiniteRotations()
  }

  //retrieve all Euler pole and angles for all plate ids in a rotation model from the server
  // /rotation/get_euler_pole_and_angle?times=0,50,100&group_by_pid
  getFiniteRotations = () => {
    let times = this.times

    let data = { times: times.join(), model: this.name, group_by_pid: '' }
    fetch(serverURL + '/rotation/get_euler_pole_and_angle', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        this.finiteRotations = new Map(Object.entries(jsonData))
        console.log(this.finiteRotations)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //get Euler pole and angle for a plate id at a time
  getEulerPoleAngle = (pid: number, timeIdx: number) => {
    assert(timeIdx < this.times.length)
    let r = this.finiteRotations.get(String(pid))
    return r ? r[timeIdx] : [0, 90, 0]
  }

  //rotate a location/point according to its plate id to a time
  rotateLonLatPid = (timeIdx: number, lonLatPid: LonLatPid) => {
    let rotations = this.finiteRotations.get(String(lonLatPid.pid))
    let poleAndAngle = rotations ? rotations[timeIdx] : [0, 90, 0]
    console.log(timeIdx, poleAndAngle)
    return rotate(
      { lat: lonLatPid.lat, lon: lonLatPid.lon }, //location
      { lat: poleAndAngle[1], lon: poleAndAngle[0] }, //pole
      poleAndAngle[2] //angle
    )
  }

  //
  getTimeIndex = (time: number) => {
    return this.times.indexOf(time)
  }
}
