import {
  Credit,
  GeographicTilingScheme,
  WebMapTileServiceImageryProvider,
} from 'cesium'

var gridsetName = 'EPSG:4326'
var gridNames = [
  'EPSG:4326:0',
  'EPSG:4326:1',
  'EPSG:4326:2',
  'EPSG:4326:3',
  'EPSG:4326:4',
  'EPSG:4326:5',
  'EPSG:4326:6',
  'EPSG:4326:7',
  'EPSG:4326:8',
  'EPSG:4326:9',
  'EPSG:4326:10',
  'EPSG:4326:11',
  'EPSG:4326:12',
  'EPSG:4326:13',
  'EPSG:4326:14',
  'EPSG:4326:15',
  'EPSG:4326:16',
  'EPSG:4326:17',
  'EPSG:4326:18',
  'EPSG:4326:19',
  'EPSG:4326:20',
  'EPSG:4326:21',
]

const topography = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
  layer: 'gplates:topography',
  style: '',
  format: 'image/png',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Coastlines'),
})

const geology = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org//geoserver/gwc/service/wmts',
  layer: 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref',
  style: '',
  format: 'image/jpeg',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Geology'),
})

const agegrid = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org/geoserver/gwc/service/wmts',
  layer: 'gplates:agegrid',
  style: '',
  format: 'image/jpeg',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Geology'),
})

export const rasterData: { [key: string]: WebMapTileServiceImageryProvider } = {
  topography: topography,
  geology: geology,
  agegrid: agegrid,
}

const gplates_coastlines = new WebMapTileServiceImageryProvider({
  url: 'https://geosrv.earthbyte.org//geoserver/gwc/service/wmts',
  layer: 'gplates:Matthews_etal_GPC_2016_Coastlines_Polyline',
  style: '',
  format: 'image/png',
  tileMatrixSetID: gridsetName,
  tileMatrixLabels: gridNames,
  //minimumLevel: 1,
  maximumLevel: 8,
  tilingScheme: new GeographicTilingScheme(),
  credit: new Credit('EarthByte Coastlines'),
})

export const vectorData: { [key: string]: WebMapTileServiceImageryProvider } = {
  coastlines: gplates_coastlines,
}
