import {
  SingleTileImageryProvider,
  Viewer,
  ImageryLayer,
  Color,
  Cartesian3,
  ConstantPositionProperty,
} from 'cesium'
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
import { requestDataByUrl } from '../functions/util'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  currentRasterMapIndexState,
  isVectorMenuShow,
  age,
} from '../functions/atoms'
import rasterMaps from '../functions/rasterMaps'
import { VectorLayerType } from '../functions/types'
import {
  getVectorLayers,
  enableLayer,
  getEnabledLayers,
  disableLayer,
} from '../functions/vectorLayers'

import { cesiumViewer } from '../functions/cesiumViewer'
import './VectorDataLayerMenu.scss'
import { PresentDayLocation } from '../functions/presentDayLocations'

export let VectorLayerCitiesPDL = new PresentDayLocation()

//only for this GUI component
let vectorLayers: VectorLayerType[] = []

interface ContainerProps {}

export const VectorDataLayerMenu: React.FC<ContainerProps> = ({}) => {
  const [isShow, setIsShow] = useRecoilState(isVectorMenuShow)
  const currentRasterMapIndex = useRecoilValue(currentRasterMapIndexState)
  const rAge = useRecoilValue(age)
  const [cities, setCities] = useState([] as any[])
  const [pidInfo, setPidInfo] = useState({} as Map<string, number[]>)

  //
  const getVecInfoByRaster = async (rasterModel: string) => {
    let responseJson = getVectorLayers(rasterModel)
    vectorLayers = []
    for (let key in responseJson) {
      let p = createCesiumImageryProvider(responseJson[key], rAge)

      let layer = {
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
  const onLayersCheckBoxChange = (val: any) => {
    let layer = vectorLayers[val.detail.value]
    layer.checked = val.detail.checked
    checkLayer(layer, layer.checked)
  }

  if (isShow && vectorLayers.length === 0) updateVectorDataInformation()

  // ***********************  add cities part  ***********************
  // initialize city location list
  useEffect(() => {
    getCityList().then(() => {
      getPids().then(() => {
        updatePresentDayLonLatList()
      })
    })
  }, [])

  useEffect(() => {
    const paleoCoords =
      VectorLayerCitiesPDL.reconstructPresentDayLocations(rAge)
    if (paleoCoords) {
      updateLocationEntities(paleoCoords)
    }
  }, [rAge])

  useEffect(() => {
    updatePresentDayLonLatList()
    // clear City Entities
    cities.forEach((city, idx) => {
      city.checked = false
      removeCityEntity(city)
    })
  }, [currentRasterMapIndex])

  const removeCityEntity = (city: any) => {
    if (city.entity == undefined) {
      return
    }
    cesiumViewer.entities.remove(city.entity)
    city.entity = undefined
  }

  const getCityList = async () => {
    let data_map = await requestDataByUrl(
      'https://gws.gplates.org/mobile/get_cities'
    )
    let data: any[] = []
    for (let key in data_map.coords) {
      data.push({
        name: key,
        coord: data_map.coords[key],
        checked: false,
        entity: undefined,
      })
    }
    setCities(data)
  }

  async function getPids() {
    let data_map = await requestDataByUrl(
      'https://gws.gplates.org/mobile/get_cities'
    )
    let plate_ids = new Map<string, number[]>()
    for (let key in data_map['plate-ids']) {
      plate_ids.set(key, data_map['plate-ids'][key])
    }
    setPidInfo(plate_ids)
  }

  const setPresentDayLonLatPid = async (
    cityIdx: number,
    lon: number,
    lat: number
  ) => {
    let curRasterMap: any = rasterMaps[currentRasterMapIndex].model
    curRasterMap =
      curRasterMap === undefined
        ? undefined
        : pidInfo.get(curRasterMap)![cityIdx]
    VectorLayerCitiesPDL.presentDayLonLatList.splice(cityIdx, 1, {
      lon: lon,
      lat: lat,
      pid: curRasterMap,
    })
  }

  const updateLocationEntities = (coords: { lon: number; lat: number }[]) => {
    cities.forEach(async (city, index) => {
      if (city.entity == undefined) {
        return
      }
      city.entity.position = new ConstantPositionProperty(
        Cartesian3.fromDegrees(coords[index].lon, coords[index].lat)
      )
    })
  }

  const updatePresentDayLonLatList = (selectedIdx?: number) => {
    if (selectedIdx === undefined) {
      // update all
      cities.forEach(async (city, idx) => {
        let coord = city.coord
        await setPresentDayLonLatPid(idx, coord[0], coord[1])
      })
    } else {
      // update target city
      let coord = cities[selectedIdx].coord
      setPresentDayLonLatPid(selectedIdx, coord[0], coord[1])
    }
  }

  const onCitiesCheckBoxChange = (val: any) => {
    let curIdx = val.detail.value
    let checked = val.detail.checked
    cities[curIdx].checked = checked

    if (checked) {
      let curCoord = cities[curIdx].coord
      let locationCartesian: Cartesian3 = Cartesian3.fromDegrees(
        curCoord[0],
        curCoord[1]
      )
      setPresentDayLonLatPid(curIdx, curCoord[0], curCoord[1]).then(() => {
        let pe = cesiumViewer.entities.add({
          name: cities[curIdx].name,
          position: locationCartesian,
          point: {
            color: Color.BLUEVIOLET,
            pixelSize: 10,
            outlineColor: Color.WHITE,
            outlineWidth: 3,
          },
          label: cities[curIdx].name,
        })
        cesiumViewer.scene.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            curCoord[0],
            curCoord[1],
            9999999
          ),
        })
        cities[curIdx].entity = pe
      })
    } else {
      removeCityEntity(cities[curIdx])
    }
  }

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
            {vectorLayers.map((layer, index) => {
              return (
                <div slot="content" key={index}>
                  <IonItem>
                    <IonLabel>{layer.layerName}</IonLabel>
                    <IonCheckbox
                      slot="end"
                      value={index}
                      checked={layer.checked}
                      onIonChange={onLayersCheckBoxChange}
                    />
                  </IonItem>
                </div>
              )
            })}
          </IonAccordion>
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel>Add Cities</IonLabel>
            </IonItem>
            {cities.map((city, index) => {
              return (
                <div slot="content" key={index}>
                  <IonItem>
                    <IonLabel>{city.name}</IonLabel>
                    <IonCheckbox
                      slot="end"
                      value={index}
                      checked={city.checked}
                      onIonChange={onCitiesCheckBoxChange}
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
