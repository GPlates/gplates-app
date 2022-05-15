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
  chevronDownOutline,
  chevronUpOutline,
  playOutline,
  playSkipBackOutline,
  playBackOutline,
  playForwardOutline,
} from 'ionicons/icons'
import { Fragment } from 'react'

const AgeSlider = (props: any) => {
  // TODO: Round to nearest valid integer on blur

  return (
    <Fragment>
      <IonButton
        className="round-button show-button"
        onClick={() => {
          props.setIsShown(true)
        }}
        size="default"
      >
        <IonIcon icon={chevronUpOutline} />
      </IonButton>
      <div className={props.isShown ? 'container' : 'container hidden'}>
        <IonItem className="time-input" lines="none">
          <IonLabel>Time:</IonLabel>
          <IonInput inputMode="numeric" min={0} max={100000} />
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
          <IonRange />
          <IonButton
            fill="clear"
            onClick={() => {
              props.setIsShown(false)
            }}
            size="default"
          >
            <IonIcon icon={chevronDownOutline} />
          </IonButton>
        </IonItem>
      </div>
    </Fragment>
  )
}
export default AgeSlider
