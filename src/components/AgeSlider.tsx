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
import React, { Dispatch, SetStateAction, useState } from 'react'
import { setNumber } from '../functions/input'
import { AnimationService } from '../functions/animation'

interface AgeSliderProps {
  buttons: any
  animationService: AnimationService
  minAge: number
  maxAge: number
  setMenuPath: Dispatch<SetStateAction<string>>
  setMenuState: Dispatch<SetStateAction<boolean>>
}

const AgeSlider: React.FC<AgeSliderProps> = ({
  buttons,
  animationService,
  minAge,
  maxAge,
  setMenuPath,
  setMenuState,
}) => {
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
            min={minAge}
            max={maxAge}
            onIonChange={(e) =>
              setNumber(animationService.setAge, e.detail.value, minAge, maxAge)
            }
            value={animationService.age}
          />
          Ma
        </IonItem>
        <IonItem className="seek-buttons" lines="none">
          <div>
            <IonButton
              fill="clear"
              onClick={() =>
                animationService.setPlaying(!animationService.playing)
              }
              size="default"
            >
              <IonIcon
                icon={animationService.playing ? pauseOutline : playOutline}
              />
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
            min={minAge}
            max={maxAge}
            onIonChange={(e) =>
              animationService.setAge(e.detail.value as number)
            }
            value={animationService.age}
          />
        </IonItem>
      </div>
      <div
        className={hidden ? 'buttons container hidden' : 'buttons container'}
      >
        <div
          className="time"
          onClick={() => {
            setHidden(!hidden)
          }}
        >
          {animationService.age} Ma
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
