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
  Math,
  Cartesian3,
  ConstantPositionProperty,
  SceneMode,
  Rectangle,
} from 'cesium'
import './AddLocationWidget.scss'
import { cesiumViewer } from '../pages/Main'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { age } from '../functions/atoms'
import {
  presentDayLonLatList,
  setPresentDayLonLatList,
  setSetLonLatListCallback,
  setUpdateLocationEntitiesCallback,
} from '../functions/presentDayLocations'

let cameraChangedRemoveCallback: any = null
let cameraMoveStartRemoveCallback: any = null
let cameraMoveEndtRemoveCallback: any = null

var locationEntities: Entity[] = []
var locationCartesian: Cartesian3 | undefined = Cartesian3.fromDegrees(0, 0)

//
const updateLocationEntities = (coords: { lon: number; lat: number }[]) => {
  //remove the old location entities
  locationEntities.forEach((entity, index) => {
    entity.position = new ConstantPositionProperty(
      Cartesian3.fromDegrees(coords[index].lon, coords[index].lat)
    )
    //cesiumViewer.scene.requestRenderMode = true
    //cesiumViewer.scene.requestRender()
    //cesiumViewer.entities.remove(entity)
  })

  //add new location entities to cesium globe
  /*coords.forEach((coord: { lon: number; lat: number }, index: number) => {
    let pe = cesiumViewer.entities.add({
      name:
        'Index(' +
        String(index) +
        ') Lon: ' +
        String(coord.lon) +
        ' Lat: ' +
        String(coord.lat),
      position: Cartesian3.fromDegrees(coord.lon, coord.lat),
      point: {
        color: Color.BLACK,
        pixelSize: 10,
        outlineColor: Color.YELLOW,
        outlineWidth: 3,
      },
    })
    locationEntities.push(pe)
  })*/
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
  const [presentToast, dismissToast] = useIonToast()

  //duplicate this dispatch function in another file for external usage
  setSetLonLatListCallback(setLonLatlist)

  //the callback function to update points on Cesium globe
  setUpdateLocationEntitiesCallback(updateLocationEntities)

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
          lon: Math.toDegrees(pc.longitude),
          lat: Math.toDegrees(pc.latitude),
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
      <div className="location-container">
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
                            setPresentDayLonLatList(b)

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
                //save the Present Day coordinates in another file
                //TODO: check the current paleo-age and reverse recontruct to get present day coords
                setPresentDayLonLatList(
                  presentDayLonLatList.concat([
                    { lon: lonLat.current.lon, lat: lonLat.current.lat },
                  ])
                )
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
              <IonLabel>Longitude:</IonLabel>
              <IonInput
                readonly
                value={
                  lonLatList.length > showLocationIndex
                    ? lonLatList[showLocationIndex].lon
                    : 0
                }
              ></IonInput>

              <IonLabel>Latitude:</IonLabel>
              <IonInput
                readonly
                value={
                  lonLatList.length > showLocationIndex
                    ? lonLatList[showLocationIndex].lat
                    : 0
                }
              ></IonInput>
            </IonItem>
            <p>TODO: collect more info about this location and put here</p>
          </IonContent>
        </IonModal>
      </div>
    </div>
  )
}
export default AddLocationWidget
