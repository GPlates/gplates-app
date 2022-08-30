import React from 'react'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './ModelInfo.scss'
import { Browser } from '@capacitor/browser'
import rasterMaps, { currentRasterIndex } from '../functions/rasterMaps'
import { useRecoilState } from 'recoil'
import { isModelInfoShowState, isAboutPageShow } from '../functions/atoms'

interface ContainerProps {}

export const ModelInfo: React.FC<ContainerProps> = () => {
  const [modelInfoShow, setModelInfoShow] = useRecoilState(isModelInfoShowState)
  const [aboutPageShow, setAboutPageShow] = useRecoilState(isAboutPageShow)
  return (
    <IonModal isOpen={modelInfoShow} animated backdropDismiss={false}>
      <IonToolbar>
        <IonTitle>Model Information</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              setModelInfoShow(false)
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
        <div>
          {rasterMaps.length > 0
            ? rasterMaps[currentRasterIndex].layerName
            : ''}
        </div>
        <div>
          {rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].model : ''}
        </div>
        <div className="open-about-page-button">
          <IonButton
            expand="full"
            shape="round"
            onClick={() => {
              setAboutPageShow(true)
            }}
            color={'tertiary'}
          >
            About The GPlates App And Contact Us
            <IonRippleEffect />
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}
