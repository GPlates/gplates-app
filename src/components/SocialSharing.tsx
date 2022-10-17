import * as Cesium from 'cesium'
import { Viewer } from 'cesium'
import html2canvas from 'html2canvas'
import assert from 'assert'
import { Media } from '@capacitor-community/media'
import { isPlatform, getPlatforms } from '@ionic/react'
import { Filesystem, Directory } from '@capacitor/filesystem'
//import { SocialSharing as ShareTool } from '@awesome-cordova-plugins/social-sharing'
import { Share } from '@capacitor/share'
import { cesiumViewer } from '../functions/cesiumViewer'
import { timeout } from '../functions/util'

//
// get screenshot blob from cesium canvas
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

  while (result === null) await timeout(200)

  return result
}

/*
//
//
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
  //context.drawImage(img, config.dx, config.dy, config.dw, config.dh)

  return canvas.toDataURL('image/png')
}

//
// for test purpose
const downloadBlob = (blob: Blob) => {
  let link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'test.png'
  link.click()
}

//
//
const dataUrltoBlob = async (url: string) => {
  return await (await fetch(url)).blob()
}
*/
//
//
const saveImgToFileSystem = async (img: string, fileName: string) => {
  await Filesystem.requestPermissions()
  return (
    await Filesystem.writeFile({
      path: fileName,
      data: img,
      directory: Directory.Cache,
    })
  ).uri
}

/*
//
//
const getScreenShot = async (
  viewer: Viewer,
  isStarryBackgroundEnable: boolean
) => {
  let cesiumBlob = await getCesiumScreenShotBlob(viewer)
  let cesiumDataUrl = URL.createObjectURL(cesiumBlob)

  const starrySkyCanvas = document.getElementById('starry-sky')
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
*/
//
//
const saveImage = async (img: string) => {
  let savedPath = await saveImgToFileSystem(img, 'tempScreenShot.png')
  const albumName = 'GPlates App'
  //let albums = await Media.getAlbums()
  //console.log(albums)
  if (isPlatform('ios')) {
    let albumID =
      (await Media.getAlbums()).albums.find((a) => a.name === albumName)
        ?.identifier || null

    if (albumID === null) {
      // no 'GPlates App' album, create one
      await Media.createAlbum({ name: albumName })
      await Media.savePhoto({
        path: savedPath,
        album: (
          await Media.getAlbums()
        ).albums.find((a) => a.name === albumName)?.identifier,
      })
    } else {
      await Media.savePhoto({
        path: savedPath,
        album: albumID,
      })
    }
  } else if (isPlatform('android')) {
    const media = await Media.getAlbums().catch((err) => {
      console.log(err)
    })
    if (media) {
      if (media.albums.find((a) => a.name === albumName) === undefined) {
        // no 'GPlates App' album, create one
        await Media.createAlbum({ name: albumName })
      }
      await Media.savePhoto({
        path: savedPath,
        album: albumName,
      })
    }
  }
  return savedPath
}

//
//
const dataURLtoFile = (dataUrl: string, fileName: string) => {
  let arr = dataUrl.split(',')
  // @ts-ignore
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}

/*
//
//
const shareImageWeb = async (imgDataUrl: string) => {
  let imgFile = dataURLtoFile(imgDataUrl, 'tempScreenShot.png')
  if (navigator.canShare && navigator.canShare({ files: [imgFile] })) {
    await navigator
      .share({
        files: [imgFile],
        title: 'Share Screenshot',
        text: 'From PLates',
      })
      .then((val) => {
        console.log('Share was successful.')
      })
      .catch((error) => {
        console.log('Sharing failed', error)
      })
  } else {
    console.log(`Your system doesn't support sharing files.`)
  }
}

//
//
const shareImageIosAndAndroid = async (imgDataUrl: string) => {
  await ShareTool.share(
    'Share Screenshot',
    'GPlates Screenshot',
    imgDataUrl,
    undefined
  )
}
*/
//
//
const getScreenShot = async () => {
  //get cesium viewer screenshot
  let cesiumBlob = await getCesiumScreenShotBlob(cesiumViewer)
  let cesiumImageURL = URL.createObjectURL(cesiumBlob)

  let cesiumImage = new Image()
  cesiumImage.src = cesiumImageURL
  cesiumImage.crossOrigin = 'Anonymous'
  while (!cesiumImage.complete) {
    await timeout(100)
  }

  //get starry sky background
  const starrySkyCanvas = document.getElementById(
    'starry-sky'
  ) as HTMLCanvasElement

  let starBackgroundScreenShot = ''
  let drawStarrySky = false
  if (starrySkyCanvas) {
    const computedStyle = window.getComputedStyle(starrySkyCanvas)
    //starry-sky is visible
    if (computedStyle.getPropertyValue('display') != 'none') {
      drawStarrySky = true
      starBackgroundScreenShot = starrySkyCanvas.toDataURL('image/png', 1.0)
    }
  }

  //starry sky image
  let starrySkyImage = new Image()
  starrySkyImage.src = starBackgroundScreenShot
  starrySkyImage.crossOrigin = 'Anonymous'
  while (!starrySkyImage.complete) {
    await timeout(100)
  }

  let canvas = document.createElement('canvas')
  //let width = cesiumViewer.canvas.width
  //let height = cesiumViewer.canvas.height
  canvas.width = Math.max(cesiumImage.width, starrySkyImage.width)
  canvas.height = Math.max(cesiumImage.height, starrySkyImage.height)

  let context = canvas.getContext('2d')
  assert(context != null)
  context.rect(0, 0, canvas.width, canvas.height)

  //draw StarrySky background
  if (drawStarrySky) {
    context.drawImage(
      starrySkyImage,
      0,
      0,
      starrySkyImage.width,
      starrySkyImage.height
    )
  }
  //draw cesium image
  context.drawImage(cesiumImage, 0, 0, cesiumImage.width, cesiumImage.height)

  //overlay the time widget
  const timeStampScreenShot = document.getElementById('timeStamp')
  if (timeStampScreenShot != null) {
    let test = window.getComputedStyle(timeStampScreenShot)
    let dx = parseFloat(test.padding.slice(0, -2))
    let dy = dx
    let dw = parseFloat(test.width.slice(0, -2))
    let dh = parseFloat(test.height.slice(0, -2))

    let time_canvas = await html2canvas(timeStampScreenShot, {
      backgroundColor: null,
    })
    let time_canvas_dataurl = time_canvas.toDataURL('image/png', 1.0)

    let timeImage = new Image()
    timeImage.src = time_canvas_dataurl
    timeImage.crossOrigin = 'Anonymous'
    while (!timeImage.complete) {
      await timeout(100)
    }
    context.drawImage(timeImage, dx, dy, dw, dh)
  }

  return canvas.toDataURL('image/png')
}

//take screenshot and share it
export const SocialSharing = async (
  loadingPresent: Function,
  loadingDismiss: Function,
  presentToast: Function,
  dismissToast: Function
) => {
  let isFail = false
  let canShare: boolean = (await Share.canShare()).value
  //console.log(canShare)
  //console.log(getPlatforms())
  if (getPlatforms().includes('desktop')) canShare = false
  if (canShare) {
    try {
      loadingPresent({ message: 'Taking screenshot...' })
      //let screenShot = await getScreenShot(viewer, isStarryBackgroundEnable)
      let screenShot = await getScreenShot()
      //console.log(screenShot)
      let filepath = await saveImage(screenShot)
      await Share.share({
        title: 'GPlates App Screenshot',
        text: 'I would like to share an awesome GPlates App screenshot',
        url: filepath,
      })
      loadingDismiss()
    } catch (error: any) {
      console.log(error)
      loadingDismiss()
      if (error.message != 'Share canceled') {
        isFail = true
      }
    }
  } else {
    isFail = true
  }
  if (isFail) {
    await presentToast({
      buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
      duration: 5000,
      message:
        'Unable to share screenshot. Not implement on web or failed to create screenshot.',
      onDidDismiss: () => {},
    })
  }

  /*
  console.log(getPlatforms())
  if (isPlatform('cordova')) {
    await saveImage(screenShot)
    await shareImageIosAndAndroid(screenShot)
  } else {
    // no image saving part for browsers
    await shareImageWeb(screenShot)
  }*/
}
