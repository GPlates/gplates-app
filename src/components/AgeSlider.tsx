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
  playOutline,
  playSkipBackOutline,
  playBackOutline,
  playForwardOutline,
  timeOutline,
} from 'ionicons/icons'
import { useState } from 'react'

const AgeSlider = (props: any) => {
  const [hidden, setHidden] = useState(true)
  const minAge = 0
  const maxAge = 1000

  const setAge = (age: string | null | undefined) => {
    const number = Number(age)
    if (number) {
      if (number < minAge) {
        props.setAge(minAge)
      } else if (number > maxAge) {
        props.setAge(maxAge)
      } else {
        props.setAge(Math.round(Number(age)))
      }
    }
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
            onIonChange={(e) => setAge(e.detail.value)}
            value={props.age}
          />
          Ma
        </IonItem>
        <IonItem className="seek-buttons" lines="none">
          <div>
            <IonButton fill="clear" size="default">
              <IonIcon icon={playOutline} />
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
          </div>
        </IonItem>
        <IonItem className="slider" lines="none">
          <IonRange
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
