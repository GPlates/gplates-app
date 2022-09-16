export type RasterCfg = {
  layer: any
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
