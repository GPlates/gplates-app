import './AgeSlider.scss'
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
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
import React, { useEffect } from 'react'
import { setNumber } from '../functions/input'
import { AnimationService } from '../functions/animation'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  age,
  animatePlaying,
  isSettingsMenuShow,
  settingsPath,
  currentRasterMapIndexState,
  appDarkMode,
  isAgeSliderShown,
  LIMIT_LOWER,
  LIMIT_UPPER,
  animateRange,
} from '../functions/atoms'
import {
  matchDarkMode,
  setStatusBarTheme,
  statusBarListener,
} from '../functions/darkMode'
import rasterMaps from '../functions/rasterMaps'

interface AgeSliderProps {
  buttons: any
  animationService: AnimationService
}

const AgeSlider: React.FC<AgeSliderProps> = ({ buttons, animationService }) => {
  const [_age, setAge] = useRecoilState(age)
  const darkMode = useRecoilValue(appDarkMode)
  const playing = useRecoilValue(animatePlaying)
  const setMenuPath = useSetRecoilState(settingsPath)
  const setMenuState = useSetRecoilState(isSettingsMenuShow)
  const [shown, setShown] = useRecoilState(isAgeSliderShown)
  const [presentToast, dismissToast] = useIonToast()
  const [currentRasterMapIndex, setCurrentRasterMapIndex] = useRecoilState(
    currentRasterMapIndexState
  )
  const [range, setRange] = useRecoilState(animateRange)

  const openMenu = () => {
    setMenuPath('animation')
    setMenuState(true)
  }

  const showAgeSliderWidget = () => {
    if (
      rasterMaps[currentRasterMapIndex].endTime === 0 &&
      rasterMaps[currentRasterMapIndex].startTime === 0
    ) {
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

  useEffect(() => {
    if (shown) {
      setStatusBarTheme(darkMode)
    } else {
      setStatusBarTheme('dark')
      // Remove listener so status bar stays dark (Android) or light (iOS)
      matchDarkMode.removeEventListener('change', statusBarListener)
    }
  }, [shown])

  return (
    <div>
      <div className={shown ? 'container' : 'container hidden'}>
        <IonItem className="time-input" lines="none">
          <IonInput
            inputMode="numeric"
            min={
              rasterMaps.length > 0
                ? rasterMaps[currentRasterMapIndex].endTime
                : LIMIT_LOWER
            }
            max={
              rasterMaps.length > 0
                ? rasterMaps[currentRasterMapIndex].startTime
                : LIMIT_UPPER
            }
            onIonChange={(e) =>
              setNumber(
                setAge,
                e.detail.value,
                rasterMaps.length > 0
                  ? rasterMaps[currentRasterMapIndex].endTime
                  : LIMIT_LOWER,
                rasterMaps.length > 0
                  ? rasterMaps[currentRasterMapIndex].startTime
                  : LIMIT_UPPER
              )
            }
            value={_age}
          />
          Ma
        </IonItem>
        <IonItem className="seek-buttons" lines="none">
          <div>
            <IonButton
              fill="clear"
              onClick={() => animationService.setPlaying(!playing)}
              size="default"
            >
              <IonIcon icon={playing ? pauseOutline : playOutline} />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={() => animationService.resetPlayHead()}
              size="default"
            >
              <IonIcon icon={playSkipBackOutline} />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={() => animationService.movePlayHead(-1)}
              size="default"
            >
              <IonIcon icon={playBackOutline} />
            </IonButton>
            <IonButton
              fill="clear"
              onClick={() => animationService.movePlayHead(1)}
              size="default"
            >
              <IonIcon icon={playForwardOutline} />
            </IonButton>
            <IonButton fill="clear" onClick={openMenu} size="default">
              <IonIcon icon={cogOutline} />
            </IonButton>
          </div>
        </IonItem>
        <IonItem className="slider" lines="none">
          <IonRange
            dir="rtl"
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
            value={_age}
          />
        </IonItem>
      </div>
      <div className={shown ? 'buttons container' : 'buttons container hidden'}>
        <div
          className="time"
          id={'timeStamp'} // screenshot need time information, using id to locate element
          onClick={() => showAgeSliderWidget()}
        >
          {_age} Ma
        </div>
        <div>
          {buttons}
          <IonButton
            className="round-button show-button"
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
