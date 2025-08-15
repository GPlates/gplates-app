import { SingleTileImageryProvider, Viewer, ImageryLayer } from 'cesium'
import { CachingService } from './cache'
import { SetterOrUpdater } from 'recoil'
import { getRasterByID } from './rasterMaps'
import { getEnabledLayers, vectorLayers } from './vectorLayers'
import { getLowResImageUrlForGeosrv } from './util'
import { currentModel } from './rotationModel'
import {
  drawLayers,
  removeCurrentImageryLayers,
  setCurrentSingleTileImageryLayer,
  getCurrentSingleTileImageryLayer,
} from './cesiumViewer'
import { raiseGraticuleLayerToTop } from './graticule'
import { RasterGroup } from './types'

let animateFrame = 0 //current age
let animateNext = false
let animateStartTime = 0
let animateTimeout: NodeJS.Timeout
let dragging = false

export class AnimationService {
  private from: number
  private to: number
  constructor(
    public cachingService: CachingService,
    public setAge: SetterOrUpdater<number>,
    public exact: boolean,
    public fps: number,
    public increment: number,
    public loop: boolean,
    public playing: boolean,
    public _setPlaying: SetterOrUpdater<boolean>,
    public range: { lower: number; upper: number },
    public viewer: Viewer,
    public currentRasterID: string,
    public rasterGroup: RasterGroup,
  ) {
    this.from = range.lower
    this.to = range.upper
  }

  /**
   * remove imagery layer after 2 seconds delay
   *
   * @param layer
   */
  delayRemoveSingleTileImageryLayer = (layer: ImageryLayer) => {
    setTimeout(() => {
      //console.log('remove SingleTileImageryProvider')
      if (layer) {
        this.viewer.imageryLayers.remove(layer, true)
      }
    }, 2000)
  }

  /**
   *
   * @param url - the url of the geoserver wms for this frame
   * @returns
   */
  drawFrame = async (url: string) => {
    animateStartTime = Date.now()
    try {
      const dataURL: string = await this.cachingService?.getCachedRequest(
        url.replaceAll('{{time}}', String(animateFrame)),
      )
      if (!dataURL) {
        return this.setPlaying(false)
      }
      //only do this when the dataURL is valid
      if (dataURL.length > 0) {
        const provider = new SingleTileImageryProvider({
          url: dataURL,
        })

        // Disallow old frames from being printed when manually changing age
        if (animateNext) {
          let newLayer = this.viewer.imageryLayers.addImageryProvider(provider)
          //console.log('add SingleTileImageryProvider')

          //delay remove the old layer
          let currentSingleTileImageryLayer = getCurrentSingleTileImageryLayer()
          if (currentSingleTileImageryLayer) {
            this.delayRemoveSingleTileImageryLayer(
              currentSingleTileImageryLayer,
            )
          }
          setCurrentSingleTileImageryLayer(newLayer)

          raiseGraticuleLayerToTop()
        }
      }
    } catch (err) {
      console.log(err)
      return
    }
    // Update age once frame is printed so age and frame display correspond
    // but not whilst we're dragging the slider (because the knob moves unpredictably)
    if (!dragging) {
      this.setAge(animateFrame)
    }

    /*
    if (this.viewer.imageryLayers.length > 8) {
      this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0), true)
    }*/

    if (animateNext) {
      this.scheduleFrame(url, true)
    }
  }

  /**
   * TODO: Cache next image before timeout expires to improve cold animation performance?
   */
  scheduleFrame = (url: string, nextFrame = false) => {
    const timeToNext = animateStartTime - Date.now() + 1000 / this.fps
    //console.log(timeToNext)
    animateTimeout = setTimeout(
      () => {
        if (nextFrame) {
          let nextFrameNumber = this.getNextFrameNumber()
          //if the next number is the same as the current number
          //it means the animation reached end
          //so, pause the animation and return
          if (Math.abs(nextFrameNumber - animateFrame) < Number.EPSILON) {
            this.setPlaying(false)
            return
          }

          animateFrame = nextFrameNumber
        }
        return this.drawFrame(url)
      },
      Math.max(timeToNext, 0),
    ) //due to the event loop, the timeToNext cannot be guaranteed.
  }

  /**
   *
   * @returns
   */
  nextFrameNumber = () => {
    const reversed = this.range.lower > this.range.upper

    if (!reversed && animateFrame + this.increment <= this.range.upper) {
      animateFrame += this.increment
    } else if (reversed && animateFrame - this.increment >= this.range.upper) {
      animateFrame -= this.increment
    } else if (
      ((!reversed && animateFrame < this.range.upper) ||
        (reversed && animateFrame > this.range.upper)) &&
      this.exact
    ) {
      animateFrame = this.range.upper
    } else if (this.loop) {
      animateFrame = this.range.lower
    } else {
      this.setPlaying(false)
    }

    //make sure the animateFrame(age) does not go out of valid range
    let raster = getRasterByID(this.currentRasterID)
    if (raster) {
      animateFrame = Math.min(animateFrame, raster.startTime)
      animateFrame = Math.max(animateFrame, raster.endTime)
    }

    return animateFrame
  }

  /**
   * return the next valid age
   *
   * @param forceLoop - get next age from start, ignore "loop" setting
   * @returns
   */
  getNextFrameNumber = (forceLoop: boolean = false) => {
    //if loop is true and frame has reached the end, go to the start
    //otherwise, stay at the end
    if (Math.abs(animateFrame - this.to) < Number.EPSILON) {
      if (this.loop || forceLoop) {
        return this.from
      } else {
        return this.to
      }
    }

    let big = Math.max(this.from, this.to)
    let small = Math.min(this.from, this.to)
    let nextNumber =
      this.from > this.to
        ? animateFrame - this.increment
        : animateFrame + this.increment

    //when the next number reached boundary
    //either use the boundary value or stop at where it was
    if (nextNumber > big) {
      nextNumber = this.loop || this.exact ? big : animateFrame
    }
    if (nextNumber < small) {
      nextNumber = this.loop || this.exact ? small : animateFrame
    }

    return currentModel ? currentModel.getNearestTime(nextNumber) : 0
  }

  /**
   * return the previous valid age
   *
   * @returns
   */
  getPrevFrameNumber = () => {
    //if loop is true and frame has reached the start, go to the end
    //otherwise, stay at the end
    if (Math.abs(animateFrame - this.from) < Number.EPSILON) {
      return this.loop ? this.to : this.from
    }

    let big = Math.max(this.from, this.to)
    let small = Math.min(this.from, this.to)
    let prevNumber =
      this.from > this.to
        ? animateFrame + this.increment
        : animateFrame - this.increment

    //when the previous number reached boundary
    //either use the boundary value or stop at where it was
    if (prevNumber > big) {
      prevNumber = this.loop || this.exact ? big : animateFrame
    }
    if (prevNumber < small) {
      prevNumber = this.loop || this.exact ? small : animateFrame
    }
    return currentModel ? currentModel.getNearestTime(prevNumber) : 0
  }

  /**
   *
   * @param value
   */
  onAgeSliderChange = (value: number) => {
    if (!this.playing) {
      animateFrame = value
      let raster = getRasterByID(this.currentRasterID)
      if (raster) {
        drawLayers(animateFrame, raster)
      }
    }
  }

  /**
   * Move to the beginning of the animation
   */
  resetPlayHead = () => {
    //if animation is playing, do nothing
    if (this.playing) {
      return
    }

    animateFrame = this.range.lower
    this.setAge(animateFrame)
    let raster = getRasterByID(this.currentRasterID)
    if (raster) {
      drawLayers(animateFrame, raster)
    }
  }

  /**
   * move to next frame
   */
  moveNext = () => {
    //if animation is playing, do nothing
    if (this.playing) {
      return
    }

    animateFrame = this.getNextFrameNumber(true)
    this.setAge(animateFrame)
    let raster = getRasterByID(this.currentRasterID)
    if (raster) {
      drawLayers(animateFrame, raster)
    }
  }

  /**
   * move to previous frame
   */
  movePrev = () => {
    //if animation is playing, do nothing
    if (this.playing) {
      return
    }
    animateFrame = this.getPrevFrameNumber()
    this.setAge(animateFrame)
    let raster = getRasterByID(this.currentRasterID)
    if (raster) {
      drawLayers(animateFrame, raster)
    }
  }

  /**
   *
   * @param value - True: dragging; False: not dragging
   */
  setDragging = (value: boolean) => {
    dragging = value
  }

  /**
   *
   * @param value - True: play; False: stop
   */
  setPlaying = (value: boolean) => {
    if (this.playing == value) {
      return
    }

    //delay remove the old layer
    let currentSingleTileImageryLayer = getCurrentSingleTileImageryLayer()
    if (currentSingleTileImageryLayer) {
      this.delayRemoveSingleTileImageryLayer(currentSingleTileImageryLayer)
    }
    setCurrentSingleTileImageryLayer(null)

    this._setPlaying(value)

    animateNext = value
    if (value) {
      animateFrame = this.getNextFrameNumber(true)
      let url = this.getLowResImageUrl()
      if (url) this.scheduleFrame(url)
      removeCurrentImageryLayers()
    } else {
      clearTimeout(animateTimeout)

      //when animation stopped, draw the tiled layers for higher resolution images
      let raster = getRasterByID(this.currentRasterID)
      if (raster) {
        drawLayers(animateFrame, raster)
      }
    }
  }

  /**
   * return the low-resolution map url of the current selected raster for animation
   * The {{time}} will be replaced by real value of time in function drawFrame()
   *
   * @returns
   */
  getLowResImageUrl = () => {
    // get overlays
    let overlays: string[] = []
    let layerIDs: string[] = []
    let enabledLayers: string[] = []

    enabledLayers = getEnabledLayers(this.currentRasterID).sort()

    let raster = getRasterByID(this.currentRasterID)
    if (raster) {
      enabledLayers.forEach((layer) => {
        if (layer !== 'cities') {
          if (!raster) return
          //console.log(vectorLayers.get(raster.id))
          overlays.push(vectorLayers.get(raster.id)[layer].layerName)
          layerIDs.push(layer)
        }
      })

      //build the URL
      let url = raster.paleoMapUrl
      if (url) {
        // URL for gplates web service
        layerIDs.forEach((id) => {
          url = url + ',' + id
        })
        url += '&time={{time}}&model=' + currentModel?.name + '&bg=211,211,211'
        //console.log(url)
        return url
      } else {
        //URL for geosever
        return getLowResImageUrlForGeosrv(
          raster.wmsUrl,
          raster.layerName,
          overlays,
        )
      }
    }
  }
}
/**
 *
 * @param age
 */
export const setAnimationFrame = (age: number, currentRasterID: string) => {
  animateFrame = age
  let raster = getRasterByID(currentRasterID)
  if (raster) {
    drawLayers(animateFrame, raster)
  }
}
