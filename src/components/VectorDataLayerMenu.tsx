import { ImageryLayer } from 'cesium'
import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
} from '@ionic/react'
import { createCesiumImageryProvider } from '../functions/dataLoader'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  currentRasterIDState,
  isVectorMenuShow,
  age,
  showCities,
} from '../functions/atoms'
import rasterMaps, {
  getRasterByID,
  getRasterIndexByID,
} from '../functions/rasterMaps'
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

//given the layer's ID, update the cesium ImageryLayer object
export const updateImageryLayer = (layerID: string, imageryLayer: any) => {
  let layer: any = null
  for (let i = 0; i < vectorLayers.length; i++) {
    if (vectorLayers[i].id === layerID) {
      layer = vectorLayers[i]
      break
    }
  }
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
  const [refresh, setRefresh] = useState(true)

  //get vector layers and draw them on Cesium globe
  const getVecInfoByRaster = async (rasterModel: string) => {
    let layers = getVectorLayers(rasterModel)
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

      let index = getRasterIndexByID(currentRasterID)
      let checkedLayers: string[] = []
      if (index) checkedLayers = getEnabledLayers(index)
      if (checkedLayers.includes(layer.layerName)) {
        layer.checked = true
        layer.imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          createCesiumImageryProvider(layers[key], rAge)
        )
      }
      if (checkedLayers.includes('cities')) {
        cityEnabledFlag = true
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
    let raster = getRasterByID(currentRasterID)
    if (!raster) return
    let model = raster.model ?? 'MERDITH2021'

    removeAllVectorLayer()

    getVecInfoByRaster(model)
  }

  // update to corresponding vector layer when raster map changes
  useEffect(() => {
    vectorLayers = []
    cityEnabledFlag = false
    setRefresh(!refresh)
  }, [currentRasterID])

  // initializing
  useEffect(() => {
    //updateVectorDataInformation()
  }, [])

  useEffect(() => {
    updateVectorLayers(rAge)
  }, [rAge])

  // check or uncheck target vector layer
  const checkLayer = (layer: VectorLayerType, isChecked: boolean) => {
    let index = getRasterIndexByID(currentRasterID)
    if (!index) return
    if (isChecked) {
      if (layer.imageryLayer === null) {
        layer.imageryLayer = cesiumViewer.imageryLayers.addImageryProvider(
          createCesiumImageryProvider(layer, rAge)
        )
      }
      enableLayer(index, layer.id)
    } else {
      if (layer.imageryLayer) {
        cesiumViewer.imageryLayers.remove(layer.imageryLayer)
        layer.imageryLayer = null
      }
      disableLayer(index, layer.id)
    }
  }

  //
  const onCheckBoxChange = (val: any) => {
    let layer = vectorLayers[val.detail.value]
    layer.checked = val.detail.checked
    checkLayer(layer, layer.checked)
  }

  //
  const onCitiesCheckBoxChange = (val: any) => {
    setShowCities(val.detail.checked)
    let index = getRasterIndexByID(currentRasterID)
    if (!index) return
    if (val.detail.checked) {
      enableLayer(index, 'cities')
    } else {
      disableLayer(index, 'cities')
    }
    cityEnabledFlag = val.detail.checked
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
