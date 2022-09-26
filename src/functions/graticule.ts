import * as Cesium from 'cesium'
import { cesiumViewer } from './cesiumViewer'

let gridImageryLayer: Cesium.ImageryLayer | null = null
let labels: any = null

//
export const showGraticule = () => {
  gridImageryLayer = cesiumViewer.scene.imageryLayers.addImageryProvider(
    new Cesium.GridImageryProvider({
      cells: 3,
      glowWidth: 0,
      backgroundColor: new Cesium.Color(0, 0, 0, 0.0),
      glowColor: new Cesium.Color(0, 0, 0, 0.0),
      color: new Cesium.Color(1, 1, 1, 0.2),
    })
  )
  if (!labels) {
    //labels = cesiumViewer.scene.primitives.add(new Cesium.LabelCollection())
    //addLabel(0, 0, '0°E', false)
    labels = cesiumViewer.scene.primitives.add(new Cesium.LabelCollection())
  }
  addLabel(0, 0, '0°', false)
  addLabel(180, 0, '180°', false)
  addLabel(90, 0, '90°E', false)
  addLabel(-90, 0, '90°W', false)
  addLabel(45, 0, '45°E', false)
  addLabel(-45, 0, '45°W', false)
  addLabel(0, 30, '30°N', false)
  addLabel(0, 60, '60°N', false)
  addLabel(0, -30, '30°S', false)
  addLabel(0, -60, '60°S', false)
}

//
export const hideGraticule = () => {
  if (gridImageryLayer) {
    cesiumViewer.scene.imageryLayers.remove(gridImageryLayer)
    gridImageryLayer = null
  }
  if (labels) {
    labels.removeAll()
    labels = null
  }
}

const addLabel = (
  lon: number,
  lat: number,
  text: string,
  isLat: boolean,
  color = 'white'
) => {
  if (labels) {
    //console.log('add label')
    labels.add({
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      text: text,
      font: `bold 1rem Arial`,
      fillColor: color,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 4,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(isLat ? 0 : 4, isLat ? -6 : 0),
      eyeOffset: Cesium.Cartesian3.ZERO,
      horizontalOrigin: isLat
        ? Cesium.HorizontalOrigin.CENTER
        : Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: isLat
        ? Cesium.VerticalOrigin.BOTTOM
        : Cesium.VerticalOrigin.TOP,
      scale: 1,
      scaleByDistance: new Cesium.NearFarScalar(1, 0.85, 8.0e6, 0.75),
    })
  }
}
