import React, { useEffect } from 'react'
import assert from 'assert'

let maxStars = 100;

function random(min: number, max: any = null) {
  if (max == null) {
    max = min;
    min = 0;
  }

  if (min > max) {
    var hold = max;
    max = min;
    min = hold;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function maxOrbit(x: number, y: number) {
  var max = Math.max(x, y),
    diameter = Math.round(Math.sqrt(max * max + max * max));
  return diameter / 2;
}

class Star {
  static count = 0;
  static stars:Star[] = []
  static ctx: CanvasRenderingContext2D
  static canvas2: HTMLCanvasElement
  static maxStars:number
  orbitRadius
  radius
  orbitX
  orbitY
  timePassed
  speed
  alpha

  constructor() {
    let w = window.innerWidth
    let h = window.innerHeight
    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 500000;
    // this.speed = 0;
    this.alpha = random(2, 10) / 10;

    if (Star.count < Star.maxStars){
      Star.count++;
      Star.stars.push(this);
    }

  }

  draw():void {
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
      y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
      twinkle = random(200);

    if (twinkle === 1 && this.alpha > 0) {
      this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
      this.alpha += 0.05;
    }
    Star.ctx.globalAlpha = this.alpha;
    Star.ctx.drawImage(Star.canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
    this.timePassed += this.speed;
  }

}

interface ContainerProps {

}

export const StarrySky: React.FC<ContainerProps> = () => {
  Star.maxStars = maxStars
  useEffect(() => {
    let canvas:HTMLCanvasElement = document.getElementById('starrySky') as HTMLCanvasElement
    assert (canvas != null);
    let ctx = canvas.getContext('2d')
    assert (ctx != null);
    let w = window.outerWidth
    let h = window.outerHeight
    canvas.height = h
    canvas.width = w

    let hue = 217


    let canvas2 = document.createElement('canvas')
    let ctx2 = canvas2.getContext('2d');
    assert (ctx2 != null);
    canvas2.width = 100;
    canvas2.height = 100;
    var half = canvas2.width / 2,
      gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#fff');
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

// End cache
    Star.ctx = ctx
    Star.canvas2 = canvas2
    for (var i = 0; i < maxStars; i++) {
      new Star();
    }

    function animation() {
      assert(ctx != null)
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1, l = Star.stars.length; i < l; i++) {
        Star.stars[i].draw();
      }

      // try to avoid setTimeout collision with aging animation
      setTimeout(() => {
        animation()
      }, 400)

      // window.requestAnimationFrame(animation);
    }

    animation();
  })

  return (
      <canvas id="starrySky" style={{position: 'absolute', zIndex: 0}}></canvas>
  )
}