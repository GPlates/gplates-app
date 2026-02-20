import './AgeSlider.scss'
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonRange,
  useIonToast,
} from '@ionic/react'
import {
  chevronUpCircleOutline,
  cogOutline,
  pauseOutline,
  playOutline,
  playSkipBackOutline,
  playBackOutline,
  playForwardOutline,
  timeOutline,
} from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { AnimationService } from '../functions/animation'
import {
  useAppState,
  useAppStateValue,
  useSetAppState,
} from '../functions/appStates'
import {
  ageState,
  animatePlaying,
  isSettingsMenuShow,
  settingsPath,
  currentRasterIDState,
  appDarkMode,
  isAgeSliderShown,
  animateRange,
  animateIncrement,
  showTimeStampState,
  showTimeButtonState,
  showTimeSliderState,
} from '../functions/appStates'
import {
  matchDarkMode,
  setStatusBarTheme,
  statusBarListener,
} from '../functions/darkMode'
import rasterMaps, { getRasterByID } from '../functions/rasterMaps'
import { setAnimationFrame } from '../functions/animation'

interface AgeSliderProps {
  animationService: AnimationService
}

const AgeSlider: React.FC<AgeSliderProps> = ({ animationService }) => {
  const [age, setAge] = useAppState(ageState)
  const darkMode = useAppStateValue(appDarkMode)
  const increment = useAppStateValue(animateIncrement)
  const playing = useAppStateValue(animatePlaying)
  const setMenuPath = useSetAppState(settingsPath)
  const setMenuState = useSetAppState(isSettingsMenuShow)
  const [shown, setShown] = useAppState(isAgeSliderShown)
  const [presentToast, dismissToast] = useIonToast()
  const currentRasterID = useAppStateValue(currentRasterIDState)
  const range = useAppStateValue(animateRange)
  const showTimeStamp = useAppStateValue(showTimeStampState)
  const [showTimeButton, setShowTimeButton] = useAppState(showTimeButtonState) //the button to open time slider
  const [showTimeSlider, setShowTimeSlider] = useAppState(showTimeSliderState)

  const openMenu = () => {
    setMenuPath('animation')
    setMenuState(true)
  }

  const showAgeSliderWidget = () => {
    let raster = getRasterByID(currentRasterID)
    if (!raster) return
    if (raster.endTime === 0 && raster.startTime === 0) {
      setShown(false)
      presentToast({
        buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
        duration: 5000,
        message:
          'This raster is present-day only. The reconstruction animation is unvailable.',
        onDidDismiss: () => {},
      })
    } else {
      setShown(true)
    }
  }

  /**
   * handle showTimeSlider state change
   */
  useEffect(() => {
    if (showTimeSlider) {
      showAgeSliderWidget() //show the age slider
    } else {
      setShown(false) //hide the age slider
    }
  }, [showTimeSlider])

  /**
   *
   */
  useEffect(() => {
    if (shown) {
      setStatusBarTheme(darkMode)
    } else {
      setStatusBarTheme('dark')
      // Remove listener so status bar stays dark (Android) or light (iOS)
      matchDarkMode.removeEventListener('change', statusBarListener)
    }
  }, [shown])

  /**
   * handle the situation when the current raster has changed.
   */
  useEffect(() => {
    let raster = getRasterByID(currentRasterID)
    if (!raster) return
    if (raster?.startTime == raster.endTime && raster?.startTime == 0) {
      setShowTimeButton(false)
    } else {
      setAnimationFrame(raster?.startTime, raster.id)
      setShowTimeButton(true)
    }
  }, [currentRasterID])

  let raster = getRasterByID(currentRasterID)
  if (!raster) return null

  return (
    <div
      className={
        shown
          ? 'age-play-controls-container'
          : 'age-play-controls-container hidden'
      }
    >
      <IonItem className="time-input" lines="none">
        <IonInput
          inputMode="numeric"
          min={rasterMaps.length > 0 ? raster.endTime : 0}
          max={rasterMaps.length > 0 ? raster.startTime : 0}
          onIonChange={(e) => {
            if (!raster || !e.detail.value) return null
            let newAge = Number(e.detail.value)
            if (newAge < raster.endTime) {
              newAge = raster.endTime
            } else if (newAge > raster.startTime) {
              newAge = raster.startTime
            }
            setAge(newAge)
            setAnimationFrame(newAge, raster.id)
          }}
          value={age}
        />
        Ma
      </IonItem>
      <IonItem className="seek-buttons" lines="none">
        <div>
          <IonButton
            fill="clear"
            onClick={() => animationService.movePrev()}
            size="default"
          >
            <IonIcon icon={playBackOutline} />
          </IonButton>
          <IonButton
            fill="clear"
            onClick={() => animationService.setPlaying(!playing)}
            size="default"
          >
            <IonIcon
              id="play-pause-icon"
              icon={playing ? pauseOutline : playOutline}
            />
          </IonButton>
          <IonButton
            fill="clear"
            onClick={() => animationService.moveNext()}
            size="default"
          >
            <IonIcon icon={playForwardOutline} />
          </IonButton>
          <IonButton
            fill="clear"
            onClick={() => animationService.resetPlayHead()}
            size="default"
          >
            <IonIcon icon={playSkipBackOutline} />
          </IonButton>
          <IonButton fill="clear" onClick={openMenu} size="default">
            <IonIcon icon={cogOutline} />
          </IonButton>
        </div>
      </IonItem>
      <IonItem className="slider" lines="none">
        <IonRange
          dir={range.lower < range.upper ? 'ltr' : 'rtl'}
          onIonKnobMoveStart={() => {
            animationService.setDragging(true)
            animationService.setPlaying(false)
          }}
          onIonKnobMoveEnd={(e) => {
            animationService.setDragging(false)
            animationService.onAgeSliderChange(e.detail.value as number)
          }}
          min={Math.min(range.lower, range.upper)}
          max={Math.max(range.lower, range.upper)}
          onIonChange={(e) => {
            setAge(e.detail.value as number)
            animationService.onAgeSliderChange(e.detail.value as number)
          }}
          value={age}
        />
      </IonItem>
    </div>
  )
}
export default AgeSlider
