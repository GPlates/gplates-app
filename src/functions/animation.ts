import { SingleTileImageryProvider, Viewer } from 'cesium'
import { CachingService } from './cache'
import { Dispatch, SetStateAction } from 'react'

let animateFrame = 0
let animateNext = false
let animateStartTime = 0
let animateTimeout: NodeJS.Timeout
let dragging = false

export class AnimationService {
  constructor(
    public cachingService: CachingService,
    public viewer: Viewer,
    public age: number,
    public setAge: Dispatch<SetStateAction<number>>,
    public exact: boolean,
    public setExact: Dispatch<SetStateAction<boolean>>,
    public fps: number,
    public increment: number,
    public limitLower: number,
    public limitUpper: number,
    public loop: boolean,
    public setLoop: Dispatch<SetStateAction<boolean>>,
    public playing: boolean,
    public _setPlaying: Dispatch<SetStateAction<boolean>>,
    public range: { lower: number; upper: number },
    public setRange: Dispatch<SetStateAction<{ lower: number; upper: number }>>,
    public URL: string
  ) {}

  drawFrame = async (url: string, force = false) => {
    animateStartTime = Date.now()

    try {
      const provider = new SingleTileImageryProvider({
        url: await this.cachingService?.getCachedRequest(
          url.replace('{count}', String(animateFrame))
        ),
      })
      // Disallow old frames from being printed when manually changing age
      if (animateNext || force) {
        this.viewer.imageryLayers.addImageryProvider(provider)
      }
    } catch (err) {
      return
    }
    // Update age once frame is printed so age and frame display correspond
    // but not whilst we're dragging the slider (because the knob moves unpredictably)
    if (!dragging) {
      this.setAge(animateFrame)
    }
    if (this.viewer.imageryLayers.length > 4) {
      this.viewer.imageryLayers.remove(this.viewer.imageryLayers.get(0), true)
    }

    if (animateNext) {
      this.scheduleFrame(url, true)
    }
  }

  // TODO: Cache next image before timeout expires to improve cold animation performance?
  scheduleFrame = (url: string, nextFrame = false) => {
    const timeToNext = animateStartTime - Date.now() + 1000 / this.fps
    animateTimeout = setTimeout(() => {
      if (nextFrame) {
        this.nextFrameNumber()
      }
      this.drawFrame(url)
    }, Math.max(timeToNext, 0))
  }

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

    return animateFrame
  }

  onAgeSliderChange = (value: number) => {
    animateFrame = value
    this.drawFrame(this.URL, true)
  }

  resetPlayHead = () => {
    this.setPlaying(false)
    animateFrame = this.range.lower
    this.drawFrame(this.URL, true)
  }

  movePlayHead = (value: number) => {
    this.setPlaying(false)
    animateFrame = Math.min(
      Math.max(animateFrame + value, this.limitLower),
      this.limitUpper
    )
    this.drawFrame(this.URL, true)
  }

  setDragging = (value: boolean) => {
    dragging = value
  }

  setPlaying = (value: boolean) => {
    this._setPlaying(value)
    animateNext = value
    if (value) {
      const reversed = this.range.lower > this.range.upper

      // Reset play head if we're outside the range
      if (animateFrame === this.range.upper) {
        animateFrame = this.range.lower
      } else if (
        !reversed &&
        animateFrame + this.increment > this.range.upper &&
        this.exact
      ) {
        animateFrame = this.range.upper
      } else if (
        reversed &&
        animateFrame - this.increment < this.range.upper &&
        this.exact
      ) {
        animateFrame = this.range.lower
      } else if (
        (!reversed &&
          (animateFrame + this.increment < this.range.lower ||
            animateFrame + this.increment > this.range.upper)) ||
        (reversed &&
          (animateFrame - this.increment > this.range.lower ||
            animateFrame - this.increment < this.range.upper))
      ) {
        animateFrame = this.range.lower
      }

      this.scheduleFrame(this.URL)
    } else {
      clearTimeout(animateTimeout)
    }
  }
}
