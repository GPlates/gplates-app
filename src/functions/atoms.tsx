import { atom } from 'recoil'

// TODO: Dynamically assign these variables based on selected raster
export const GEOSRV_URL =
  'https://geosrv.earthbyte.org/geoserver/Lithodat/wms?service=WMS&version=1.1.0&request=GetMap&layers=Lithodat%3Acontinental_polygons_{count}Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=image%2Fpng%3B%20mode%3D8bit'
export const LIMIT_UPPER = 410
export const LIMIT_LOWER = 0

export const age = atom({ key: 'age', default: 0 })
export const animateExact = atom({ key: 'animateExact', default: false })
export const animateFps = atom({ key: 'animateFps', default: 10 })
export const animateIncrement = atom({ key: 'animateIncrement', default: 1 })
export const animateLoop = atom({ key: 'animateLoop', default: false })
export const animatePlaying = atom({ key: 'animatePlaying', default: false })
export const animateRange = atom({
  key: 'animateRange',
  default: {
    lower: LIMIT_LOWER,
    upper: LIMIT_UPPER,
  },
})

export const backgroundColor = atom({
  key: 'backgroundColor',
  default: { r: 255, g: 255, b: 255 },
})
export const backgroundIsStarry = atom({
  key: 'backgroundIsStarry',
  default: false,
})
export const backgroundIsCustom = atom({
  key: 'backgroundIsCustom',
  default: false,
})

export const isAboutPageShow = atom({ key: 'isAboutPageShow', default: false })
export const isRasterMenuShow = atom({
  key: 'isRasterMenuShow',
  default: false,
})
export const isSettingsMenuShow = atom({
  key: 'isSettingsMenuShow',
  default: false,
})
export const isVectorMenuShow = atom({
  key: 'isVectorMenuShow',
  default: false,
})

// Settings menu path: Ionic's Nav component is not available under React yet, so we have to build our own solution
export const settingsPath = atom({ key: 'settingsPath', default: 'root' })
