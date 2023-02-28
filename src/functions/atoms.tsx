import { atom } from 'recoil'
import { RasterCfg } from './types'

import { failSafeRasterMaps } from './rasterMaps'

export const age = atom({ key: 'age', default: 0 })
export const animateExact = atom({ key: 'animateExact', default: true })
export const animateFps = atom({ key: 'animateFps', default: 3 })
export const animateIncrement = atom({ key: 'animateIncrement', default: 1 })
export const animateLoop = atom({ key: 'animateLoop', default: false })
export const animatePlaying = atom({ key: 'animatePlaying', default: false })
export const animateRange = atom({
  key: 'animateRange',
  default: {
    lower: 0,
    upper: 410,
  },
})

export const backgroundService = atom({ key: 'backgroundService' })
export const backgroundColor = atom({
  key: 'backgroundColor',
  default: { r: 255, g: 255, b: 255 },
})
export const backgroundIsEnabled = atom({
  key: 'backgroundIsEnabled',
  default: false,
})
export const backgroundIsStarry = atom({
  key: 'backgroundIsStarry',
  default: false,
})
export const backgroundIsCustom = atom({
  key: 'backgroundIsCustom',
  default: false,
})

//export const appDarkMode = atom({ key: 'appDarkMode', default: 'auto' })
export const appDarkMode = atom({ key: 'appDarkMode', default: 'dark' })

export const networkDownloadOnCellular = atom({
  key: 'downloadOnCellular',
  default: false,
})

export const networkStatus = atom({
  key: 'networkStatus',
  default: 'none',
})

export const isAboutPageShow = atom({ key: 'isAboutPageShow', default: false })
export const isAgeSliderShown = atom({
  key: 'isAgeSliderShown',
  default: false,
})
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
export const rasterMapState = atom<RasterCfg[]>({
  key: 'rasterMapState',
  default: failSafeRasterMaps,
})
export const currentRasterMapIndexState = atom({
  key: 'currentRasterMapIndexState',
  default: 0,
})

// Settings menu path: Ionic's Nav component is not available under React yet, so we have to build our own solution
export const settingsPath = atom({ key: 'settingsPath', default: 'root' })
export const infoPath = atom({ key: 'infoPath', default: 'root' })

export const isGraphPanelShowState = atom({
  key: 'isGraphPanelShowState',
  default: false,
})

export const isAddLocationWidgetShowState = atom({
  key: 'isAddLocationWidgetShowState',
  default: false,
})

export const isModelInfoShowState = atom({
  key: 'isModelInfoShowState',
  default: false,
})

export const isCacheInfoShowState = atom({
  key: 'isCacheInfoShowState',
  default: false,
})

export const showCities = atom({
  key: 'showCities',
  default: false,
})

export const showTimeStampState = atom({
  key: 'showTimeStampState',
  default: true,
})
