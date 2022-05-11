import {
  IonButton,
  IonContent,
  IonPage,
  IonRippleEffect,
  useIonViewDidEnter,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList

} from '@ionic/react'

import {
  logoFacebook,
  logoTwitter,
  logoYoutube,
  logoPwa,
  logoNpm,
  logoIonic,
  logoGithub,
  logoJavascript,
  logoAngular,
  logoVimeo,
  logoChrome,
  logoReact,
  cogOutline,
  earthOutline,
  exitOutline
} from 'ionicons/icons';

import './Main.css'

import {
  Ion,
  Viewer,
  Credit,
  WebMapTileServiceImageryProvider,
  SingleTileImageryProvider,
  GeographicTilingScheme,
  Scene,
} from 'cesium'
import CustomToolbar from '../components/CustomToolbar'
import { useState } from 'react'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk'

let viewer: Viewer
let count = 0

// The times and clock in the below links seem useful
// https://sandcastle.cesium.com/index.html?src=Web%20Map%20Tile%20Service%20with%20Time.html
// https://cesium.com/learn/cesiumjs/ref-doc/WebMapTileServiceImageryProvider.html#.ConstructorOptions
const test_animation = () => {
  count += 1
  console.log(`dang dang dang~~~ ${count % 15}`)
  viewer.imageryLayers.addImageryProvider(
    new SingleTileImageryProvider({
      url: `assets/images/EarthByte_Zahirovic_etal_2016_ESR_r888_AgeGrid-${
        count % 15
      }.jpeg`,
    })
  )
  console.log(viewer.imageryLayers.length)
  if (viewer.imageryLayers.length > 15) {
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0), true)
  }
}

// const onClickButton = () => {
//   setInterval(test_animation, 1000);
// }

const Main: React.FC = () => {
  const [scene, setScene] = useState<Scene>()

  useIonViewDidEnter(() => {
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
    const style = ''
    const format = 'image/jpeg'
    const layerName = 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref'

    const gplates_wmts = new WebMapTileServiceImageryProvider({
      url: 'http://www.earthbyte.org:8600/geoserver/gwc/service/wmts',
      layer: layerName,
      style: style,
      format: format,
      tileMatrixSetID: gridsetName,
      tileMatrixLabels: gridNames,
      //minimumLevel: 1,
      maximumLevel: 8,
      tilingScheme: new GeographicTilingScheme(),
      credit: new Credit('EarthByte Geology'),
    })

    if (document.getElementsByClassName('cesium-viewer').length === 0) {
      viewer = new Viewer('cesiumContainer', {
        baseLayerPicker: false,
        imageryProvider: gplates_wmts,
        animation: false,
        creditContainer: "credit",
        timeline: false,
        fullscreenButton: false
      })
      setScene(viewer.scene)
      viewer.scene.fog.enabled = false
      viewer.scene.globe.showGroundAtmosphere = false

      const gplates_coastlines = new WebMapTileServiceImageryProvider({
        url: 'http://www.earthbyte.org:8600/geoserver/gwc/service/wmts',
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
      viewer.imageryLayers.addImageryProvider(gplates_coastlines)
    }
  })

  return (
    <IonPage>
      <IonContent fullscreen>
        {/*<CustomToolbar scene={scene} />*/}
        <div id="cesiumContainer" />
        <div id="credit" style={{display: 'none'}} />
        <IonFab vertical="bottom" horizontal="start">
          <IonFabButton>Menu</IonFabButton>
          <IonFabList side="end">
            <IonFabButton>
              <IonIcon icon={cogOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={earthOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon icon={exitOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon class="vectorMap"/>
            </IonFabButton>
            <IonFabButton>
              <IonIcon class="questionIcon"/>
            </IonFabButton>
            <IonFabButton>
              <IonIcon class="questionIcon"/>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  )
}

export default Main
