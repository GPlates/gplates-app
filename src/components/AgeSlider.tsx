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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
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
} from '../functions/atoms'
import {
  matchDarkMode,
  setStatusBarTheme,
  statusBarListener,
} from '../functions/darkMode'
import rasterMaps, { getRasterByID } from '../functions/rasterMaps'
import { setAnimationFrame } from '../functions/animation'

interface AgeSliderProps {
  buttons: any
  animationService: AnimationService
}

const AgeSlider: React.FC<AgeSliderProps> = ({ buttons, animationService }) => {
  const [age, setAge] = useRecoilState(ageState)
  const darkMode = useRecoilValue(appDarkMode)
  const increment = useRecoilValue(animateIncrement)
  const playing = useRecoilValue(animatePlaying)
  const setMenuPath = useSetRecoilState(settingsPath)
  const setMenuState = useSetRecoilState(isSettingsMenuShow)
  const [shown, setShown] = useRecoilState(isAgeSliderShown)
  const [presentToast, dismissToast] = useIonToast()
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const range = useRecoilValue(animateRange)
  const showTimeStamp = useRecoilValue(showTimeStampState)
  const [showTimeButton, setShowTimeButton] = useState(false) //the button to open time slider

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
      setShown(!shown)
    }
  }

  //
  //
  //
  useEffect(() => {
    if (shown) {
      setStatusBarTheme(darkMode)
    } else {
      setStatusBarTheme('dark')
      // Remove listener so status bar stays dark (Android) or light (iOS)
      matchDarkMode.removeEventListener('change', statusBarListener)
    }
  }, [shown])

  //
  //
  //
  useEffect(() => {
    let raster = getRasterByID(currentRasterID)
    if (!raster) return
    if (raster?.startTime == raster.endTime && raster?.startTime == 0) {
      setShowTimeButton(false)
    } else {
      setShowTimeButton(true)
    }
  }, [currentRasterID])

  let raster = getRasterByID(currentRasterID)
  if (!raster) return null

  return (
    <div>
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
      <div
        className={
          shown
            ? 'buttons top-buttons-container'
            : 'buttons top-buttons-container hidden'
        }
      >
        <div
          className="time"
          id={'timeStamp'} // screenshot need time information, using id to locate element
          onClick={() => showAgeSliderWidget()}
        >
          {showTimeStamp && <span>{age} Ma</span>}
        </div>
        <div>
          {buttons}
          {/* the button to show or hide time slider */}
          <IonButton
            className="round-button show-button"
            style={{ display: showTimeButton ? '' : 'none' }}
            onClick={() => showAgeSliderWidget()}
            size="default"
          >
            <IonIcon icon={shown ? chevronUpCircleOutline : timeOutline} />
          </IonButton>
        </div>
      </div>
    </div>
  )
}
export default AgeSlider
