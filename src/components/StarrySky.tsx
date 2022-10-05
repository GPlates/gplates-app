import React, { useEffect } from 'react'
import assert from 'assert'
import { useRecoilValue } from 'recoil'
import { backgroundIsStarry, backgroundIsEnabled } from '../functions/atoms'

let maxNumStars = Math.log2(window.innerWidth * window.innerHeight) * 10
let stars: Star[] = []

let ctx: CanvasRenderingContext2D | null
let canvas: HTMLCanvasElement

let ctxStar: CanvasRenderingContext2D | null
let canvasStar: HTMLCanvasElement

//return a randon integer between max and min
//max and min must be integer
//max must be greater than min
const randomInt = (min: number, max: number) => {
  assert(max > min)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

class Star {
  private readonly directionX: number
  private readonly directionY: number
  private readonly radius: number
  private posX: number
  private posY: number
  private readonly speed: number
  private alpha: number

  constructor() {
    this.directionX = randomInt(-1, 1)
    this.directionY = randomInt(-1, 1)
    this.radius = randomInt(5, 30)
    this.posX = randomInt(0, window.innerWidth)
    this.posY = randomInt(0, window.innerHeight)
    this.speed = randomInt(1, 500) / 10000
    this.alpha = randomInt(2, 10) / 10
  }

  //
  draw(): void {
    let w = window.innerWidth
    let h = window.innerHeight
    this.posX = this.speed * this.directionX + this.posX
    this.posY = this.speed * this.directionY + this.posY

    if (this.posX > w + this.radius) {
      this.posX = -this.radius
    } else if (this.posX < -this.radius) {
      this.posX = w + this.radius
    }
    if (this.posY > h + this.radius) {
      this.posY = -this.radius
    } else if (this.posY < -this.radius) {
      this.posY = h + this.radius
    }
    let twinkle = randomInt(0, 200)
    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05
    }
    assert(ctx)
    ctx.globalAlpha = this.alpha
    ctx.drawImage(canvasStar, this.posX, this.posY, this.radius, this.radius)
  }
}

interface ContainerProps {}

export const StarrySky: React.FC<ContainerProps> = () => {
  const isStarryBackgroundEnable = useRecoilValue(backgroundIsStarry)
  const isBackgroundSettingEnable = useRecoilValue(backgroundIsEnabled)

  let showStarsFlag = isBackgroundSettingEnable && isStarryBackgroundEnable
  let hue = 217

  useEffect(() => {
    //prepare the window canvas
    canvas = document.getElementById('starry-sky') as HTMLCanvasElement
    assert(canvas != null)
    ctx = canvas.getContext('2d')
    assert(ctx != null)
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    //prepare star canvas
    canvasStar = document.createElement('canvas')
    assert(canvasStar != null)
    ctxStar = canvasStar.getContext('2d')
    assert(ctxStar != null)
    canvasStar.width = 100
    canvasStar.height = 100
    var half = canvasStar.width / 2,
      gradient2 = ctxStar.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(0.025, '#fff')
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
    gradient2.addColorStop(1, 'transparent')

    ctxStar.fillStyle = gradient2
    ctxStar.beginPath()
    ctxStar.arc(half, half, half, 0, Math.PI * 2)
    ctxStar.fill()

    for (let i = 0; i < maxNumStars; i++) {
      stars.push(new Star())
    }
  }, [])

  //
  //
  useEffect(() => {
    if (!showStarsFlag) return () => {} // if not enabled, do nothing and return

    let stop = !showStarsFlag

    // function to start the animation
    function animation() {
      //clear the previous stars
      assert(ctx != null)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.8
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = 'lighter'

      //draw new stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].draw()
      }

      if (!stop) {
        window.requestAnimationFrame(animation)
      }
    } // end of function animation()

    animation() // start the animation

    // clean up, stop the animation
    // important!!!
    return () => {
      stop = true
    }
  }, [isStarryBackgroundEnable, isBackgroundSettingEnable]) //end of useEffect

  return (
    <canvas
      id="starry-sky"
      style={{
        position: 'absolute',
        zIndex: 0,
        display: showStarsFlag ? '' : 'none',
      }}
    />
  )
}
