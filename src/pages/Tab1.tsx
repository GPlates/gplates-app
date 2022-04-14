import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';

//import { Viewer, Entity, PointGraphics, EntityDescription } from 'resium';
import { Cartesian3 ,Ion, Viewer, Credit, WebMapTileServiceImageryProvider,
  SingleTileImageryProvider, GeographicTilingScheme} from 'cesium';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk';

var viewer: Viewer;
var count=0;
//the times and clock in the below links seem useful
//https://sandcastle.cesium.com/index.html?src=Web%20Map%20Tile%20Service%20with%20Time.html
//https://cesium.com/learn/cesiumjs/ref-doc/WebMapTileServiceImageryProvider.html#.ConstructorOptions
const test_animation = ( )=>{
  count+=1;
  console.log(`dang dang dang~~~ ${count % 15}`);
  viewer.imageryLayers.addImageryProvider(new SingleTileImageryProvider({
      url : `assets/images/EarthByte_Zahirovic_etal_2016_ESR_r888_AgeGrid-${count % 15}.jpeg`}));
  console.log(viewer.imageryLayers.length);
  if (viewer.imageryLayers.length>15){
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0),true);
  }
}

const onClickBotton = () => {
  setInterval(test_animation, 1000);
}

const Tab1: React.FC = () => {
  useIonViewDidEnter(() => {
     
    var gridsetName = 'EPSG:4326';
    var gridNames = ['EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21'];
    var style = ''; 
    var format = 'image/jpeg';
    var layerName = 'gplates:cgmw_2010_3rd_ed_gplates_clipped_edge_ref';

    const gplates_wmts = new WebMapTileServiceImageryProvider({
      url : 'http://www.earthbyte.org:8600/geoserver/gwc/service/wmts',
      layer : layerName,
      style : style,
      format : format,
      tileMatrixSetID : gridsetName,
      tileMatrixLabels : gridNames,
      //minimumLevel: 1,
      maximumLevel: 8,
      tilingScheme: new GeographicTilingScheme(),
      credit : new Credit('EarthByte Geology')
    });


    if(document.getElementsByClassName("cesium-viewer").length==0){
      viewer = new Viewer('cesiumContainer',{
        imageryProvider : gplates_wmts
      });
      var scene = viewer.scene;
      scene.skyAtmosphere.show = false;
      scene.fog.enabled = false;
      scene.globe.showGroundAtmosphere = false;

      const gplates_coastlines = new WebMapTileServiceImageryProvider({
        url : 'http://www.earthbyte.org:8600/geoserver/gwc/service/wmts',
        layer : 'gplates:Matthews_etal_GPC_2016_Coastlines_Polyline',
        style : '',
        format : 'image/png',
        tileMatrixSetID : gridsetName,
        tileMatrixLabels : gridNames,
        //minimumLevel: 1,
        maximumLevel: 8,
        tilingScheme: new GeographicTilingScheme(),
        credit : new Credit('EarthByte Coastlines')
      });
      viewer.imageryLayers.addImageryProvider(gplates_coastlines);


      



      

    }

  });

  return (
    <IonPage>

      <IonContent fullscreen>
        <div id="cesiumContainer" ></div>
      </IonContent>

      <div style={{
            position: "absolute", display: "flex", flexDirection: "column", margin: '0 50px 0 50px', 
            justifyContent: 'center', height: "200px", width:'100px'
          }}>
        <IonButton 
          color="primary" onClick={onClickBotton}
        >
          Play
        </IonButton>
      </div>

    </IonPage>   
  );
};


export default Tab1;
