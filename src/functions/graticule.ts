import * as Cesium from 'cesium'
import { cesiumViewer } from './cesiumViewer'

let gridImageryLayer: Cesium.ImageryLayer | null = null
let labels: any = null
export let showGraticuleFlag = false

export const setShowGraticuleFlag = (flag: boolean) => {
  showGraticuleFlag = flag
}

//
export const raiseGraticuleLayerToTop = () => {
  if (gridImageryLayer)
    cesiumViewer.scene.imageryLayers.raiseToTop(gridImageryLayer)
}

//
export const showGraticule = () => {
  gridImageryLayer = cesiumViewer.scene.imageryLayers.addImageryProvider(
    new Cesium.GridImageryProvider({
      cells: 3,
      glowWidth: 0,
      backgroundColor: new Cesium.Color(0, 0, 0, 0.0),
      glowColor: new Cesium.Color(0, 0, 0, 0.0),
      color: new Cesium.Color(1, 1, 1, 0.2),
    }),
  )
  if (!labels) {
    //labels = cesiumViewer.scene.primitives.add(new Cesium.LabelCollection())
    //addLabel(0, 0, '0°E', false)
    labels = cesiumViewer.scene.primitives.add(new Cesium.LabelCollection())
  }
  addLabel(0, 0, '0°')
  addLabel(180, 0, '180°')
  addLabel(90, 0, '90°E')
  addLabel(-90, 0, '90°W')
  addLabel(45, 0, '45°E')
  addLabel(-45, 0, '45°W')
  addLabel(0, 30, '30°N')
  addLabel(0, 60, '60°N')
  addLabel(0, -30, '30°S')
  addLabel(0, -60, '60°S')
  addLabel(0, -90, 'S-Pole')
  addLabel(0, 90, 'N-Pole')
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

const addLabel = (lon: number, lat: number, text: string, color = 'white') => {
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
      pixelOffset: new Cesium.Cartesian2(4, 0),
      eyeOffset: Cesium.Cartesian3.ZERO,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      scale: 1,
      scaleByDistance: new Cesium.NearFarScalar(1, 0.85, 8.0e6, 0.75),
    })
  }
}
