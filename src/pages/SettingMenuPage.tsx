import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import './SettingMenuPage.scss'
import {
  IonModal,
  IonButton,
  IonToolbar,
  IonTitle,
  IonRippleEffect,
  IonRange,
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
  animateExact: boolean
  setAnimateExact: Dispatch<SetStateAction<boolean>>
  animateLoop: boolean
  setAnimateLoop: Dispatch<SetStateAction<boolean>>
  animateRange: { lower: number; upper: number }
  setAnimateRange: Dispatch<SetStateAction<{ lower: number; upper: number }>>
  fps: number
  setFps: Dispatch<SetStateAction<number>>
  increment: number
  setIncrement: Dispatch<SetStateAction<number>>
  minAge: number
  maxAge: number
  closeModal: Function
  isShow: boolean
  path: string
  setPath: Dispatch<SetStateAction<string>>
  viewer: Viewer
}

// main component for setting menu
export const SettingMenuPage: React.FC<ContainerProps> = ({
  animateExact,
  setAnimateExact,
  animateLoop,
  setAnimateLoop,
  animateRange,
  setAnimateRange,
  fps,
  setFps,
  increment,
  setIncrement,
  minAge,
  maxAge,
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
  const minIncrement = 1
  const maxIncrement = 100
  const minFps = 1
  const maxFps = 60

  const reverseAnimation = () => {
    const lower = animateRange.upper
    const upper = animateRange.lower
    setAnimateRange({ lower, upper })
  }

  // Hack to get IonRange knobs to show the correct position on component mount
  useEffect(() => {
    if (path === 'animation') {
      setTimeout(() => {
        const old = Object.assign({}, animateRange)
        setAnimateRange({ lower: 0, upper: 0 })
        setAnimateRange(old)
      }, 100)
    }
  }, [path])

  // background setting
  const [isBackgroundSettingEnable, setIsBackgroundSettingEnable] = useState(false)
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] = useState(false)
  const [isCustomisedColorBackgroundEnable, setIsCustomisedColorBackgroundEnable] = useState(false)
  const [color, setColor] = useState({ r: 255, g: 255, b: 255 });

  const subPageRouting = (path: string, name: string) => {
    return (
      <IonItem
      button
      onClick={() => {
        setPath(path)
      }}
      >
        {!isPlatform('ios') && (
          <IonIcon icon={chevronForward} slot={'end'} />
        )}
        <IonLabel>{name}</IonLabel>
      </IonItem>
    )
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
          {subPageRouting('animation', 'Animation Settings')}
          {subPageRouting('backgroundSetting', 'Background Settings')}


          <IonItemDivider>Main Setting Section1</IonItemDivider>

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

      {/* animation settings subpage */}
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
                  onIonKnobMoveEnd={(e) => {
                    setAnimateRange(e.detail.value as any)
                  }}
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
                    checked={animateExact}
                    onIonChange={(e) => setAnimateExact(e.detail.checked)}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Loop</IonLabel>
                  <IonCheckbox
                    checked={animateLoop}
                    onIonChange={(e) => setAnimateLoop(e.detail.checked)}
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>
      </CSSTransition>

      {/* background setting subpage */}
      <CSSTransition
        in={path === 'backgroundSetting'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <BackgroundColorSettings viewer={viewer} backgroundSetting={{
          isBackgroundSettingEnable, setIsBackgroundSettingEnable,
          isStarryBackgroundEnable, setIsStarryBackgroundEnable,
          isCustomisedColorBackgroundEnable, setIsCustomisedColorBackgroundEnable,
          color, setColor}
        }/>
      </CSSTransition>

    </IonModal>
  )
}
