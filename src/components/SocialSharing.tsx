import * as Cesium from 'cesium'
import { Viewer } from 'cesium'
import html2canvas from 'html2canvas'
import assert from 'assert'
import { timeout } from 'workbox-core/_private'
import { Media } from '@capacitor-community/media'
import { getPlatforms, isPlatform, useIonToast } from '@ionic/react'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { SocialSharing as ShareTool } from '@awesome-cordova-plugins/social-sharing'
import { Share } from '@capacitor/share'

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
  //context.drawImage(img, config.dx, config.dy, config.dw, config.dh)

  return canvas.toDataURL('image/png')
}

// for test purpose
const downloadBlob = (blob: Blob) => {
  let link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'test.png'
  link.click()
}

const dataUrltoBlob = async (url: string) => {
  return await (await fetch(url)).blob()
}

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
let savedPath: string
const saveImage = async (img: string) => {
  savedPath = await saveImgToFileSystem(img, 'tempScreenShot.png')
  const albumName = 'GPlates App'
  let albums = await Media.getAlbums()
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
    if (
      (await Media.getAlbums()).albums.find((a) => a.name === albumName) ===
      undefined
    ) {
      // no 'GPlates App' album, create one
      await Media.createAlbum({ name: albumName })
    }
    await Media.savePhoto({
      path: savedPath,
      album: albumName,
    })
  }
}

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

const shareImageIosAndAndroid = async (imgDataUrl: string) => {
  await ShareTool.share(
    'Share Screenshot',
    'GPlates Screenshot',
    imgDataUrl,
    undefined
  )
}

//take screenshot and share it
export const SocialSharing = async (
  viewer: Viewer,
  isStarryBackgroundEnable: boolean,
  loadingPresent: Function,
  loadingDismiss: Function,
  presentToast: Function,
  dismissToast: Function
) => {
  let isFail = false
  let canShare = await Share.canShare()
  //console.log(canShare)
  if (canShare.value) {
    try {
      loadingPresent({ message: 'Preparing screenshot to share...' })
      let screenShot = await getScreenShot(viewer, isStarryBackgroundEnable)
      await saveImage(screenShot)
      await Share.share({
        title: 'GPlates App Screenshot',
        text: 'I would like to share an awesome GPlates App screenshot',
        url: savedPath,
      })
      loadingDismiss()
    } catch (error) {
      console.log(error)
      loadingDismiss()
      isFail = true
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
