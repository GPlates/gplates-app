import './AgeSlider.scss'
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRange,
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
import React, { useState } from 'react'
import { setNumber } from '../functions/input'
import { AnimationService } from '../functions/animation'
import { LIMIT_LOWER, LIMIT_UPPER } from '../functions/atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  age,
  animatePlaying,
  isSettingsMenuShow,
  settingsPath,
} from '../functions/atoms'

interface AgeSliderProps {
  buttons: any
  animationService: AnimationService
}

const AgeSlider: React.FC<AgeSliderProps> = ({ buttons, animationService }) => {
  const [_age, setAge] = useRecoilState(age)
  const playing = useRecoilValue(animatePlaying)
  const setMenuPath = useSetRecoilState(settingsPath)
  const setMenuState = useSetRecoilState(isSettingsMenuShow)
  const [hidden, setHidden] = useState(true)

  const openMenu = () => {
    setMenuPath('animation')
    setMenuState(true)
  }

  return (
    <div>
      <div className={hidden ? 'container hidden' : 'container'}>
        <IonItem className="time-input" lines="none">
          <IonLabel>Time:</IonLabel>
          <IonInput
            inputMode="numeric"
            min={LIMIT_LOWER}
            max={LIMIT_UPPER}
            onIonChange={(e) =>
              setNumber(setAge, e.detail.value, LIMIT_LOWER, LIMIT_UPPER)
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
            min={LIMIT_LOWER}
            max={LIMIT_UPPER}
            onIonChange={(e) => setAge(e.detail.value as number)}
            value={_age}
          />
        </IonItem>
      </div>
      <div
        className={hidden ? 'buttons container hidden' : 'buttons container'}
      >
        <div
          className="time"
          id={'timeStamp'} // screenshot need time information, using id to locate element
          onClick={() => {
            setHidden(!hidden)
          }}
        >
          {_age} Ma
        </div>
        <div>
          {buttons}
          <IonButton
            className="round-button show-button"
            onClick={() => {
              setHidden(!hidden)
            }}
            size="default"
          >
            <IonIcon icon={hidden ? timeOutline : chevronUpCircleOutline} />
          </IonButton>
        </div>
      </div>
    </div>
  )
}
export default AgeSlider
