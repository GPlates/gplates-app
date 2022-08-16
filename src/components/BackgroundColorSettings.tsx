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
import { AppPreferences } from '@awesome-cordova-plugins/app-preferences'
import { BackgroundService } from '../functions/background'

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
    AppPreferences.store('settings', 'background', settings)
  }, [
    isBackgroundSettingEnable,
    isStarryBackgroundEnable,
    isCustomisedColorBackgroundEnable,
    color,
  ])

  return (
    <div>
      <IonItem>
        <IonLabel>Customized Background</IonLabel>
        <IonToggle
          checked={isBackgroundSettingEnable}
          onIonChange={(e) => {
            setIsBackgroundSettingEnable(!isBackgroundSettingEnable)
          }}
        />
      </IonItem>
      <IonItem
        disabled={!isBackgroundSettingEnable || isStarryBackgroundEnable}
      >
        <IonLabel>Single Colour Background</IonLabel>
        <IonToggle
          checked={isCustomisedColorBackgroundEnable}
          onIonChange={() => {
            setIsCustomisedColorBackgroundEnable(
              !isCustomisedColorBackgroundEnable
            )
          }}
        />
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
        <IonLabel>Starry Background</IonLabel>
        <IonToggle
          checked={isStarryBackgroundEnable}
          onIonChange={() => {
            setIsStarryBackgroundEnable(!isStarryBackgroundEnable)
          }}
        />
      </IonItem>
    </div>
  )
}
