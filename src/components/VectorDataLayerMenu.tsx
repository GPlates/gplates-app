import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonItem,
  IonLabel,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from '@ionic/react'
import { vectorData } from '../functions/DataLoader'
import React, { useEffect } from 'react'
import { timeout } from 'workbox-core/_private'
import { useRecoilState } from 'recoil'
import { isVectorMenuShow } from '../functions/atoms'
import { WebMapTileServiceImageryProvider } from 'cesium'
import { cesiumViewer } from '../pages/Main'
import { gplates_coastlines } from '../functions/DataLoader'

interface ContainerProps {
  checkedVectorData: { [key: string]: WebMapTileServiceImageryProvider }
  setVectorData: Function
  addLayer: Function
  removeLayer: Function
  isViewerLoading: Function
}

export const VectorDataLayerMenu: React.FC<ContainerProps> = ({
  checkedVectorData,
  setVectorData,
  addLayer,
  removeLayer,
  isViewerLoading,
}) => {
  const [isShow, setIsShow] = useRecoilState(isVectorMenuShow)
  const [present, dismiss] = useIonLoading()

  const waitUntilLoaded = async () => {
    await timeout(500)
    while (!isViewerLoading()) {
      await timeout(500)
    }
  }

  const onCheckBoxChange = async (val: any) => {
    const name: string = val.detail.value
    const isChecked = val.detail.checked

    if (isChecked) {
      checkedVectorData[name] = addLayer(vectorData[name])
      setVectorData(checkedVectorData)
    } else {
      removeLayer(checkedVectorData[name])
      delete checkedVectorData[name]
      setVectorData(checkedVectorData)
    }
  }

  const checkboxList: any[] = []
  const vectorDataName = Object.keys(vectorData)
  for (let i = 0; i < vectorDataName.length; i++) {
    checkboxList.push({
      val: vectorDataName[i],
      isChecked: vectorDataName[i] in checkedVectorData,
    })
  }
  return (
    <IonModal isOpen={isShow} animated backdropDismiss={false}>
      <IonToolbar>
        <IonTitle>Vector Data Layers</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={async () => {
              await present({ message: 'Please Wait...' })
              await waitUntilLoaded()
              await dismiss()
              setIsShow(false)
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
        {checkboxList.map(({ val, isChecked }, i) => (
          <IonItem key={i}>
            <IonLabel>{val}</IonLabel>
            <IonCheckbox
              slot="end"
              value={val}
              checked={isChecked}
              onIonChange={onCheckBoxChange}
            />
          </IonItem>
        ))}
      </IonContent>
    </IonModal>
  )
}
