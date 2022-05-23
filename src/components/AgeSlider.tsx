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
import { useState } from 'react'
import { setNumber } from '../functions/input'

const AgeSlider = (props: any) => {
  const [hidden, setHidden] = useState(true)
  const [playing, setPlaying] = useState(false)
  const minAge = 0
  const maxAge = 1000

  const openMenu = () => {
    props.setMenuState(true)
    props.setHighlightAnimation(true)
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
              setNumber(props.setAge, e.detail.value, minAge, maxAge)
            }
            value={props.age}
          />
          Ma
        </IonItem>
        <IonItem className="seek-buttons" lines="none">
          <div>
            <IonButton
              fill="clear"
              onClick={() => setPlaying(!playing)}
              size="default"
            >
              <IonIcon icon={playing ? pauseOutline : playOutline} />
            </IonButton>
            <IonButton fill="clear" size="default">
              <IonIcon icon={playSkipBackOutline} />
            </IonButton>
            <IonButton fill="clear" size="default">
              <IonIcon icon={playBackOutline} />
            </IonButton>
            <IonButton fill="clear" size="default">
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
            min={minAge}
            max={maxAge}
            onIonChange={(e) => props.setAge(e.detail.value)}
            value={props.age}
          />
        </IonItem>
      </div>
      <div
        className={
          hidden
            ? 'bottom buttons container hidden'
            : 'bottom buttons container'
        }
      >
        <div className="time">{props.age} Ma</div>
        <div>
          {props.buttons}
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
