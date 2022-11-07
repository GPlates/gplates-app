import { SingleTileImageryProvider, Viewer } from 'cesium'
import { CachingService } from './cache'
import { SetterOrUpdater } from 'recoil'
import rasterMaps from './rasterMaps'
import { getEnabledLayers, vectorLayers } from './vectorLayers'
import { buildAnimationURL } from './util'
import { currentModel } from './rotationModel'
import { drawLayers } from './cesiumViewer'
import { raiseGraticuleLayerToTop } from './graticule'

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
    public currentRasterMapIndex: number
  ) {
    this.from = range.lower
    this.to = range.upper
  }

  //
  drawFrame = async (url: string) => {
    animateStartTime = Date.now()
    try {
      const dataURL: string = await this.cachingService?.getCachedRequest(
        url.replaceAll('{{time}}', String(animateFrame))
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
          this.viewer.imageryLayers.addImageryProvider(provider)
          raiseGraticuleLayerToTop()
        }
      }
      //reconstruct locations inserted by user
      //await reconstructPresentDayLocations(animateFrame)
    } catch (err) {
      console.log(err)
      return
    }
    // Update age once frame is printed so age and frame display correspond
    // but not whilst we're dragging the slider (because the knob moves unpredictably)
    if (!dragging) {
      this.setAge(animateFrame)
    }
    if (this.viewer.imageryLayers.length > 8) {
      this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0), true)
    }

    if (animateNext) {
      this.scheduleFrame(url, true)
    }
  }

  // TODO: Cache next image before timeout expires to improve cold animation performance?
  scheduleFrame = (url: string, nextFrame = false) => {
    const timeToNext = animateStartTime - Date.now() + 1000 / this.fps
    //console.log(timeToNext)
    animateTimeout = setTimeout(() => {
      if (nextFrame) {
        animateFrame = this.getNextFrameNumber()
      }
      return this.drawFrame(url)
    }, Math.max(timeToNext, 0)) //due to the event loop, the timeToNext cannot be guaranteed.
  }

  //
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
    animateFrame = Math.min(
      animateFrame,
      rasterMaps[this.currentRasterMapIndex].startTime
    )
    animateFrame = Math.max(
      animateFrame,
      rasterMaps[this.currentRasterMapIndex].endTime
    )

    return animateFrame
  }

  //return the next valid age
  getNextFrameNumber = () => {
    //if loop is true and frame has reached the end, go to the start
    //otherwise, stay at the end
    if (Math.abs(animateFrame - this.to) < Number.EPSILON) {
      return this.loop ? this.from : this.to
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
    // Pause once we reach the boundary
    if (nextNumber >= big || nextNumber <= small) {
      this.setPlaying(false)
    }
    return currentModel.getNearestTime(nextNumber)
  }

  //return the previous valid age
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
    return currentModel.getNearestTime(prevNumber)
  }

  //
  onAgeSliderChange = (value: number) => {
    if (!this.playing) {
      animateFrame = value
      this.drawTiles()
    }
  }

  //
  resetPlayHead = () => {
    this.setPlaying(false)
    animateFrame = this.range.lower
    this.setAge(animateFrame)
    this.drawTiles()
  }

  //
  movePlayHead = (value: number) => {
    this.setPlaying(false)
    animateFrame = Math.min(
      Math.max(
        animateFrame + value,
        rasterMaps[this.currentRasterMapIndex].endTime
      ),
      rasterMaps[this.currentRasterMapIndex].startTime
    )
    this.setAge(animateFrame)
    this.drawTiles()
  }

  //
  moveNext = () => {
    this.setPlaying(false)
    animateFrame = this.getNextFrameNumber()
    this.setAge(animateFrame)
    this.drawTiles()
  }

  //
  movePrev = () => {
    this.setPlaying(false)
    animateFrame = this.getPrevFrameNumber()
    this.setAge(animateFrame)
    this.drawTiles()
  }

  //
  setDragging = (value: boolean) => {
    dragging = value
  }

  //
  setPlaying = (value: boolean) => {
    this._setPlaying(value)
    animateNext = value
    if (value) {
      animateFrame = this.getNextFrameNumber()
      this.scheduleFrame(this.getCurrentRasterAnimationURL())
    } else {
      clearTimeout(animateTimeout)
      this.drawTiles()
    }
  }

  //
  // return the low-resolution map url for the current selected raster
  // TODO: do the similar thing for vector layers(overlays)
  //
  getCurrentRasterAnimationURL = () => {
    let overlays: string[] = []
    let enabledLayers = getEnabledLayers(this.currentRasterMapIndex)
    enabledLayers.forEach((layer) => {
      if (layer !== 'cities') {
        console.log(vectorLayers.get(currentModel.name)[layer])
        overlays.push(vectorLayers.get(currentModel.name)[layer].layerName)
      }
    })
    return buildAnimationURL(
      rasterMaps[this.currentRasterMapIndex].wmsUrl,
      rasterMaps[this.currentRasterMapIndex].layerName,
      overlays
    )
  }

  //
  drawTiles = () => {
    drawLayers(animateFrame)
  }
}
