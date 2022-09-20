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
import rasterMaps from '../functions/rasterMaps'
import { useRecoilState } from 'recoil'
import {
  isCacheInfoShowState,
  currentRasterMapIndexState,
} from '../functions/atoms'

interface ContainerProps {}

export const CacheInfo: React.FC<ContainerProps> = () => {
  const [cacheInfoShow, setCacheInfoShow] = useRecoilState(isCacheInfoShowState)
  const [currentRasterMapIndex, setCurrentRasterMapIndex] = useRecoilState(
    currentRasterMapIndexState
  )

  let listMap = {
    Model: rasterMaps.length > 0 ? rasterMaps[currentRasterMapIndex].model : '',
    Raster:
      rasterMaps.length > 0 ? rasterMaps[currentRasterMapIndex].layerName : '',
    End: rasterMaps.length > 0 ? rasterMaps[currentRasterMapIndex].endTime : '',
    Start:
      rasterMaps.length > 0 ? rasterMaps[currentRasterMapIndex].startTime : '',
    WMTS: rasterMaps.length > 0 ? rasterMaps[currentRasterMapIndex].url : '',
    WMS: rasterMaps.length > 0 ? rasterMaps[currentRasterMapIndex].wmsUrl : '',
  }

  return (
    <IonModal isOpen={cacheInfoShow} animated backdropDismiss={false}>
      <IonToolbar>
        <IonTitle>Cache Information</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              setCacheInfoShow(false)
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
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
