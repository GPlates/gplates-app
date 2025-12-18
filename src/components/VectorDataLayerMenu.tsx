import { ImageryLayer } from 'cesium'
import {
  IonCheckbox,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
  IonIcon,
} from '@ionic/react'
import { createCesiumImageryProvider } from '../functions/cesiumViewer'
import React, { useEffect } from 'react'
import { closeCircleOutline } from 'ionicons/icons'
import {
  useAppState,
  useAppStateValue,
  useSetAppState,
} from '../functions/appStates'
import {
  currentRasterIDState,
  isVectorMenuShow,
  ageState,
  showCities,
} from '../functions/appStates'

import { VectorLayerType } from '../functions/types'
import {
  getVectorLayers,
  enableLayer,
  getEnabledLayers,
  disableLayer,
} from '../functions/vectorLayers'
import { cesiumViewer, currentVectorLayers } from '../functions/cesiumViewer'
import './VectorDataLayerMenu.scss'

// only for this GUI component
// a list of vector layers for the current basemap
let vectorLayers: VectorLayerType[] = []

// indicate if the cities has been enabled
let cityEnabledFlag = false

/**
 * given the layer's ID, update the cesium ImageryLayer object
 *
 * @param layerID
 * @param imageryLayer
 */
export const updateImageryLayer = (layerID: string, imageryLayer: any) => {
  for (let i = 0; i < vectorLayers.length; i++) {
    if (vectorLayers[i].id === layerID) {
      let layer = vectorLayers[i]
      if (layer) {
        layer.imageryLayer = imageryLayer
      }
      break
    }
  }
}

interface ContainerProps {}

/**
 *
 * @param param0
 * @returns
 */
export const VectorDataLayerMenu: React.FC<ContainerProps> = ({}) => {
  const [isShow, setIsShow] = useAppState(isVectorMenuShow)
  const currentRasterID = useAppStateValue(currentRasterIDState)
  const rAge = useAppStateValue(ageState)
  const setShowCities = useSetAppState(showCities)

  /**
   * draw all enabled vector layers
   */
  const drawEnabledVectorLayers = () => {
    let enabledLayers = getEnabledLayers(currentRasterID)
    currentVectorLayers.length = 0
    for (let i = 0; i < vectorLayers.length; i++) {
      if (enabledLayers.includes(vectorLayers[i].id)) {
        let imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          createCesiumImageryProvider(vectorLayers[i], 0), //time=0
        )
        vectorLayers[i].imageryLayer = imageryLayer
        currentVectorLayers.push(imageryLayer)
      }
    }
  }

  /**
   * prepare the vectorLayers array
   */
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

  /**
   * when current raster is changed, populate the vectorLayers array
   */
  useEffect(() => {
    prepareVectorLayers()
    drawEnabledVectorLayers()
  }, [currentRasterID])

  /**
   * initializing
   */
  useEffect(() => {}, [])

  /**
   * when any vector layer checkbox changed
   *
   * @param checkbox
   */
  const onCheckBoxChange = (checkbox: any) => {
    let layer = vectorLayers[checkbox.detail.value]
    layer.checked = checkbox.detail.checked

    let isChecked = layer.checked
    if (isChecked) {
      if (layer.imageryLayer === null) {
        layer.imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          createCesiumImageryProvider(layer, rAge),
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

    //update current vector layers
    currentVectorLayers.length = 0
    for (let i = 0; i < vectorLayers.length; i++) {
      if (vectorLayers[i].checked) {
        currentVectorLayers.push(vectorLayers[i].imageryLayer)
      }
    }
  }

  /**
   * callback when cities checkbox changed
   *
   * @param checkbox
   */
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
                <IonCheckbox
                  value="0"
                  checked={cityEnabledFlag}
                  onIonChange={onCitiesCheckBoxChange}
                >
                  Cities
                </IonCheckbox>
              </IonItem>
            </div>
            {vectorLayers.map((layer, index) => {
              return (
                <div slot="content" key={index}>
                  <IonItem>
                    <IonCheckbox
                      value={index}
                      checked={layer.checked}
                      onIonChange={onCheckBoxChange}
                    >
                      {layer.displayName}
                    </IonCheckbox>
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
