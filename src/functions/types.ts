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
  imageryLayer: any
  layerProvider: any
  layerName: string
  layer: string
  url: string
  wmsUrl: string
  style: string
  checked: boolean
}
