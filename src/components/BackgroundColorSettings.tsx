import { IonItem, IonItemDivider, IonLabel, IonToggle } from '@ionic/react'
import React, { useState } from 'react'
import { HexColorPicker } from "react-colorful";


export const BackgroundColorSettings: React.FC = () => {
  // background parameters
  const [isBackgroundSettingEnable, setIsBackgroundSettingEnable] = useState(false)
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] = useState(false)
  const [isCustomisedColorBackgroundEnable, setIsCustomisedColorBackgroundEnable] = useState(false)
  const [color, setColor] = useState("#aabbcc");

  return (
    <div>
      <IonItemDivider>Background Settings</IonItemDivider>
      <IonItem>
        <IonLabel>Customized Background</IonLabel>
        <IonToggle checked={isBackgroundSettingEnable}
                   onIonChange={(e) => {
                     setIsBackgroundSettingEnable(!isBackgroundSettingEnable)
                   }} />
      </IonItem>
      <IonItem disabled={!isBackgroundSettingEnable || isStarryBackgroundEnable}>
        <IonLabel>Pure Color Background</IonLabel>
        <IonToggle checked={isCustomisedColorBackgroundEnable}
                   onIonChange={() => {
                     setIsCustomisedColorBackgroundEnable(!isCustomisedColorBackgroundEnable)
                   }}
        />
      </IonItem>
      <IonItem
        disabled={!isCustomisedColorBackgroundEnable || isStarryBackgroundEnable || !isBackgroundSettingEnable}>
        <IonLabel>Color Picker</IonLabel>
        <HexColorPicker color={color} onChange={setColor} />
      </IonItem>
      <IonItem disabled={!isBackgroundSettingEnable}>
        <IonLabel>Starry Background</IonLabel>
        <IonToggle
          checked={isStarryBackgroundEnable}
          onIonChange={() => {
            setIsStarryBackgroundEnable(!isStarryBackgroundEnable)
          }} />
      </IonItem>
    </div>
  )
}