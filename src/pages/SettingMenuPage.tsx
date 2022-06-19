import React, { Dispatch, SetStateAction, useState } from 'react'
import './SettingMenuPage.scss'
import {
  IonModal,
  IonButton,
  IonToolbar,
  IonTitle,
  IonRippleEffect,
  IonRange,
  IonToggle,
  IonCheckbox,
  IonSelectOption,
  IonLabel,
  IonSelect,
  IonList,
  IonItemDivider,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonButtons,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  isPlatform,
} from '@ionic/react'
import { setNumber } from '../functions/input'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { CSSTransition } from 'react-transition-group'
import { BackgroundColorSettings } from '../components/BackgroundColorSettings'
import { Viewer } from 'cesium'

interface ContainerProps {
  animateRange: { lower: number; upper: number }
  setAnimateRange: Dispatch<SetStateAction<{ lower: number; upper: number }>>
  closeModal: Function
  isShow: boolean
  path: string
  setPath: Dispatch<SetStateAction<string>>
  viewer: Viewer
}

// main component for setting menu
export const SettingMenuPage: React.FC<ContainerProps> = ({
  animateRange,
  setAnimateRange,
  closeModal,
  isShow,
  path,
  setPath,
  viewer
}) => {
  const titles: { [key: string]: string } = {
    root: 'Settings Menu',
    animation: 'Animation Settings',
  }

  // Animation Settings
  const minAge = 0
  const maxAge = 1000
  const minIncrement = 0
  const maxIncrement = 100
  const minFps = 0
  const maxFps = 60

  const [increment, setIncrement] = useState(0)
  const [fps, setFps] = useState(0)
  const [animateExact, setAnimateExact] = useState(false)
  const [animateLoop, setAnimateLoop] = useState(false)

  const reverseAnimation = () => {
    const lower = animateRange.upper
    const upper = animateRange.lower
    setAnimateRange({ lower, upper })
  }

  return (
    <IonModal isOpen={isShow} animated backdropDismiss={false}>
      <IonToolbar>
        {path !== 'root' && (
          <IonButtons slot={'start'}>
            <IonButton
              onClick={() => {
                setPath('root')
              }}
              color={'secondary'}
            >
              <IonIcon icon={chevronBack} />
              <IonRippleEffect />
            </IonButton>
          </IonButtons>
        )}
        <IonTitle>{titles[path]}</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              closeModal()
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      {/* put new settings in this IonList element below */}
      {/* some demo is shown below */}
      <CSSTransition
        in={path === 'root'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <IonList className={'settings-list'}>
          <IonItem
            button
            onClick={() => {
              setPath('animation')
            }}
          >
            {!isPlatform('ios') && (
              <IonIcon icon={chevronForward} slot={'end'} />
            )}
            <IonLabel>Animation Settings</IonLabel>
          </IonItem>
          <IonItemDivider>Main Setting Section1</IonItemDivider>
          <IonItem>
            <IonLabel>Animation Speed</IonLabel>
          </IonItem>
          <IonItem>
            <IonRange min={20} max={80} step={2} />
          </IonItem>

          <BackgroundColorSettings viewer={viewer}/>

          <IonItemDivider>Main Setting Section3</IonItemDivider>
          <IonItem>
            <IonLabel>Enable Something</IonLabel>
            <IonCheckbox class={'single-setting-option'} />
          </IonItem>

          <IonItemDivider>Main Setting Section4</IonItemDivider>
          <IonItem>
            <IonLabel>Some Segmentation</IonLabel>
            <IonRadioGroup>
              <IonItem>
                <IonItem>
                  <IonLabel>1</IonLabel>
                  <IonRadio slot="end" value="1" />
                </IonItem>
                <IonItem>
                  <IonLabel>2</IonLabel>
                  <IonRadio slot="end" value="2" />
                </IonItem>
              </IonItem>
            </IonRadioGroup>
          </IonItem>

          <IonItemDivider>Main Setting Section5</IonItemDivider>
          <IonItem>
            <IonLabel>Select Something</IonLabel>
            <IonSelect>
              <IonSelectOption value="1">1</IonSelectOption>
              <IonSelectOption value="2">2</IonSelectOption>
              <IonSelectOption value="3">3</IonSelectOption>
              <IonSelectOption value="4">4</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </CSSTransition>
      <CSSTransition
        in={path === 'animation'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <IonList className={'settings-list'}>
          <IonGrid className="animation-settings">
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <h5>Range</h5>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonRange
                  dir="rtl"
                  dualKnobs={true}
                  min={minAge}
                  max={maxAge}
                  onIonChange={(e) => setAnimateRange(e.detail.value as any)}
                  value={animateRange}
                />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel>Animate from:</IonLabel>
                  <IonInput
                    inputMode="numeric"
                    min={minAge}
                    max={maxAge}
                    onIonChange={(e) =>
                      setAnimateRange({
                        lower: Number(e.detail.value) || 0,
                        upper: animateRange.upper,
                      } as any)
                    }
                    value={animateRange.lower}
                  />
                  Ma
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem>
                  <IonLabel>to:</IonLabel>
                  <IonInput
                    inputMode="numeric"
                    min={minAge}
                    max={maxAge}
                    onIonChange={(e) =>
                      setAnimateRange({
                        lower: animateRange.lower,
                        upper: Number(e.detail.value) || 0,
                      } as any)
                    }
                    value={animateRange.upper}
                  />
                  Ma
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="increment-col">
                <IonItem>
                  <IonLabel>with an increment of:</IonLabel>
                  <IonInput
                    inputMode="numeric"
                    min={minIncrement}
                    max={maxIncrement}
                    onIonChange={(e) =>
                      setNumber(
                        setIncrement,
                        e.detail.value,
                        minIncrement,
                        maxIncrement
                      )
                    }
                    value={increment}
                  />
                  Myr per frame
                </IonItem>
              </IonCol>
              <IonCol className="reverse-col">
                <IonButton onClick={reverseAnimation} size="small">
                  Reverse the Animation
                </IonButton>
                <div className="description">
                  by swapping the start and end times
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <h5>Options</h5>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel>Frames per second:</IonLabel>
                  <IonInput
                    inputMode="numeric"
                    min={minFps}
                    max={maxFps}
                    onIonChange={(e) =>
                      setNumber(setFps, e.detail.value, minFps, maxFps)
                    }
                    value={fps}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel>Finish animation exactly on end time</IonLabel>
                  <IonCheckbox
                    onIonChange={(e) => setAnimateExact(e.detail.value)}
                    value={animateExact}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Loop</IonLabel>
                  <IonCheckbox
                    onIonChange={(e) => setAnimateLoop(e.detail.value)}
                    value={animateLoop}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>
      </CSSTransition>
    </IonModal>
  )
}
