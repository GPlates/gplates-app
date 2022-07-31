import * as Cesium from 'cesium'
import { Viewer } from 'cesium'
import html2canvas from 'html2canvas'
import assert from 'assert'
import { timeout } from 'workbox-core/_private'

const getCesiumScreenShotBlob = async (viewer: Viewer) => {
  let result = null
  const scene = viewer.scene
  const screenshot = function (scene: Cesium.Scene) {
    const canvas = scene.canvas
    canvas.toBlob(function (blob) {
      assert(blob != null)
      result = blob
    })
    scene.postRender.removeEventListener(screenshot)
  }
  scene.postRender.addEventListener(screenshot)
  viewer.render()

  while (result === null) {
    await timeout(500)
  }

  return result
}

const coincideTwoPic = async (
  pic1: string,
  pic1Config = {},
  pic2: string = '',
  pic2Config = {}
) => {
  let canvas = document.createElement('canvas')
  let width = window.screen.width
  let height = window.screen.height

  canvas.width = width
  canvas.height = height

  let context = canvas.getContext('2d')
  assert(context != null)
  context.rect(0, 0, width, height)

  let bgImg = new Image()
  bgImg.src = pic1
  bgImg.crossOrigin = 'Anonymous'
  while (!bgImg.complete) {
    await timeout(500)
  }
  let config = {
    dx: 0,
    dy: 0,
    dw: canvas.width,
    dh: canvas.height,
    ...pic1Config,
  }
  context.drawImage(bgImg, config.dx, config.dy, config.dw, config.dh)

  let img = new Image()
  img.src = pic2
  img.crossOrigin = 'Anonymous'
  while (!img.complete) {
    await timeout(500)
  }
  config = { dx: 0, dy: 0, dw: canvas.width, dh: canvas.height, ...pic2Config }
  context.drawImage(img, config.dx, config.dy, config.dw, config.dh)

  return canvas.toDataURL('image/png')
}

// for test purpose
const downloadBlob = (blob: Blob) => {
  let link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'test.png'
  link.click()
}

const getScreenShot = async (
  viewer: Viewer,
  isStarryBackgroundEnable: boolean
) => {
  let cesiumBlob = await getCesiumScreenShotBlob(viewer)
  let cesiumDataUrl = URL.createObjectURL(cesiumBlob)

  const starrySkyCanvas = document.getElementById('starrySky')
  let result = ''
  if (isStarryBackgroundEnable) {
    // @ts-ignore
    const starBackgroundScreenShot = starrySkyCanvas.toDataURL('image/png', 1.0)
    result = await coincideTwoPic(
      starBackgroundScreenShot,
      {},
      cesiumDataUrl,
      {}
    )
  } else {
    result = await coincideTwoPic(cesiumDataUrl)
  }

  // coincide time stamp
  const timeStampScreenShot = document.getElementById('timeStamp')
  if (timeStampScreenShot == null) return result
  let test = window.getComputedStyle(timeStampScreenShot)
  let dx = parseFloat(test.padding.slice(0, -2))
  let dy = dx
  let dw = parseFloat(test.width.slice(0, -2))
  let dh = parseFloat(test.height.slice(0, -2))

  await html2canvas(timeStampScreenShot, { backgroundColor: null }).then(
    async (canvas) => {
      let timeStampScreenShot = canvas.toDataURL('image/png', 1.0)
      result = await coincideTwoPic(result, {}, timeStampScreenShot, {
        dx,
        dy,
        dw,
        dh,
      })
    }
  )

  return result
}

const shareImage = (img: string) => {
  // todo
}

export const SocialSharing = async (
  viewer: Viewer,
  isStarryBackgroundEnable: boolean
) => {
  let screenShot = await getScreenShot(viewer, isStarryBackgroundEnable)

  shareImage(screenShot)
}
