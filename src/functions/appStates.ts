import { atom } from 'jotai'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { RasterGroup } from './types'

export const useAppState = useAtom

export const useAppStateValue = useAtomValue

export const useSetAppState = useSetAtom

export const ageState = atom(0)
export const animateExact = atom(true)
export const animateFps = atom(3)
export const animateIncrement = atom(1)
export const animateLoop = atom(false)
export const animatePlaying = atom(false)
export const animateRange = atom({
  lower: 0,
  upper: 410,
})
export const backgroundService = atom()
export const backgroundColor = atom({
  r: 255,
  g: 255,
  b: 255,
})
export const backgroundIsEnabled = atom(false)
export const backgroundIsStarry = atom(false)
export const backgroundIsCustom = atom(false)
export const appDarkMode = atom('dark')
export const networkDownloadOnCellular = atom(false)
export const networkStatus = atom('none')
export const isAboutPageShow = atom({ key: 'isAboutPageShow', default: false })
export const isAgeSliderShown = atom(false)
export const isRasterMenuShow = atom(false)
export const isSettingsMenuShow = atom(false)
export const isVectorMenuShow = atom(false)

// Settings menu path: Ionic's Nav component is not available under React yet, so we have to build our own solution
export const settingsPath = atom('root')
export const infoPath = atom('root')

export const isGraphPanelShowState = atom(false)

export const isAddLocationWidgetShowState = atom(false)

export const isModelInfoShowState = atom(false)

export const isCacheInfoShowState = atom(false)

export const showCities = atom(false)

export const showTimeStampState = atom(true)

export const rasterGroupState = atom(RasterGroup.present)

export const currentRasterIDState = atom('none')

export const showTimeButtonState = atom(false)

export const showTimeSliderState = atom(false)

export const datasetInfoState = atom([] as any[])
