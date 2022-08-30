import React from 'react'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
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

  let listMap = {
    Model: rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].model : '',
    Raster:
      rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].layerName : '',
    End: rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].endTime : '',
    Start:
      rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].startTime : '',
    'WMTS URL': rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].url : '',
    'WMS URL':
      rasterMaps.length > 0 ? rasterMaps[currentRasterIndex].wmsUrl : '',
  }

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
        <IonList>
          {Object.entries(listMap).map((value) => (
            <IonItem key={value[0]}>
              <IonLabel>{value[0]} </IonLabel>
              <IonNote slot="end">{value[1]}</IonNote>
            </IonItem>
          ))}
        </IonList>
        <div>TODO: put raster legend here!!!</div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </IonContent>
    </IonModal>
  )
}
