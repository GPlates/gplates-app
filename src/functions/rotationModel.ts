import assert from 'assert'
import { RotationModel as RotationModelEx, rotate } from 'gplates'
import { serverURL } from './settings'
import { LonLatPid } from './types'

export let currentModel: RotationModel | undefined
export let currentTimeIndex: number

export const setCurrentModel = (c: RotationModel | undefined) => {
  currentModel = c
}

export const rotationModels: Map<string, RotationModel> = new Map<
  string,
  RotationModel
>()

/**
 * Class to do the finate rotation on globe
 * This class contains some deprecated code. The new implementation is inhttps://www.npmjs.com/package/gplates
 * finiteRotations(deprecated!!): The key is plate id string. The value is a list of pole-angles,
 * such as [[0, 90, 0], [-80.0171, 51.5165, -0.312], [-80.0171, 51.5165, -0.624] ], for each time in this.times.
 */
export default class RotationModel {
  name: string
  times: number[]
  finiteRotations!: Map<string, any>
  newRotationModelImpl: RotationModelEx | undefined

  /**
   *
   * @param name
   * @param times
   */
  constructor(name: string, times: number[]) {
    this.name = name
    this.times = times

    this.finiteRotations = new Map<string, any>()
    RotationModelEx.loadRotationModel(
      serverURL + '/rotation/get_rotation_map',
      name,
      (model: RotationModelEx) => {
        this.newRotationModelImpl = model
      }
    )
  }

  /**
   * rotate a location to a given time
   *
   * @param lonLatPid
   * @param time
   * @returns
   */
  rotate(lonLatPid: LonLatPid, time: number) {
    if (this.newRotationModelImpl === undefined) {
      console.log('newRotationModelImpl is not ready yet!')
      return undefined
    }
    return this.newRotationModelImpl.rotate(
      { lat: lonLatPid.lat, lon: lonLatPid.lon },
      lonLatPid.pid,
      time
    )
  }

  /**
   * deprecated!!! Big performance impact. Do not use!
   * retrieve all Euler pole and angles for all plate ids in a rotation model from the server
   * "/rotation/get_euler_pole_and_angle?times=0,50,100&group_by_pid&model=MULLER2019"
   */
  fetchAllFiniteRotations = () => {
    let times = this.times

    let data = { times: times.join(), model: this.name, group_by_pid: '' }
    fetch(serverURL + '/rotation/get_euler_pole_and_angle', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((jsonData) => {
        this.finiteRotations = new Map(Object.entries(jsonData))
        //console.log(this.finiteRotations)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  /**
   * deprecated!!
   * retrieve all Euler pole and angles for given plate ids in a rotation model from the server
   * "/rotation/get_euler_pole_and_angle?pids=701,801&group_by_pid&model=MULLER2019"
   * @param pids
   * @returns
   */
  fetchFiniteRotations = async (pids: string[]) => {
    let times = this.times

    let pids_: string[] = []
    pids.forEach((pid: string) => {
      if (!this.finiteRotations.has(pid)) {
        pids_.push(pid)
      }
    })
    if (pids_.length === 0) {
      //console.log('DEBUG: no need to fetch data from server!')
      return
    }

    let data = {
      times: times.join(),
      model: this.name,
      group_by_pid: '',
      pids: pids_.join(),
    }
    try {
      let response = await fetch(
        serverURL + '/rotation/get_euler_pole_and_angle',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      )
      let jsonData = await response.json()

      this.finiteRotations = new Map([
        ...Array.from(this.finiteRotations.entries()),
        ...Array.from(Object.entries(jsonData)),
      ])

      //console.log(this.finiteRotations)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * get Euler pole and angle for a plate id at a time
   *
   * @param pid
   * @param timeIdx
   * @returns
   */
  getEulerPoleAngle = (pid: number, timeIdx: number) => {
    assert(timeIdx < this.times.length)
    let r = this.finiteRotations.get(String(pid))
    return r ? r[timeIdx] : [0, 90, 0]
  }

  /**
   * deprecated!!!
   * rotate a location/point according to its plate id to a time
   *
   * @param timeIdx
   * @param lonLatPid
   * @returns
   */
  rotateLonLatPid = (timeIdx: number, lonLatPid: LonLatPid) => {
    let rotations = this.finiteRotations.get(String(lonLatPid.pid))
    let poleAndAngle = rotations ? rotations[timeIdx] : [0, 90, 0]
    if (!poleAndAngle) {
      console.log('Invalid poleAndAngle: ')
      console.log(timeIdx, poleAndAngle)
    }
    //console.log(timeIdx, poleAndAngle)
    return rotate(
      { lat: lonLatPid.lat, lon: lonLatPid.lon }, //location
      { lat: poleAndAngle[1], lon: poleAndAngle[0] }, //pole
      poleAndAngle[2] //angle
    )
  }

  /**
   *
   * @param time
   * @returns
   */
  getTimeIndex = (time: number) => {
    return this.times.indexOf(time)
  }

  /**
   * return the nearest valid time
   * assume this.times is sorted in ascending order
   *
   * @param time
   * @returns
   */
  getNearestTime = (time: number) => {
    let lastOne = -1
    for (let i = 0; i < this.times.length; i++) {
      if (this.times[i] < time) {
        lastOne = this.times[i]
        continue //not found yet, go to next one
      } else {
        if (lastOne < 0) {
          return this.times[i]
        } else {
          return Math.abs(this.times[i] - time) > Math.abs(time - lastOne)
            ? lastOne
            : this.times[i]
        }
      }
    }
    return this.times[-1] //the last one is the nearest
  }
}
