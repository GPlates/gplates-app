import React, { useEffect, useState, useRef } from 'react'
import {
  locateOutline,
  trashOutline,
  informationOutline,
  closeOutline,
} from 'ionicons/icons'
import {
  IonIcon,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonItemDivider,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonAccordionGroup,
  IonAccordion,
  useIonToast,
} from '@ionic/react'
import {
  Color,
  Cartesian2,
  Entity,
  Cartographic,
  Math as CMath,
  Cartesian3,
  ConstantPositionProperty,
  SceneMode,
  Rectangle,
} from 'cesium'
import './AddLocationWidget.scss'
import { cesiumViewer } from '../functions/cesiumViewer'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { age, currentRasterMapIndexState } from '../functions/atoms'
import { serverURL } from '../functions/settings'
import rasterMaps, { currentRasterIndex } from '../functions/rasterMaps'
import { currentModel } from '../functions/rotationModel'
import { LonLatPid } from '../functions/types'

let cameraChangedRemoveCallback: any = null
let cameraMoveStartRemoveCallback: any = null
let cameraMoveEndtRemoveCallback: any = null

var locationEntities: Entity[] = []
var locationCartesian: Cartesian3 | undefined = Cartesian3.fromDegrees(0, 0)

let presentDayLonLatList: LonLatPid[] = []

//move the locations to the new positions
const updateLocationEntities = (coords: { lon: number; lat: number }[]) => {
  //console.log(coords)
  //change the position property for the entities
  locationEntities.forEach((entity, index) => {
    entity.position = new ConstantPositionProperty(
      Cartesian3.fromDegrees(coords[index].lon, coords[index].lat)
    )
  })
}

//reverse reconstruction the coordinates to find the present day coordinates
const setPresentDayLonLatPid = (
  age: number,
  lonLat: React.MutableRefObject<{
    lon: number
    lat: number
  }>
) => {
  if (!rasterMaps[currentRasterIndex].model) {
    presentDayLonLatList = presentDayLonLatList.concat([
      {
        lon: lonLat.current.lon,
        lat: lonLat.current.lat,
        pid: 0,
      },
    ])
  } else {
    //reverse recontruct to get present day coords and plate id
    //even when the paleo-age is 0, we still need the plate id
    fetch(
      serverURL.replace(/\/+$/, '') +
        `/reconstruct/reconstruct_points/?points=${lonLat.current.lon},${lonLat.current.lat}` +
        `&time=${age}&model=${rasterMaps[currentRasterIndex].model}&reverse&fc`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const coords = jsonData['features'][0]['geometry']['coordinates']
        //console.log(jsonData)
        presentDayLonLatList = presentDayLonLatList.concat([
          {
            lon: coords[0],
            lat: coords[1],
            pid: jsonData['features'][0]['properties']['pid'],
          },
        ])
      })
      .catch((error) => {
        console.log(error) //handle the promise rejection
      })
  }
}

//
//
interface AddLocationWidgetProps {
  show: boolean
  setShow: Function
}
//
//
const AddLocationWidget: React.FC<AddLocationWidgetProps> = ({
  show,
  setShow,
}) => {
  const lonLat = useRef({ lon: 0, lat: 0 }) //do not trigger re-render
  const [updateLonLat, setUpdateLonLat] = useState(false) //triger re-render when lonLat changed
  const [lonLatList, setLonLatlist] = useState<{ lon: number; lat: number }[]>(
    []
  )
  const [showLocationDetails, setShowLocationDetails] = useState(false)
  const [showLocationIndex, setShowLocationIndex] = useState(0)
  const paleoAge = useRecoilValue(age)
  const currentRasterMapIndex = useRecoilValue(currentRasterMapIndexState)
  const [presentToast, dismissToast] = useIonToast()

  //reconstruct the present day coordinate back in time
  const reconstructPresentDayLocations = async (paleoAge: number) => {
    if (
      rasterMaps.length === 0 ||
      presentDayLonLatList.length === 0 ||
      typeof cesiumViewer === 'undefined'
    )
      return []

    let paleoCoords: { lon: number; lat: number }[] = []

    // fetch finite rotation for plate IDs
    await currentModel.fetchFiniteRotations(
      presentDayLonLatList.map((lll) => String(lll.pid))
    )

    presentDayLonLatList.forEach((point) => {
      let rp = currentModel.rotateLonLatPid(
        currentModel.getTimeIndex(paleoAge),
        point
      )
      //console.log(rp)
      paleoCoords.push(rp)
    })

    return paleoCoords
  }

  const reconstructAndUpdateLocations = async () => {
    const paleoCoords = await reconstructPresentDayLocations(paleoAge)
    if (paleoCoords.length > 0) {
      setLonLatlist(paleoCoords)
      updateLocationEntities(paleoCoords)
    }
  }

  useEffect(() => {
    reconstructAndUpdateLocations()
  }, [paleoAge])

  //the current raster index changed
  useEffect(() => {
    if (!(rasterMaps.length > currentRasterMapIndex)) return

    let points_str = ''
    presentDayLonLatList.forEach((lonLatPid) => {
      points_str +=
        lonLatPid.lon.toFixed(4) + ',' + lonLatPid.lat.toFixed(4) + ','
    })
    points_str = points_str.slice(0, -1)

    if (
      rasterMaps[currentRasterMapIndex].model &&
      presentDayLonLatList.length > 0
    ) {
      fetch(
        serverURL.replace(/\/+$/, '') +
          `/reconstruct/assign_points_plate_ids?points=${points_str}` +
          `&model=${rasterMaps[currentRasterMapIndex].model}`
      )
        .then((response) => response.json())
        .then((jsonData) => {
          let newLonLatPid: LonLatPid[] = presentDayLonLatList.map(
            (lonLatPid, index) => {
              return {
                lon: lonLatPid.lon,
                lat: lonLatPid.lat,
                pid: jsonData[index],
              }
            }
          )
          //console.log(jsonData)
          presentDayLonLatList = newLonLatPid
        })
        .catch((error) => {
          console.log(error) //handle the promise rejection
        })
    }
  }, [currentRasterMapIndex]) //the current raster index changed

  //handle the camera changed event
  //calculate the coordinates of the center of camera lens
  const cameraHandler = (update = true) => {
    let ray = cesiumViewer.scene.camera.getPickRay(
      new Cartesian2(
        cesiumViewer.scene.canvas.clientWidth / 2,
        cesiumViewer.scene.canvas.clientHeight / 2
      )
    )

    if (ray != undefined) {
      locationCartesian = cesiumViewer.scene.globe.pick(ray, cesiumViewer.scene)
      if (locationCartesian) {
        let pc = Cartographic.fromCartesian(locationCartesian)
        lonLat.current = {
          lon: CMath.toDegrees(pc.longitude),
          lat: CMath.toDegrees(pc.latitude),
        }
        if (update) setUpdateLonLat(!updateLonLat)
      }
    }
  }

  if (show) {
    cameraChangedRemoveCallback =
      cesiumViewer.camera.changed.addEventListener(cameraHandler)
    cameraMoveStartRemoveCallback =
      cesiumViewer.camera.moveStart.addEventListener(cameraHandler)
    cameraMoveEndtRemoveCallback =
      cesiumViewer.camera.moveEnd.addEventListener(cameraHandler)
  } else {
    if (cameraChangedRemoveCallback) cameraChangedRemoveCallback()
    if (cameraMoveStartRemoveCallback) cameraMoveStartRemoveCallback()
    if (cameraMoveEndtRemoveCallback) cameraMoveEndtRemoveCallback()
  }

  //get the currect center lon lat, but do not trigger re-render
  if (cesiumViewer) cameraHandler(false)

  return (
    <div>
      <div className={`locate-indicator ${show ? '' : 'hide'}`}>
        <IonIcon icon={locateOutline} />
      </div>
      <div
        className={show ? 'location-container show' : 'location-container hide'}
      >
        <div
          className={show ? 'add-locate-widget show' : 'add-locate-widget hide'}
        >
          <div className="location-list-container">
            <IonAccordionGroup>
              <IonAccordion value="first">
                <IonItem slot="header" color="light">
                  <IonLabel>Locations List ({lonLatList.length})</IonLabel>
                </IonItem>
                {lonLatList.map((location, index) => {
                  return (
                    <div slot="content" key={index}>
                      <IonItem>
                        <IonLabel>Longitude:</IonLabel>
                        <IonInput
                          readonly
                          value={location.lon.toFixed(4)}
                        ></IonInput>

                        <IonLabel>Latitude:</IonLabel>
                        <IonInput
                          readonly
                          value={location.lat.toFixed(4)}
                        ></IonInput>
                        <IonButton
                          color="tertiary"
                          onClick={() => {
                            const width = 40.9
                            const height = 33.3
                            const rectangle = Rectangle.fromDegrees(
                              lonLatList[index].lon - width,
                              lonLatList[index].lat - height,
                              lonLatList[index].lon + width,
                              lonLatList[index].lat + height
                            )
                            cesiumViewer.scene.camera.flyTo({
                              destination: rectangle,
                            })
                            setTimeout(() => {
                              setShowLocationIndex(index)
                              setShowLocationDetails(true)
                            }, 1000)
                          }}
                        >
                          <IonIcon icon={informationOutline} />
                        </IonButton>
                        <IonButton
                          color="tertiary"
                          onClick={() => {
                            //remove the coordinates. this might be paleo-coordinates
                            let a = [...lonLatList]
                            a.splice(index, 1)
                            setLonLatlist(a)
                            //remove the present-day coordinates as well
                            let b = [...presentDayLonLatList]
                            b.splice(index, 1)
                            presentDayLonLatList = b

                            cesiumViewer.entities.remove(
                              locationEntities[index]
                            )
                            locationEntities.splice(index, 1)
                          }}
                        >
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                      </IonItem>
                    </div>
                  )
                })}
              </IonAccordion>
            </IonAccordionGroup>
          </div>

          <IonItemDivider>Insert Location</IonItemDivider>
          <IonItem>
            <IonLabel>Longitude:</IonLabel>
            <IonInput
              type="number"
              value={lonLat.current.lon.toFixed(4)}
            ></IonInput>

            <IonLabel>Latitude:</IonLabel>
            <IonInput
              type="number"
              value={lonLat.current.lat.toFixed(4)}
            ></IonInput>
            <IonButton
              id="open-modal"
              color="primary"
              onClick={() => {
                if (cesiumViewer.scene.mode != SceneMode.SCENE3D) {
                  presentToast({
                    buttons: [
                      { text: 'Dismiss', handler: () => dismissToast() },
                    ],
                    duration: 5000,
                    message: 'Only work with 3D globe mode!',
                    onDidDismiss: () => {},
                  })
                  return
                }
                setLonLatlist(
                  lonLatList.concat([
                    { lon: lonLat.current.lon, lat: lonLat.current.lat },
                  ])
                )
                //get plate id and
                //save the Present Day coordinates in another file
                setPresentDayLonLatPid(paleoAge, lonLat)

                let pe = cesiumViewer.entities.add({
                  name:
                    'Index(' +
                    String(lonLatList.length) +
                    ') Lon: ' +
                    String(lonLat.current.lon) +
                    ' Lat: ' +
                    String(lonLat.current.lat),
                  position: locationCartesian,
                  point: {
                    color: Color.BLACK,
                    pixelSize: 10,
                    outlineColor: Color.YELLOW,
                    outlineWidth: 3,
                  },
                })
                locationEntities.push(pe)
              }}
            >
              Insert
            </IonButton>
            <IonIcon
              icon={closeOutline}
              className="close-button"
              slot={'end'}
              color="secondary"
              size="small"
              onClick={() => {
                setShow(false)
              }}
            ></IonIcon>
          </IonItem>
        </div>

        <IonModal
          isOpen={showLocationDetails}
          animated
          backdropDismiss={false}
          class="location-details"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Location Details</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowLocationDetails(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel>Paleo-age:</IonLabel>
              <IonInput readonly value={paleoAge}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Paleo-longitude:</IonLabel>
              <IonInput
                readonly
                value={
                  lonLatList.length > showLocationIndex
                    ? lonLatList[showLocationIndex].lon.toFixed(4)
                    : 0
                }
              ></IonInput>

              <IonLabel>Paleo-latitude:</IonLabel>
              <IonInput
                readonly
                value={
                  lonLatList.length > showLocationIndex
                    ? lonLatList[showLocationIndex].lat.toFixed(4)
                    : 0
                }
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Present-day Longitude:</IonLabel>
              <IonInput
                readonly
                value={
                  presentDayLonLatList.length > showLocationIndex
                    ? presentDayLonLatList[showLocationIndex].lon.toFixed(4)
                    : 0
                }
              ></IonInput>
              <IonLabel>Present-day Latitude:</IonLabel>
              <IonInput
                readonly
                value={
                  presentDayLonLatList.length > showLocationIndex
                    ? presentDayLonLatList[showLocationIndex].lat.toFixed(4)
                    : 0
                }
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel>Plate ID:</IonLabel>
              <IonInput
                readonly
                value={
                  presentDayLonLatList.length > showLocationIndex
                    ? presentDayLonLatList[showLocationIndex].pid
                    : 0
                }
              ></IonInput>
            </IonItem>
          </IonContent>
        </IonModal>
      </div>
    </div>
  )
}
export default AddLocationWidget
