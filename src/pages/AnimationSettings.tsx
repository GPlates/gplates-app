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
  IonToggle,
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

  let minTime =
    RasterMaps.length > 0 ? RasterMaps[currentRasterMapIndex].endTime : 0
  let maxTime =
    RasterMaps.length > 0 ? RasterMaps[currentRasterMapIndex].startTime : 1000

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
                dir={range.lower > range.upper ? 'rtl' : 'ltr'}
                dualKnobs={true}
                min={minTime}
                max={maxTime}
                onIonKnobMoveEnd={(e) => {
                  //console.log(e.detail.value)
                  let rangeValue = e.detail.value as {
                    lower: number
                    upper: number
                  }
                  if (range.lower > range.upper) {
                    setRange({
                      lower: rangeValue.upper,
                      upper: rangeValue.lower,
                    })
                  } else {
                    setRange({
                      lower: rangeValue.lower,
                      upper: rangeValue.upper,
                    })
                  }
                }}
                value={range}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>From:</IonLabel>
                <IonInput
                  inputMode="numeric"
                  min={minTime}
                  max={maxTime}
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
                <IonLabel>To:</IonLabel>
                <IonInput
                  inputMode="numeric"
                  min={minTime}
                  max={maxTime}
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
            <IonCol className="reverse-col">
              <IonButton onClick={reverseAnimation} size="small">
                Reverse the Animation
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="increment-col">
              <IonItem>
                <IonLabel>Increment:</IonLabel>
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
                Myr
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
                <IonToggle
                  checked={exact}
                  onIonChange={(e) => setExact(e.detail.checked)}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Loop</IonLabel>
                <IonToggle
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
