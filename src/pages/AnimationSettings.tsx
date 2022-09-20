import React, { useEffect } from 'react'
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
  IonRow,
} from '@ionic/react'
import { Preferences } from '@capacitor/preferences'
import { setNumber } from '../functions/input'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  animateExact,
  animateFps,
  animateIncrement,
  animateLoop,
  animateRange,
  LIMIT_LOWER,
  LIMIT_UPPER,
  currentRasterMapIndexState,
} from '../functions/atoms'
import RasterMaps from '../functions/rasterMaps'

//
interface ContainerProps {}

// main component for setting menu
export const AnimationSettings: React.FC<ContainerProps> = ({}) => {
  const [exact, setExact] = useRecoilState(animateExact)
  const [fps, setFps] = useRecoilState(animateFps)
  const [increment, setIncrement] = useRecoilState(animateIncrement)
  const [loop, setLoop] = useRecoilState(animateLoop)
  const [range, setRange] = useRecoilState(animateRange)
  const currentRasterMapIndex = useRecoilValue(currentRasterMapIndexState)

  // Animation constants
  const minIncrement = 1
  const maxIncrement = 100
  const minFps = 1
  const maxFps = 60

  const reverseAnimation = () => {
    const lower = range.upper
    const upper = range.lower
    setRange({ lower, upper })
  }

  useEffect(() => {
    const settings = {
      exact,
      fps,
      increment,
      loop,
      range,
    }
    Preferences.set({
      key: 'animationSettings',
      value: JSON.stringify(settings),
    })
  }, [exact, fps, increment, loop, range])

  // Hack to get IonRange knobs to show the correct position on component mount
  useEffect(() => {
    setTimeout(() => {
      const old = Object.assign({}, range)
      setRange({ lower: 0, upper: 0 })
      setRange(old)
    }, 100)
  }, [])

  return (
    <div>
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
                min={
                  RasterMaps.length > 0
                    ? RasterMaps[currentRasterMapIndex].endTime
                    : LIMIT_LOWER
                }
                max={
                  RasterMaps.length > 0
                    ? RasterMaps[currentRasterMapIndex].startTime
                    : LIMIT_UPPER
                }
                onIonKnobMoveEnd={(e) => {
                  setRange(e.detail.value as any)
                }}
                value={range}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Animate from:</IonLabel>
                <IonInput
                  inputMode="numeric"
                  min={LIMIT_LOWER}
                  max={LIMIT_UPPER}
                  onIonChange={(e) =>
                    setRange({
                      lower: Number(e.detail.value) || 0,
                      upper: range.upper,
                    } as any)
                  }
                  value={range.lower}
                />
                Ma
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>to:</IonLabel>
                <IonInput
                  inputMode="numeric"
                  min={LIMIT_LOWER}
                  max={LIMIT_UPPER}
                  onIonChange={(e) =>
                    setRange({
                      lower: range.lower,
                      upper: Number(e.detail.value) || 0,
                    } as any)
                  }
                  value={range.upper}
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
                  checked={exact}
                  onIonChange={(e) => setExact(e.detail.checked)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Loop</IonLabel>
                <IonCheckbox
                  checked={loop}
                  onIonChange={(e) => setLoop(e.detail.checked)}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonList>
    </div>
  )
}
