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
import {
  createCesiumImageryProvider,
  vectorData,
} from '../functions/DataLoader'
import React, { useEffect, useState } from 'react'
import { timeout } from 'workbox-core/_private'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  currentRasterMapIndexState,
  isVectorMenuShow,
  rasterMapState,
} from '../functions/atoms'
import { WebMapTileServiceImageryProvider } from 'cesium'
import rasterMaps from '../functions/rasterMaps'

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
  const currentRasterMapIndex = useRecoilValue(currentRasterMapIndexState)
  const [checkboxList, setCheckBoxList] = useState(new Map<String, boolean>())
  const [vecDataProviderMap, setVecDataProviderMap] = useState(vectorData)
  const rasterMapInfo = useRecoilValue(rasterMapState)

  const getVecInfoByRaster = async (rasterModel: String) => {
    let response = await (
      await fetch(
        'https://gws.gplates.org/mobile/get_vector_layers?model=' + rasterModel
      )
    ).json()
    let vecDataMap: {
      [key: string]: WebMapTileServiceImageryProvider
    } = {}
    for (let key in response) {
      vecDataMap[key] = createCesiumImageryProvider(
        response[key].url,
        response[key].layer
      )
    }
    return vecDataMap
  }

  function removeAllVectorLayer() {
    for (let layer in checkedVectorData) {
      let curLayer = checkedVectorData[layer]
      removeLayer(curLayer)
    }
    setVectorData({})
  }

  function updateVectorDataInformation(
    checkedFunction: (input: number) => boolean
  ) {
    let model
    if (rasterMaps[currentRasterMapIndex] != undefined) {
      model = rasterMaps[currentRasterMapIndex].model
    } else {
      // default invoking
      model = rasterMapInfo[currentRasterMapIndex].model
    }
    if (model === undefined) {
      // no model info, no update
      return
    }
    removeAllVectorLayer()
    getVecInfoByRaster(model).then((vecDataMap) => {
      setVecDataProviderMap(vecDataMap)
      const tempCheckboxList: Map<string, boolean> = new Map()
      const vectorDataName = Object.keys(vecDataMap)
      for (let i = 0; i < vectorDataName.length; i++) {
        // initially load coastlines vector data for Geology
        // i == 0 means coastlines for Geology
        tempCheckboxList.set(vectorDataName[i], checkedFunction(i))
      }
      setCheckBoxList(tempCheckboxList)
    })
  }

  // update to corresponding vector layer when raster map changes
  useEffect(() => {
    updateVectorDataInformation((idx) => false)
  }, [currentRasterMapIndex])

  // initializing
  useEffect(() => {
    updateVectorDataInformation((idx) => {
      return idx == 0
    })
  }, [])

  const waitUntilLoaded = async () => {
    await timeout(100)
    while (!isViewerLoading()) {
      await timeout(500)
    }
  }

  // check or uncheck target vector layer
  const checkLayer = (name: string, isChecked: boolean) => {
    if (isChecked) {
      checkedVectorData[name] = addLayer(vecDataProviderMap[name])
      setVectorData(checkedVectorData)
    } else {
      removeLayer(checkedVectorData[name])
      delete checkedVectorData[name]
      setVectorData(checkedVectorData)
    }
  }

  const onCheckBoxChange = (val: any) => {
    const name: string = val.detail.value
    const isChecked = val.detail.checked
    checkboxList.set(name, isChecked)
    setCheckBoxList(checkboxList)
    checkLayer(name, isChecked)
  }

  const generateCheckList = () => {
    let count = 0
    let checkList: JSX.Element[] = []
    checkboxList.forEach((isChecked, name, map) => {
      checkList.push(
        <IonItem key={count}>
          <IonLabel>{name}</IonLabel>
          <IonCheckbox
            slot="end"
            value={name}
            checked={isChecked}
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
