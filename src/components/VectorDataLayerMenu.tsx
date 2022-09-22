import { SingleTileImageryProvider, Viewer } from 'cesium'
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
  age,
} from '../functions/atoms'
import { WebMapTileServiceImageryProvider } from 'cesium'
import rasterMaps from '../functions/rasterMaps'
import { VectorLayerType } from '../functions/types'
import { getVectorLayers } from '../functions/vectorLayers'
import { cachingServant } from '../functions/cache'
import { cesiumViewer } from '../functions/cesiumViewer'
import { buildAnimationURL } from '../functions/util'

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
  const rAge = useRecoilValue(age)

  //
  const getVecInfoByRaster = async (rasterModel: string) => {
    let responseJson = getVectorLayers(rasterModel)
    vectorLayers = []
    for (let key in responseJson) {
      let p = createCesiumImageryProvider(
        responseJson[key].url,
        responseJson[key].layer.replace('{{time}}', String(rAge)),
        responseJson[key].style
      )

      let layer = {
        imageryLayer: null,
        layerProvider: p,
        layerName: key,
        layer: responseJson[key].layer,
        url: responseJson[key].url,
        wmsUrl: responseJson[key].wmsUrl,
        style: responseJson[key].style,
        checked: false,
      }
      vectorLayers.push(layer) //add the new layer into the vector layer list
    }
    console.log(vectorLayers)
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

    getVecInfoByRaster(model)
  }

  // update to corresponding vector layer when raster map changes
  useEffect(() => {
    vectorLayers = []
  }, [currentRasterMapIndex])

  // initializing
  useEffect(() => {
    //updateVectorDataInformation()
  }, [])

  useEffect(() => {
    updateVectorLayers(rAge)
  }, [rAge])

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

  if (isShow && vectorLayers.length === 0) updateVectorDataInformation()

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

//
const updateVectorLayers = (rAge: number) => {
  try {
    //not working this way
    //try request multiple layers in one request
    //the layers need to be in the same workspace
    /*
    vectorLayers.forEach(async (layer) => {
      if (layer.checked) {
        let url = buildAnimationURL(layer.wmsUrl, layer.layer)
        let dataURL: string = await cachingServant.getCachedRequest(
          url.replace('{{time}}', String(rAge)) + '&transparent=true'
        )
        console.log(url.replace('{{time}}', String(rAge)))
        //only do this when the dataURL is valid
        if (dataURL.length > 0) {
          const provider = new SingleTileImageryProvider({
            url: dataURL,
          })
          cesiumViewer.imageryLayers.addImageryProvider(provider)
        }
      }
    })*/
  } catch (err) {
    console.log(err)
  }
}
