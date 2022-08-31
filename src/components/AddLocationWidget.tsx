import React, { useEffect, useState } from 'react'
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
} from '@ionic/react'
import {
  Color,
  Cartesian2,
  Entity,
  Cartographic,
  Math,
  Cartesian3,
} from 'cesium'
import './AddLocationWidget.scss'
import { cesiumViewer } from '../pages/Main'

let cameraChangedRemoveCallback: any = null
let cameraMoveStartRemoveCallback: any = null
let cameraMoveEndtRemoveCallback: any = null

var locationEntities: Entity[] = []
var locationCartesian: Cartesian3 | undefined = Cartesian3.fromDegrees(0, 0)
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
  const [lonLat, setLonLat] = useState([0, 0])
  const [lonLatList, setLonLatlist] = useState<[number, number][]>([])
  const [showLocationDetails, setShowLocationDetails] = useState(false)
  const [showLocationIndex, setShowLocationIndex] = useState(0)

  const cameraHandler = () => {
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
        setLonLat([Math.toDegrees(pc.longitude), Math.toDegrees(pc.latitude)])
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
  return (
    <div className="location-container">
      <div className={`locate-indicator ${show ? '' : 'hide'}`}>
        <IonIcon icon={locateOutline} />
      </div>

      <div
        className={show ? 'add-locate-widget show' : 'add-locate-widget hide'}
      >
        <IonList className="location-list">
          <IonItemDivider>Location List</IonItemDivider>
          {lonLatList.map((location, index) => {
            return (
              <IonItem key={index}>
                <IonLabel>Longitude:</IonLabel>
                <IonInput readonly value={location[0]}></IonInput>

                <IonLabel>Latitude:</IonLabel>
                <IonInput readonly value={location[1]}></IonInput>
                <IonButton
                  color="tertiary"
                  onClick={() => {
                    setShowLocationIndex(index)
                    setShowLocationDetails(true)
                  }}
                >
                  <IonIcon icon={informationOutline} />
                </IonButton>
                <IonButton
                  color="tertiary"
                  onClick={() => {
                    let a = [...lonLatList]
                    a.splice(index, 1)
                    setLonLatlist(a)
                    cesiumViewer.entities.remove(locationEntities[index])
                    locationEntities.splice(index, 1)
                  }}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </IonItem>
            )
          })}
        </IonList>
        <IonItemDivider>Insert Location</IonItemDivider>
        <IonItem>
          <IonLabel>Longitude:</IonLabel>
          <IonInput type="number" value={lonLat[0]}></IonInput>

          <IonLabel>Latitude:</IonLabel>
          <IonInput type="number" value={lonLat[1]}></IonInput>
          <IonButton
            id="open-modal"
            color="primary"
            onClick={() => {
              setLonLatlist(lonLatList.concat([[lonLat[0], lonLat[1]]]))
              let pe = cesiumViewer.entities.add({
                name:
                  'Index(' +
                  String(lonLatList.length) +
                  ') Lon: ' +
                  String(lonLat[0]) +
                  ' Lat: ' +
                  String(lonLat[1]),
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
        </IonItem>

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
      </div>

      <IonModal isOpen={showLocationDetails} animated backdropDismiss={false}>
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
                  ? lonLatList[showLocationIndex][0]
                  : 0
              }
            ></IonInput>

            <IonLabel>Latitude:</IonLabel>
            <IonInput
              readonly
              value={
                lonLatList.length > showLocationIndex
                  ? lonLatList[showLocationIndex][1]
                  : 0
              }
            ></IonInput>
          </IonItem>
          <p>TODO: collect more info about this location and put here</p>
        </IonContent>
      </IonModal>
    </div>
  )
}
export default AddLocationWidget
