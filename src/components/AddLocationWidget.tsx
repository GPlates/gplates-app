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
} from '@ionic/react'
import { Color, Cartesian2, Entity, Cartographic, Math } from 'cesium'
import './AddLocationWidget.scss'
import { cesiumViewer } from '../pages/Main'

let cameraChangedRemoveCallback: any = null
let cameraMoveStartRemoveCallback: any = null
let cameraMoveEndtRemoveCallback: any = null

var pointerEntity: Entity | null = null

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

  const cameraHandler = () => {
    let ray = cesiumViewer.scene.camera.getPickRay(
      new Cartesian2(
        cesiumViewer.scene.canvas.clientWidth / 2,
        cesiumViewer.scene.canvas.clientHeight / 2
      )
    )

    if (ray != undefined) {
      var p = cesiumViewer.scene.globe.pick(ray, cesiumViewer.scene)
      if (p) {
        let pc = Cartographic.fromCartesian(p)
        setLonLat([Math.toDegrees(pc.longitude), Math.toDegrees(pc.latitude)])
      }
      if (pointerEntity) cesiumViewer.entities.remove(pointerEntity)
      pointerEntity = cesiumViewer.entities.add({
        name: 'center',
        position: p,
        point: {
          color: Color.BLACK,
          pixelSize: 10,
          outlineColor: Color.YELLOW,
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      })
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
    if (pointerEntity) cesiumViewer.entities.remove(pointerEntity)
  }
  return (
    <div>
      <div className={`locate-indicator ${show ? '' : 'hide'}`}>
        <IonIcon icon={locateOutline} />
      </div>

      <div
        className={show ? 'add-locate-widget show' : 'add-locate-widget hide'}
      >
        <div>
          <IonList className="location-list">
            <IonItemDivider>Location List</IonItemDivider>
            {lonLatList.map((location, index) => {
              return (
                <IonItem key={index}>
                  <IonLabel>Longitude:</IonLabel>
                  <IonInput readonly value={location[0]}></IonInput>

                  <IonLabel>Latitude:</IonLabel>
                  <IonInput readonly value={location[1]}></IonInput>
                  <IonButton color="tertiary">
                    <IonIcon icon={informationOutline} />
                  </IonButton>
                  <IonButton
                    color="tertiary"
                    onClick={() => {
                      let a = [...lonLatList]
                      a.splice(index, 1)
                      setLonLatlist(a)
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
              color="primary"
              onClick={() => {
                setLonLatlist(lonLatList.concat([[lonLat[0], lonLat[1]]]))
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
      </div>
    </div>
  )
}
export default AddLocationWidget
