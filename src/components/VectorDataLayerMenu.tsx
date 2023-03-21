import { ImageryLayer } from 'cesium'
import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
  IonIcon,
} from '@ionic/react'
import { createCesiumImageryProvider } from '../functions/dataLoader'
import React, { useEffect } from 'react'
import { closeCircleOutline } from 'ionicons/icons'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currentRasterIDState,
  isVectorMenuShow,
  age,
  showCities,
} from '../functions/atoms'

import { VectorLayerType } from '../functions/types'
import {
  getVectorLayers,
  enableLayer,
  getEnabledLayers,
  disableLayer,
} from '../functions/vectorLayers'
import { cesiumViewer } from '../functions/cesiumViewer'
import './VectorDataLayerMenu.scss'

//only for this GUI component
let vectorLayers: VectorLayerType[] = []

let cityEnabledFlag = false

//
// given the layer's ID, update the cesium ImageryLayer object
//
export const updateImageryLayer = (layerID: string, imageryLayer: any) => {
  let layer: any = null
  for (let i = 0; i < vectorLayers.length; i++) {
    if (vectorLayers[i].id === layerID) {
      layer = vectorLayers[i]
      break
    }
  }
  //console.log(layer)
  if (layer) {
    if (layer.imageryLayer) {
      cesiumViewer.imageryLayers.remove(layer.imageryLayer)
    }
    layer.imageryLayer = imageryLayer
  }
}

interface ContainerProps {}

export const VectorDataLayerMenu: React.FC<ContainerProps> = ({}) => {
  const [isShow, setIsShow] = useRecoilState(isVectorMenuShow)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const rAge = useRecoilValue(age)
  const setShowCities = useSetRecoilState(showCities)

  //
  // draw all enabled vector layers
  //
  const drawEnabledVectorLayers = () => {
    let enabledLayers = getEnabledLayers(currentRasterID)

    for (let i = 0; i < vectorLayers.length; i++) {
      if (enabledLayers.includes(vectorLayers[i].id)) {
        let imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          createCesiumImageryProvider(vectorLayers[i], 0) //time=0
        )
        vectorLayers[i].imageryLayer = imageryLayer
      }
    }
  }

  //
  // prepare the vectorLayers array
  //
  const prepareVectorLayers = () => {
    //find out all the vector layers defined for the current raster
    let layers = getVectorLayers(currentRasterID)
    vectorLayers = []
    for (let key in layers) {
      let layer = {
        id: key,
        displayName: layers[key].displayName,
        imageryLayer: null as unknown as ImageryLayer,
        layerName: layers[key].layerName,
        url: layers[key].url,
        wmsUrl: layers[key].wmsUrl,
        style: layers[key].style,
        checked: false,
      }
      //find out all enabled vector layers and set the flags
      let checkedLayers = getEnabledLayers(currentRasterID)
      if (checkedLayers.includes(layer.id)) {
        layer.checked = true
      } else {
        layer.checked = false
      }
      if (checkedLayers.includes('cities')) {
        cityEnabledFlag = true
      } else {
        cityEnabledFlag = false
      }

      vectorLayers.push(layer)
    }
  }

  //
  // when current raster is changed, populate the vectorLayers array
  //
  useEffect(() => {
    prepareVectorLayers()
    drawEnabledVectorLayers()
  }, [currentRasterID])

  //
  // initializing
  //
  useEffect(() => {}, [])

  //
  // when any vector layer checkbox changed
  //
  const onCheckBoxChange = (checkbox: any) => {
    let layer = vectorLayers[checkbox.detail.value]
    layer.checked = checkbox.detail.checked

    let isChecked = layer.checked
    if (isChecked) {
      if (layer.imageryLayer === null) {
        layer.imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          createCesiumImageryProvider(layer, rAge)
        )
      }
      enableLayer(currentRasterID, layer.id)
    } else {
      if (layer.imageryLayer) {
        cesiumViewer.imageryLayers.remove(layer.imageryLayer)
        layer.imageryLayer = null
      }
      disableLayer(currentRasterID, layer.id)
    }
  }

  //
  // callback when cities checkbox changed
  //
  const onCitiesCheckBoxChange = (checkbox: any) => {
    setShowCities(checkbox.detail.checked)

    if (checkbox.detail.checked) {
      enableLayer(currentRasterID, 'cities')
    } else {
      disableLayer(currentRasterID, 'cities')
    }
    cityEnabledFlag = checkbox.detail.checked
  }

  // in case vectorLayers was not ready, but the widget wants to show ifself
  if (isShow && vectorLayers.length === 0) prepareVectorLayers()

  return (
    <div
      className={isShow ? 'overlay-container show' : 'overlay-container hide'}
    >
      <div className={isShow ? 'overlay-widget show' : 'overlay-widget hide'}>
        <div className="overlay-close-button-container">
          <IonIcon
            className="overlay-close-button"
            icon={closeCircleOutline}
            size="large"
            onClick={() => {
              setIsShow(false)
            }}
          />
        </div>
        <IonAccordionGroup value="first">
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel>Overlays</IonLabel>
            </IonItem>
            <div slot="content">
              <IonItem>
                <IonLabel>Major Cities</IonLabel>
                <IonCheckbox
                  slot="end"
                  value="0"
                  checked={cityEnabledFlag}
                  onIonChange={onCitiesCheckBoxChange}
                />
              </IonItem>
            </div>
            {vectorLayers.map((layer, index) => {
              return (
                <div slot="content" key={index}>
                  <IonItem>
                    <IonLabel>{layer.displayName}</IonLabel>
                    <IonCheckbox
                      slot="end"
                      value={index}
                      checked={layer.checked}
                      onIonChange={onCheckBoxChange}
                    />
                  </IonItem>
                </div>
              )
            })}
          </IonAccordion>
        </IonAccordionGroup>
        {/*<IonButton
          expand="full"
          className="close-button"
          slot={'end'}
          color="tertiary"
          size="small"
          onClick={() => {
            setIsShow(false)
          }}
        >
          Close
        </IonButton>*/}
      </div>
    </div>
  )
}
