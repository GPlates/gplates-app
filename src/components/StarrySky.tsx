import React, { useEffect } from 'react'
import assert from 'assert'
import { useRecoilState } from 'recoil'
import { backgroundIsStarry } from '../functions/atoms'

let w = window.innerWidth
let h = window.innerHeight
let maxStars = Math.log2(w * h) * 10

function random(min: number, max: any = null) {
  if (max == null) {
    max = min
    min = 0
  }

  if (min > max) {
    var hold = max
    max = min
    min = hold
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

function maxOrbit(x: number, y: number) {
  var max = Math.max(x, y),
    diameter = Math.round(Math.sqrt(max * max + max * max))
  return diameter / 2
}

class Star {
  static count = 0
  static stars: Star[] = []
  static ctx: CanvasRenderingContext2D
  static canvas2: HTMLCanvasElement
  static maxStars: number
  directionX
  directionY
  radius
  posX
  posY
  timePassed
  speed
  alpha
  key

  constructor() {
    let w = window.innerWidth
    let h = window.innerHeight
    this.directionX = random(-1, 1)
    this.directionY = random(-1, 1)
    this.radius = random(5, 30)
    this.posX = random(0, w)
    this.posY = random(0, h)
    this.timePassed = random(0, maxStars)
    this.speed = random(1, 500) / 10000
    this.alpha = random(2, 10) / 10

    if (Star.count < Star.maxStars) {
      this.key = Star.count
      Star.count++
      Star.stars.push(this)
    }
  }

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
    let twinkle = random(200)
    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05
    }
    Star.ctx.globalAlpha = this.alpha
    Star.ctx.drawImage(
      Star.canvas2,
      this.posX,
      this.posY,
      this.radius,
      this.radius
    )
    this.timePassed += this.speed
  }
}

interface ContainerProps {}

export const StarrySky: React.FC<ContainerProps> = () => {
  Star.maxStars = maxStars

  const [isStarryBackgroundEnable, _] = useRecoilState(backgroundIsStarry)

  useEffect(() => {
    if (!isStarryBackgroundEnable) return () => {} // if not enabled, do nothing and return

    let canvas: HTMLCanvasElement = document.getElementById(
      'starry-sky'
    ) as HTMLCanvasElement
    assert(canvas != null)
    let ctx = canvas.getContext('2d')
    assert(ctx != null)
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.height = h
    canvas.width = w

    let hue = 217

    let canvas2 = document.createElement('canvas')
    let ctx2 = canvas2.getContext('2d')
    assert(ctx2 != null)
    canvas2.width = 100
    canvas2.height = 100
    var half = canvas2.width / 2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(0.025, '#fff')
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
    gradient2.addColorStop(1, 'transparent')

    ctx2.fillStyle = gradient2
    ctx2.beginPath()
    ctx2.arc(half, half, half, 0, Math.PI * 2)
    ctx2.fill()

    Star.ctx = ctx
    Star.canvas2 = canvas2
    for (let i = 0; i < maxStars; i++) {
      new Star()
    }

    let stop = !isStarryBackgroundEnable

    // function to start the animation
    function animation() {
      assert(ctx != null)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.8
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      for (let i = 1, l = Star.stars.length; i < l; i++) {
        Star.stars[i].draw()
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
  }, [isStarryBackgroundEnable]) //end of useEffect

  return (
    <canvas
      id="starry-sky"
      style={{
        position: 'absolute',
        zIndex: 0,
        display: isStarryBackgroundEnable ? '' : 'none',
      }}
    />
  )
}
