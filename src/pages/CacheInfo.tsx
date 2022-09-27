import React, { useState, useEffect } from 'react'
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
import { cachingServant } from '../functions/cache'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isCacheInfoShowState } from '../functions/atoms'

export let cacheStatsList: Map<string, number> = new Map<string, number>()

export const getData = async () => {
  //let currentRaster = rasterMaps[currentRasterIndex]
  let data = await cachingServant.getCount()
  cacheStatsList.set('All', data)

  //
  rasterMaps.forEach(async (raster) => {
    data = await cachingServant.getCount(raster.layerName)
    cacheStatsList.set(raster.layerName, data)
  })
}

interface ContainerProps {}

export const CacheInfo: React.FC<ContainerProps> = () => {
  const [cacheInfoShow, setCacheInfoShow] = useRecoilState(isCacheInfoShowState)
  const [refresh, setRefresh] = useState(true)

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
        <IonItem>
          <IonLabel class="cache-db-label">Cache DB </IonLabel>
          <IonNote slot="end">DB name goes here</IonNote>
        </IonItem>
        <IonList>
          {Array.from(cacheStatsList).map((value) => (
            <IonItem key={value[0]}>
              <IonLabel>{value[0]} </IonLabel>
              <IonNote slot="end">{value[1]}</IonNote>
            </IonItem>
          ))}
        </IonList>
        <div>
          <IonButton
            expand="full"
            shape="round"
            onClick={async () => {
              await getData()
              setRefresh(!refresh)
            }}
            color={'tertiary'}
          >
            Refresh
            <IonRippleEffect />
          </IonButton>
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
