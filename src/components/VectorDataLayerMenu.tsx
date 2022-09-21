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
import { createCesiumImageryProvider } from '../functions/dataLoader'
import React, { useEffect, useState } from 'react'
import { timeout } from '../functions/util'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  currentRasterMapIndexState,
  isVectorMenuShow,
} from '../functions/atoms'
import { WebMapTileServiceImageryProvider } from 'cesium'
import rasterMaps from '../functions/rasterMaps'
import { serverURL } from '../functions/settings'
import { VectorLayerType } from '../functions/types'

let vectorLayers: VectorLayerType[] = []

interface ContainerProps {
  addLayer: Function
  removeLayer: Function
  isViewerLoading: Function
}

export const VectorDataLayerMenu: React.FC<ContainerProps> = ({
  addLayer,
  removeLayer,
  isViewerLoading,
}) => {
  const [isShow, setIsShow] = useRecoilState(isVectorMenuShow)
  const [present, dismiss] = useIonLoading()
  const currentRasterMapIndex = useRecoilValue(currentRasterMapIndexState)

  //
  const getVecInfoByRaster = async (rasterModel: String) => {
    let response = await fetch(
      serverURL.replace(/\/+$/, '') +
        '/mobile/get_vector_layers?model=' +
        rasterModel
    ).catch((error) => {
      console.log(error) //handle the promise rejection
    })

    let vecDataMap: {
      [key: string]: WebMapTileServiceImageryProvider
    } = {}

    if (response) {
      let responseJson = await response.json().catch((error) => {
        console.log(error) //handle the promise rejection
      })
      vectorLayers = []
      for (let key in responseJson) {
        let p = createCesiumImageryProvider(
          responseJson[key].url,
          responseJson[key].layer,
          responseJson[key].style
        )
        vecDataMap[key] = p

        let layer = {
          imageryLayer: null,
          layerProvider: p,
          layerName: key,
          url: responseJson[key].url,
          wmsUrl: '',
          style: responseJson[key].style,
          checked: false,
        }
        vectorLayers.push(layer) //add the new layer into the vector layer list
      }
    }
    return vecDataMap
  }

  //
  function removeAllVectorLayer() {
    vectorLayers.forEach((layer) => {
      removeLayer(layer.imageryLayer)
    })
    vectorLayers = []
  }

  //update the vector layer list when the current raster has changed
  function updateVectorDataInformation() {
    //get the current model name. if no avaible, give it a default model
    let model = rasterMaps[currentRasterMapIndex]?.model ?? 'MERDITH2021'

    removeAllVectorLayer()

    getVecInfoByRaster(model).then((vecDataMap) => {
      console.log(vecDataMap)
    })
  }

  // update to corresponding vector layer when raster map changes
  useEffect(() => {
    updateVectorDataInformation()
  }, [currentRasterMapIndex])

  // initializing
  useEffect(() => {
    updateVectorDataInformation()
  }, [])

  //
  const waitUntilLoaded = async () => {
    await timeout(100)
    while (!isViewerLoading()) {
      await timeout(500)
    }
  }

  // check or uncheck target vector layer
  const checkLayer = (layer: VectorLayerType, isChecked: boolean) => {
    if (isChecked) {
      layer.imageryLayer = addLayer(layer.layerProvider)
    } else {
      removeLayer(layer.imageryLayer)
      layer.imageryLayer = null
    }
  }

  //
  const onCheckBoxChange = (val: any) => {
    let layer = vectorLayers[val.detail.value]
    layer.checked = val.detail.checked
    checkLayer(layer, layer.checked)
  }

  //build the checklist
  const generateCheckList = () => {
    let count = 0
    let checkList: JSX.Element[] = []
    vectorLayers.forEach((layer, index) => {
      checkList.push(
        <IonItem key={count}>
          <IonLabel>{layer.layerName}</IonLabel>
          <IonCheckbox
            slot="end"
            value={index}
            checked={layer.checked}
            onIonChange={onCheckBoxChange}
          />
        </IonItem>
      )
      count += 1
    })
    return checkList
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
      <IonContent>{generateCheckList()}</IonContent>
    </IonModal>
  )
}
