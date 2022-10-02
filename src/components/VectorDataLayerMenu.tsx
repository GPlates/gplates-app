import { SingleTileImageryProvider, Viewer, ImageryLayer } from 'cesium'
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
  IonAccordionGroup,
  IonAccordion,
  useIonLoading,
  IonIcon,
} from '@ionic/react'
import {
  locateOutline,
  trashOutline,
  informationOutline,
  closeOutline,
} from 'ionicons/icons'
import { createCesiumImageryProvider } from '../functions/dataLoader'
import React, { useEffect, useState } from 'react'
import { timeout } from '../functions/util'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currentRasterMapIndexState,
  isVectorMenuShow,
  age,
  showCities,
} from '../functions/atoms'
import rasterMaps from '../functions/rasterMaps'
import { VectorLayerType } from '../functions/types'
import {
  getVectorLayers,
  enableLayer,
  getEnabledLayers,
  disableLayer,
} from '../functions/vectorLayers'
import { cachingServant } from '../functions/cache'
import { cesiumViewer } from '../functions/cesiumViewer'
import { buildAnimationURL } from '../functions/util'
import './VectorDataLayerMenu.scss'

//only for this GUI component
let vectorLayers: VectorLayerType[] = []

interface ContainerProps {}

export const VectorDataLayerMenu: React.FC<ContainerProps> = ({}) => {
  const [isShow, setIsShow] = useRecoilState(isVectorMenuShow)
  const currentRasterMapIndex = useRecoilValue(currentRasterMapIndexState)
  const rAge = useRecoilValue(age)
  const setShowCities = useSetRecoilState(showCities)

  //
  const getVecInfoByRaster = async (rasterModel: string) => {
    let responseJson = getVectorLayers(rasterModel)
    vectorLayers = []
    for (let key in responseJson) {
      let p = createCesiumImageryProvider(responseJson[key], rAge)

      let layer = {
        displayName: responseJson[key].displayName,
        imageryLayer: null as unknown as ImageryLayer,
        layerProvider: p,
        layerName: key,
        layer: responseJson[key].layer,
        url: responseJson[key].url,
        wmsUrl: responseJson[key].wmsUrl,
        style: responseJson[key].style,
        checked: false,
      }
      let checkedLayers = getEnabledLayers(currentRasterMapIndex)
      if (checkedLayers.includes(layer.layerName)) {
        layer.checked = true
        layer.imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(p)
      }
      vectorLayers.push(layer) //add the new layer into the vector layer list
    }
    //console.log(vectorLayers)
  }

  //
  function removeAllVectorLayer() {
    vectorLayers.forEach((layer) => {
      cesiumViewer.imageryLayers.remove(layer.imageryLayer)
      layer.imageryLayer = null
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

  // check or uncheck target vector layer
  const checkLayer = (layer: VectorLayerType, isChecked: boolean) => {
    if (isChecked) {
      if (layer.imageryLayer === null) {
        layer.imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          layer.layerProvider
        )
      }
      enableLayer(currentRasterMapIndex, layer.layerName)
    } else {
      if (layer.imageryLayer) {
        cesiumViewer.imageryLayers.remove(layer.imageryLayer)
        layer.imageryLayer = null
      }
      disableLayer(currentRasterMapIndex, layer.layerName)
    }
  }

  //
  const onCheckBoxChange = (val: any) => {
    //console.log(val)
    let layer = vectorLayers[val.detail.value]
    layer.checked = val.detail.checked
    checkLayer(layer, layer.checked)
  }

  const onCitiesCheckBoxChange = (val: any) => {
    setShowCities(val.detail.checked)
  }

  if (isShow && vectorLayers.length === 0) updateVectorDataInformation()

  return (
    <div
      className={isShow ? 'overlay-container show' : 'overlay-container hide'}
    >
      <div className={isShow ? 'overlay-widget show' : 'overlay-widget hide'}>
        <IonAccordionGroup value="first">
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel>Add Overlays</IonLabel>
            </IonItem>
            <div slot="content" key="cities">
              <IonItem>
                <IonLabel>Major Cities</IonLabel>
                <IonCheckbox
                  slot="end"
                  value="999"
                  checked={false}
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
        <IonButton
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
        </IonButton>
      </div>
    </div>
  )
}

//do not remove the code below
//keep these code commented here for future reference
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
