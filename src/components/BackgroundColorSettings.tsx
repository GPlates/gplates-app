import { IonItem, IonLabel, IonToggle } from '@ionic/react'
import React, { useEffect } from 'react'
import { RgbColorPicker } from 'react-colorful'
import { useRecoilState } from 'recoil'
import {
  backgroundColor,
  backgroundIsCustom,
  backgroundIsEnabled,
  backgroundIsStarry,
} from '../functions/atoms'
import { BackgroundService } from '../functions/background'
import { Preferences } from '@capacitor/preferences'

interface ContainerProps {
  backgroundService: BackgroundService
}

export const BackgroundColorSettings: React.FC<ContainerProps> = ({
  backgroundService,
}) => {
  const [isBackgroundSettingEnable, setIsBackgroundSettingEnable] =
    useRecoilState(backgroundIsEnabled)
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] =
    useRecoilState(backgroundIsStarry)
  const [
    isCustomisedColorBackgroundEnable,
    setIsCustomisedColorBackgroundEnable,
  ] = useRecoilState(backgroundIsCustom)
  const [color, setColor] = useRecoilState(backgroundColor)

  useEffect(() => {
    backgroundService.changeBackground()
    // Save settings on each change
    const settings = {
      isBackgroundSettingEnable,
      isStarryBackgroundEnable,
      isCustomisedColorBackgroundEnable,
      color,
    }
    Preferences.set({
      key: 'backgroundSettings',
      value: JSON.stringify(settings),
    })
  }, [
    isBackgroundSettingEnable,
    isStarryBackgroundEnable,
    isCustomisedColorBackgroundEnable,
    color,
  ])

  return (
    <div style={{ height: '100%' }}>
      <IonItem>
        <IonToggle
          checked={isBackgroundSettingEnable}
          onIonChange={(e) => {
            setIsBackgroundSettingEnable(!isBackgroundSettingEnable)
          }}
        >
          Customized Background
        </IonToggle>
      </IonItem>
      <IonItem
        disabled={!isBackgroundSettingEnable || isStarryBackgroundEnable}
      >
        <IonToggle
          checked={isCustomisedColorBackgroundEnable}
          onIonChange={() => {
            setIsCustomisedColorBackgroundEnable(
              !isCustomisedColorBackgroundEnable,
            )
          }}
        >
          Single Colour Background
        </IonToggle>
      </IonItem>
      <IonItem
        disabled={
          !isCustomisedColorBackgroundEnable ||
          isStarryBackgroundEnable ||
          !isBackgroundSettingEnable
        }
      >
        <IonLabel>Color Picker</IonLabel>
        <RgbColorPicker
          color={color}
          onChange={(newColor) => {
            setColor(newColor)
          }}
        />
      </IonItem>
      <IonItem disabled={!isBackgroundSettingEnable}>
        <IonToggle
          checked={isStarryBackgroundEnable}
          onIonChange={() => {
            setIsStarryBackgroundEnable(!isStarryBackgroundEnable)
          }}
        >
          Starry Background
        </IonToggle>
      </IonItem>
    </div>
  )
}
