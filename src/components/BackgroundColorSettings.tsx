import { IonItem, IonItemDivider, IonLabel, IonToggle } from '@ionic/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { RgbColorPicker  } from "react-colorful";
import { Viewer } from 'cesium'
import * as Cesium from 'cesium'

const defaultBackground = () => {
  return new Cesium.SkyBox({
    sources : {
      positiveX : 'cesium/Assets/Textures/SkyBox/tycho2t3_80_px.jpg',
      negativeX : 'cesium/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg',
      positiveY : 'cesium/Assets/Textures/SkyBox/tycho2t3_80_py.jpg',
      negativeY : 'cesium/Assets/Textures/SkyBox/tycho2t3_80_my.jpg',
      positiveZ : 'cesium/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg',
      negativeZ : 'cesium/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg'
    }
  })
}

interface ContainerProps {
  viewer: Viewer
}

export const BackgroundColorSettings: React.FC<ContainerProps> = ({viewer}) => {
  // background parameters
  const [isBackgroundSettingEnable, setIsBackgroundSettingEnable] = useState(false)
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] = useState(false)
  const [isCustomisedColorBackgroundEnable, setIsCustomisedColorBackgroundEnable] = useState(false)
  const [color, setColor] = useState({ r: 255, g: 255, b: 255 });

  const setDefaultBackground = (viewer: Viewer) => {
    viewer.scene.skyBox = defaultBackground()
  }

  const changeBackground = () => {
    if(isBackgroundSettingEnable) {
      viewer.scene.skyBox = new Cesium.SkyBox({})
      if(isStarryBackgroundEnable) {
        viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT
      }
      else if(isCustomisedColorBackgroundEnable) {
        viewer.scene.backgroundColor = new Cesium.Color(color.r/255, color.g/255, color.b/255)
      }
    }
    else {
      setDefaultBackground(viewer)
    }
  }

  useEffect(() => {changeBackground()},
    [isBackgroundSettingEnable, isStarryBackgroundEnable, isCustomisedColorBackgroundEnable, color]
  )

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
        <RgbColorPicker color={color}
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
          }} />
      </IonItem>
    </div>
  )
}