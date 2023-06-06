import React, { useEffect, useState } from 'react'
import {
  IonButton,
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  ageState,
  animateExact,
  animateFps,
  animateIncrement,
  animateLoop,
  animateRange,
  currentRasterIDState,
  isCacheInfoShowState,
} from '../functions/atoms'
import RasterMaps, { getRasterByID } from '../functions/rasterMaps'
import { getCacheStatsData } from './CacheInfo'

//
interface ContainerProps {}

// main component for setting menu
export const AnimationSettings: React.FC<ContainerProps> = ({}) => {
  const [exact, setExact] = useRecoilState(animateExact)
  const [fps, setFps] = useRecoilState(animateFps)
  const [tempFps, setTempFps] = useState<string | null>()
  const [increment, setIncrement] = useRecoilState(animateIncrement)
  const [loop, setLoop] = useRecoilState(animateLoop)
  const [range, setRange] = useRecoilState(animateRange)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const setCacheInfoShow = useSetRecoilState(isCacheInfoShowState)
  const [currentAge, setCurrentAge] = useRecoilState(ageState)

  // Animation constants
  const minIncrement = 1
  const maxIncrement = 100
  const minFps = 1
  const maxFps = 60

  //
  //
  //
  const reverseAnimation = () => {
    const lower = range.upper
    const upper = range.lower
    setRange({ lower, upper })
    setCurrentAge(lower)
  }

  //
  //
  //
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

  //
  // Hack to get IonRange knobs to show the correct position on component mount
  //
  useEffect(() => {
    setTimeout(() => {
      const old = Object.assign({}, range)
      setRange({ lower: 0, upper: 0 })
      setRange(old)
    }, 100)
  }, [])

  let raster = getRasterByID(currentRasterID)
  let minTime = 0
  let maxTime = 0
  if (raster) {
    minTime = RasterMaps.length > 0 ? raster.endTime : 0
    maxTime = RasterMaps.length > 0 ? raster.startTime : 1000
  }
  return (
    <div>
      <IonList className={'settings-list'}>
        <IonGrid className="animation-settings">
          <IonRow>
            <IonCol>
              <IonItem>
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
                >
                  <div slot="label">Range</div>
                </IonRange>
              </IonItem>
            </IonCol>
          </IonRow>
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="From age"
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
          </IonRow>
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="To age"
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
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Swap</IonLabel>
                <IonButton onClick={reverseAnimation} size="small">
                  Swap &quot;FROM age&quot; and &quot;TO age&quot;
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
          {/********************************************/}
          <IonRow>
            <IonCol className="increment-col">
              <IonItem>
                <IonInput
                  label="Increment"
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
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="FPS (best effort)"
                  inputMode="numeric"
                  min={minFps}
                  max={maxFps}
                  onIonBlur={() => {
                    setNumber(setFps, tempFps, minFps, maxFps)
                  }}
                  onIonChange={(e) => {
                    setNumber(setFps, e.detail.value)
                    setTempFps(e.detail.value)
                  }}
                  value={fps}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonToggle
                  checked={exact}
                  onIonChange={(e) => setExact(e.detail.checked)}
                >
                  Finish exactly on end age
                </IonToggle>
              </IonItem>
            </IonCol>
          </IonRow>
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonToggle
                  checked={loop}
                  onIonChange={(e) => setLoop(e.detail.checked)}
                >
                  Loop
                </IonToggle>
              </IonItem>
            </IonCol>
          </IonRow>
          {/********************************************/}
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Caching</IonLabel>

                <IonButton
                  onClick={async () => {
                    await getCacheStatsData()
                    setCacheInfoShow(true)
                  }}
                  size="small"
                >
                  Open Caching Dialog
                </IonButton>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonList>
    </div>
  )
}
