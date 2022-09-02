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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { age } from '../functions/atoms'
import { serverURL } from '../functions/settings'
import rasterMaps, { currentRasterIndex } from '../functions/rasterMaps'

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
  const lonLat = useRef([0, 0])
  const [updateLonLat, setUpdateLonLat] = useState(false)
  const [lonLatList, setLonLatlist] = useState<[number, number][]>([])
  const [showLocationDetails, setShowLocationDetails] = useState(false)
  const [showLocationIndex, setShowLocationIndex] = useState(0)
  const paleoAge = useRecoilValue(age)

  //deal with the paleo age change
  //reconstruct locations
  useEffect(() => {
    const fetchData = async () => {
      if (rasterMaps.length === 0 || lonLatList.length === 0) return

      let coordsStr = ''
      lonLatList.forEach((item) => {
        coordsStr += item[0].toFixed(4) + ',' + item[1].toFixed(4) + ','
      })
      coordsStr = coordsStr.slice(0, -1)
      let data = await fetch(
        serverURL +
          `/reconstruct/reconstruct_points/?points=${coordsStr}&time=${paleoAge}&model=` +
          rasterMaps[currentRasterIndex].model
      )
      let dataJson = await data.json()
      console.log(dataJson['coordinates'])

      //remove the old location entities
      locationEntities.forEach((entity) => {
        cesiumViewer.entities.remove(entity)
      })

      //add new location entities to cesium globe
      dataJson['coordinates'].forEach(
        (coord: [number, number], index: number) => {
          let pe = cesiumViewer.entities.add({
            name:
              'Index(' +
              String(index) +
              ') Lon: ' +
              String(coord[0]) +
              ' Lat: ' +
              String(coord[1]),
            position: Cartesian3.fromDegrees(coord[0], coord[1]),
            point: {
              color: Color.BLACK,
              pixelSize: 10,
              outlineColor: Color.YELLOW,
              outlineWidth: 3,
            },
          })
          locationEntities.push(pe)
        }
      )

      return
    }

    fetchData().catch(console.error)
  }, [paleoAge])

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
        lonLat.current = [
          Math.toDegrees(pc.longitude),
          Math.toDegrees(pc.latitude),
        ]
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
                          value={location[0].toFixed(4)}
                        ></IonInput>

                        <IonLabel>Latitude:</IonLabel>
                        <IonInput
                          readonly
                          value={location[1].toFixed(4)}
                        ></IonInput>
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
              value={lonLat.current[0].toFixed(4)}
            ></IonInput>

            <IonLabel>Latitude:</IonLabel>
            <IonInput
              type="number"
              value={lonLat.current[1].toFixed(4)}
            ></IonInput>
            <IonButton
              id="open-modal"
              color="primary"
              onClick={() => {
                setLonLatlist(
                  lonLatList.concat([[lonLat.current[0], lonLat.current[1]]])
                )
                let pe = cesiumViewer.entities.add({
                  name:
                    'Index(' +
                    String(lonLatList.length) +
                    ') Lon: ' +
                    String(lonLat.current[0]) +
                    ' Lat: ' +
                    String(lonLat.current[1]),
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
    </div>
  )
}
export default AddLocationWidget
