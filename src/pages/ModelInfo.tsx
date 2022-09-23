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
import rasterMaps from '../functions/rasterMaps'
import { serverURL } from '../functions/settings'
import { useRecoilState } from 'recoil'
import {
  isModelInfoShowState,
  isAboutPageShow,
  currentRasterMapIndexState,
} from '../functions/atoms'

interface ContainerProps {}

export const ModelInfo: React.FC<ContainerProps> = () => {
  const [modelInfoShow, setModelInfoShow] = useRecoilState(isModelInfoShowState)
  const [aboutPageShow, setAboutPageShow] = useRecoilState(isAboutPageShow)
  const [currentRasterMapIndex, setCurrentRasterMapIndex] = useRecoilState(
    currentRasterMapIndexState
  )

  let currentRaster = rasterMaps[currentRasterMapIndex]
  let rasterID = rasterMaps.length > 0 ? currentRaster.id : ''
  let listMap = {
    Model: rasterMaps.length > 0 ? currentRaster.model : '',
    Raster: rasterMaps.length > 0 ? currentRaster.layerName : '',
    End: rasterMaps.length > 0 ? currentRaster.endTime : '',
    Start: rasterMaps.length > 0 ? currentRaster.startTime : '',
    WMTS: rasterMaps.length > 0 ? currentRaster.url : '',
    WMS: rasterMaps.length > 0 ? currentRaster.wmsUrl : '',
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
        <div className="raster-legend">
          <img src={serverURL + '/static/app-legend/' + rasterID + '.png'} />
        </div>
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
