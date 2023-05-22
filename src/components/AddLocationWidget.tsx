import React, { useEffect, useState, useRef } from 'react'
import {
  locateOutline,
  trashOutline,
  informationOutline,
  closeCircleOutline,
} from 'ionicons/icons'
import {
  IonIcon,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
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
import { useRecoilValue } from 'recoil'
import { ageState, currentRasterIDState } from '../functions/atoms'
import { serverURL } from '../functions/settings'
import { getRasterByID } from '../functions/rasterMaps'
import { currentModel } from '../functions/rotationModel'
import { LonLatPid } from '../functions/types'

let cameraChangedRemoveCallback: any = null
let cameraMoveStartRemoveCallback: any = null
let cameraMoveEndtRemoveCallback: any = null

var locationEntities: Entity[] = []
var locationCartesian: Cartesian3 | undefined = Cartesian3.fromDegrees(0, 0)

let presentDayLonLatList: LonLatPid[] = []

/**
 * move the locations to the new positions
 *
 * @param coords
 */
const updateLocationEntities = (coords: { lon: number; lat: number }[]) => {
  locationEntities.forEach((location) => {
    cesiumViewer.entities.remove(location)
  })
  coords.forEach((coord, index) => {
    //draw the location on Cesium globe
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
  })
  //change the position property for the entities
  //keep below code commented out for future reference
  /*
  locationEntities.forEach((entity, index) => {
    if (coords && coords.length > index) {
      entity.position = new ConstantPositionProperty(
        Cartesian3.fromDegrees(coords[index].lon, coords[index].lat)
      )
    }
  })*/
}

/**
 * reverse reconstruction the coordinates to find the present day coordinates
 *
 * @param age
 * @param lonLat
 * @param modelName
 */
const setPresentDayLonLatPid = (
  age: number,
  lonLat: React.MutableRefObject<{
    lon: number
    lat: number
  }>,
  modelName: string | undefined
) => {
  //present-day only basemap, PIDs are not needed.
  if (!modelName) {
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
        `&time=${age}&model=${modelName}&reverse&fc`
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

/**
 *
 */
interface AddLocationWidgetProps {
  show: boolean
  setShow: Function
}

/**
 *
 * @param param0
 * @returns
 */
const AddLocationWidget: React.FC<AddLocationWidgetProps> = ({
  show,
  setShow,
}) => {
  const lonLat = useRef({ lon: 0, lat: 0 }) //do not trigger re-render
  const lonInput = useRef(null)
  const latInput = useRef(null)
  const [updateLonLat, setUpdateLonLat] = useState(false) //triger re-render when lonLat changed
  //the coordinates for the current age
  const [lonLatList, setLonLatlist] = useState<{ lon: number; lat: number }[]>(
    []
  )
  const [showLocationDetails, setShowLocationDetails] = useState(false)
  const [showLocationIndex, setShowLocationIndex] = useState(0)
  const paleoAge = useRecoilValue(ageState)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const [presentToast, dismissToast] = useIonToast()

  /**
   * insert the current locatoin into the location list
   * @returns
   */
  const insertLocation = () => {
    if (cesiumViewer.scene.mode != SceneMode.SCENE3D) {
      presentToast({
        buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
        duration: 5000,
        message: 'Only work with 3D globe mode!',
        onDidDismiss: () => {},
      })
      return
    }
    let inputLon = lonInput.current ? parseFloat(lonInput.current['value']) : 0
    let inputLat = latInput.current ? parseFloat(latInput.current['value']) : 0

    if (inputLon > 180 || inputLon < -180 || inputLat > 90 || inputLat < -90) {
      presentToast({
        buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
        duration: 2000,
        message: `Invalid longitude or latitude (${inputLon}, ${inputLat})!`,
        onDidDismiss: () => {},
      })
      return
    }

    //add the new location into the list
    setLonLatlist(lonLatList.concat([{ lon: inputLon, lat: inputLat }]))

    //get plate id and
    //save the Present Day coordinates
    let raster = getRasterByID(currentRasterID)
    if (raster) setPresentDayLonLatPid(paleoAge, lonLat, raster.model)

    //draw the location on Cesium globe
    let pe = cesiumViewer.entities.add({
      name:
        'Index(' +
        String(lonLatList.length) +
        ') Lon: ' +
        String(lonLat.current.lon) +
        ' Lat: ' +
        String(lonLat.current.lat),
      position: Cartesian3.fromDegrees(inputLon, inputLat),
      point: {
        color: Color.BLACK,
        pixelSize: 10,
        outlineColor: Color.YELLOW,
        outlineWidth: 3,
      },
    })
    locationEntities.push(pe)

    //move to the new location when user type in the coordinates in the input boxes
    if (
      Math.abs(inputLon - lonLat.current.lon) > 1 ||
      Math.abs(inputLat - lonLat.current.lat) > 1
    ) {
      cesiumViewer.scene.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          inputLon,
          inputLat,
          cesiumViewer.scene.camera.positionCartographic.height
        ),
      })
    }
  }

  /**
   * reconstruct the present day coordinate back in time
   *
   * @param paleoAge
   * @returns
   */
  const reconstructPresentDayLocations = async (paleoAge: number) => {
    if (
      currentModel === undefined ||
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
      if (currentModel) {
        let rp = currentModel.rotate(point, paleoAge)
        //console.log(rp)
        if (rp !== undefined) {
          paleoCoords.push(rp)
        }
      }
    })

    return paleoCoords
  }

  /**
   * reconstruct the present-day coordinates to paleo-coordinates
   * and redraw the points on Cesium
   */
  const reconstructAndUpdateLocations = async () => {
    const paleoCoords = await reconstructPresentDayLocations(paleoAge)
    if (paleoCoords.length > 0) {
      setLonLatlist(paleoCoords)
      updateLocationEntities(paleoCoords)
    }
  }

  /**
   * when the age is changed
   */
  useEffect(() => {
    reconstructAndUpdateLocations()
  }, [paleoAge])

  /**
   * when the current raster is changed
   */
  useEffect(() => {
    locationEntities.forEach((location) => {
      cesiumViewer.entities.remove(location)
    })
    presentDayLonLatList = []
    setLonLatlist([])
    //the code below was commented out by MC.
    //need to reconsider this carefully
    //maybe keep a location list for each raster
    //for now, just remove everything and start over when raster is changed
    /*
    let raster = getRasterByID(currentRasterID)
    if (!raster) return

    let points_str = ''
    presentDayLonLatList.forEach((lonLatPid) => {
      points_str +=
        lonLatPid.lon.toFixed(4) + ',' + lonLatPid.lat.toFixed(4) + ','
    })
    points_str = points_str.slice(0, -1)

    //try to assign the new plate IDs
    if (raster.model && presentDayLonLatList.length > 0) {
      fetch(
        serverURL.replace(/\/+$/, '') +
          `/reconstruct/assign_points_plate_ids?points=${points_str}` +
          `&model=${raster.model}`
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
    }*/
  }, [currentRasterID]) //the current raster is changed

  /**
   * handle the camera changed event
   * calculate the coordinates of the center of camera lens
   *
   * @param update
   */
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
        <div className="add-location-close-button-container">
          <IonIcon
            className="add-location-close-button"
            icon={closeCircleOutline}
            size="large"
            onClick={() => {
              setShow(false)
            }}
          />
        </div>
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
                        <IonInput
                          readonly
                          label="Longitude:"
                          value={location.lon.toFixed(4)}
                        ></IonInput>

                        <IonInput
                          readonly
                          label="Latitude:"
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
            <IonInput
              label="Longitude:"
              type="number"
              value={lonLat.current.lon.toFixed(4)}
              ref={lonInput}
            ></IonInput>

            <IonInput
              label="Latitude:"
              type="number"
              value={lonLat.current.lat.toFixed(4)}
              ref={latInput}
            ></IonInput>
            <IonButton
              id="open-modal"
              color="primary"
              disabled={paleoAge != 0}
              onClick={() => insertLocation()}
            >
              Insert
            </IonButton>
          </IonItem>
        </div>

        <IonModal
          isOpen={showLocationDetails}
          animated
          backdropDismiss={false}
          className="location-details"
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
            {currentModel && (
              <IonItem>
                <IonInput
                  label="Paleo-age:"
                  slot="end"
                  readonly
                  value={paleoAge + ' Ma'}
                ></IonInput>
              </IonItem>
            )}
            {currentModel && (
              <IonItem>
                <IonInput
                  label="Paleo-longitude:"
                  slot="end"
                  readonly
                  value={
                    lonLatList.length > showLocationIndex
                      ? lonLatList[showLocationIndex].lon.toFixed(4)
                      : 0
                  }
                ></IonInput>
              </IonItem>
            )}
            {currentModel && (
              <IonItem>
                <IonInput
                  label="Paleo-latitude:"
                  slot="end"
                  readonly
                  value={
                    lonLatList.length > showLocationIndex
                      ? lonLatList[showLocationIndex].lat.toFixed(4)
                      : 0
                  }
                ></IonInput>
              </IonItem>
            )}
            <IonItem>
              <IonInput
                label="Present-day Longitude:"
                slot="end"
                readonly
                value={
                  presentDayLonLatList.length > showLocationIndex
                    ? presentDayLonLatList[showLocationIndex].lon.toFixed(4)
                    : 0
                }
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                label="Present-day Latitude:"
                slot="end"
                readonly
                value={
                  presentDayLonLatList.length > showLocationIndex
                    ? presentDayLonLatList[showLocationIndex].lat.toFixed(4)
                    : 0
                }
              ></IonInput>
            </IonItem>
            {currentModel && (
              <IonItem>
                <IonInput
                  label="Plate ID:"
                  slot="end"
                  readonly
                  value={
                    presentDayLonLatList.length > showLocationIndex
                      ? presentDayLonLatList[showLocationIndex].pid
                      : 0
                  }
                ></IonInput>
              </IonItem>
            )}
            {currentModel && (
              <IonItem>
                <IonInput
                  label="Rotation Model:"
                  readonly
                  slot="end"
                  value={currentModel.name}
                ></IonInput>
              </IonItem>
            )}
          </IonContent>
        </IonModal>
      </div>
    </div>
  )
}
export default AddLocationWidget
