export type RasterCfg = {
  id: string
  //layer: any
  layerName: string
  url: string
  wmsUrl: string
  style: string
  title: string
  subTitle: string
  icon: string
  startTime: number
  endTime: number
  step: number
  model?: string
}

export type LonLatPid = {
  lon: number
  lat: number
  pid: number
}

export type VectorLayerType = {
  displayName: string
  imageryLayer: any //cesium Imagery Layer object
  id: string //layer ID/key in layer config
  layerName: string // layer name in geoserver
  url: string //wmts url(tiled)
  wmsUrl: string //wms url(not tiled)
  style: string //geoserver style name
  checked: boolean //if the layer has been enabled in GUI
}
