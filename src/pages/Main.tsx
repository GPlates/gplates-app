import React from 'react'

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonPage,
  useIonViewDidEnter,
} from '@ionic/react'

import {
  cogOutline,
  earthOutline,
  exitOutline,
  informationOutline,
} from 'ionicons/icons'

import './Main.scss'

import {
  Camera,
  Credit,
  GeographicTilingScheme,
  Ion,
  Rectangle,
  Scene,
  Viewer,
  WebMapTileServiceImageryProvider,
} from 'cesium'
import CustomToolbar from '../components/CustomToolbar'
import { useEffect, useState } from 'react'
import { SettingMenuPage } from './SettingMenuPage'
import AgeSlider from '../components/AgeSlider'
import { RasterMenu } from '../components/RasterMenu'
import { AboutPage } from './AboutPage'
import { sqlite } from '../App'
import { CachingService } from '../functions/cache'
import { AnimationService } from '../functions/animation'
import * as Cesium from 'cesium'
import { StarrySky } from '../components/StarrySky'
import { SocialSharing } from '../components/SocialSharing'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk'

// TODO: Dynamically assign these variables based on selected raster
const URL =
  'https://geosrv.earthbyte.org/geoserver/Lithodat/wms?service=WMS&version=1.1.0&request=GetMap&layers=Lithodat%3Acontinental_polygons_{count}Ma&bbox=-180.0%2C-90.0%2C180.0%2C90.0&width=768&height=384&srs=EPSG%3A4326&styles=&format=image%2Fpng%3B%20mode%3D8bit'
const LIMIT_UPPER = 410
const LIMIT_LOWER = 0

let animationService: AnimationService
let cachingService: CachingService
let viewer: Viewer

const Main: React.FC = () => {
  const [age, setAge] = useState(0)
  const [animateExact, setAnimateExact] = useState(false)
  const [animateLoop, setAnimateLoop] = useState(false)
  const [animateRange, setAnimateRange] = useState({
    lower: LIMIT_LOWER,
    upper: LIMIT_UPPER,
  })
  const [fps, setFps] = useState(10)
  const [increment, setIncrement] = useState(1)
  const [playing, _setPlaying] = useState(false)
  const [scene, setScene] = useState<Scene>()
  const [isSettingMenuPageShow, setIsSettingMenuPageShow] = useState(false)
  const [isRasterMenuShow, setIsRasterMenuPageShow] = useState(false)
  const [isAboutPageShow, setIsAboutPageShow] = useState(false)
  // Settings menu path: Ionic's Nav component is not available under React yet, so we have to build our own solution
  const [settingsPath, setSettingsPath] = useState('root')

  // starry background setting
  const [isStarryBackgroundEnable, setIsStarryBackgroundEnable] =
    useState(false)

  // Animation
  animationService = new AnimationService(
    cachingService,
    viewer,
    age,
    setAge,
    animateExact,
    setAnimateExact,
    fps,
    increment,
    LIMIT_LOWER,
    LIMIT_UPPER,
    animateLoop,
    setAnimateLoop,
    playing,
    _setPlaying,
    animateRange,
    setAnimateRange,
    URL
  )
  useEffect(() => {
    if (isSettingMenuPageShow) {
      animationService.setPlaying(false)
    }
  })

  useIonViewDidEnter(async () => {
    // Initialize SQLite connection
    const db = await sqlite.createConnection(
      'db_main',
      false,
      'no-encryption',
      1
    )
    await db.open()
    cachingService = new CachingService(db)

    // Rough bounding box of Australia
    Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      112.8,
      -43.7,
      153.7,
      -10.4
    )

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
      url: 'https://geosrv.earthbyte.org//geoserver/gwc/service/wmts',
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
        creditContainer: 'credit',
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      })
      setScene(viewer.scene)
      viewer.scene.fog.enabled = false
      viewer.scene.globe.showGroundAtmosphere = false
      viewer.scene.skyAtmosphere.show = false
      viewer.scene.backgroundColor = Cesium.Color.BLACK

      viewer.scene.globe.tileCacheSize = 1000

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
      viewer.imageryLayers.addImageryProvider(gplates_coastlines)
    }
  })

  const closeSettingMenuPage = () => {
    setIsSettingMenuPageShow(false)
    setSettingsPath('root')
  }

  const closeRasterMenu = () => {
    setIsRasterMenuPageShow(false)
  }

  const closeAboutPage = () => {
    setIsAboutPageShow(false)
  }

  const isViewerLoading = () => {
    return viewer.scene.globe.tilesLoaded
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <StarrySky isStarryBackgroundEnable={isStarryBackgroundEnable} />

        <div id="cesiumContainer" />
        <div id="credit" style={{ display: 'none' }} />
        <div className="toolbar-top">
          <AgeSlider
            buttons={<CustomToolbar scene={scene} />}
            animationService={animationService}
            minAge={LIMIT_LOWER}
            maxAge={LIMIT_UPPER}
            setMenuState={setIsSettingMenuPageShow}
            setMenuPath={setSettingsPath}
          />
        </div>
        <IonFab
          vertical="bottom"
          horizontal="start"
          className={'toolbar-bottom'}
        >
          <IonFabButton
            onClick={() => {
              closeRasterMenu()
            }}
          >
            <IonIcon
              src={'/assets/setting_menu_page/toolbox.svg'}
              style={{ fontSize: '2rem' }}
            />
          </IonFabButton>
          <IonFabList side="end">
            <IonFabButton
              onClick={() => {
                setIsSettingMenuPageShow(true)
              }}
            >
              <IonIcon icon={cogOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={() => {
                setIsRasterMenuPageShow(true)
              }}
            >
              <IonIcon icon={earthOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={ async () => {
                await SocialSharing(viewer, isStarryBackgroundEnable)
              }}
            >
              <IonIcon icon={exitOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/vector_map.svg'} />
            </IonFabButton>
            <IonFabButton
              onClick={() => {
                setIsAboutPageShow(true)
              }}
            >
              <IonIcon icon={informationOutline} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/question_icon.svg'} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/question_icon.svg'} />
            </IonFabButton>
            <IonFabButton>
              <IonIcon src={'assets/setting_menu_page/question_icon.svg'} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <div>
          <SettingMenuPage
            animateExact={animateExact}
            setAnimateExact={setAnimateExact}
            animateLoop={animateLoop}
            setAnimateLoop={setAnimateLoop}
            animateRange={animateRange}
            setAnimateRange={setAnimateRange}
            fps={fps}
            setFps={setFps}
            increment={increment}
            setIncrement={setIncrement}
            minAge={LIMIT_LOWER}
            maxAge={LIMIT_UPPER}
            closeModal={closeSettingMenuPage}
            isShow={isSettingMenuPageShow}
            path={settingsPath}
            setPath={setSettingsPath}
            viewer={viewer}
            isStarryBackgroundEnable={isStarryBackgroundEnable}
            setIsStarryBackgroundEnable={setIsStarryBackgroundEnable}
          />
          <RasterMenu
            isShow={isRasterMenuShow}
            closeWindow={closeRasterMenu}
            addLayer={(newLayer: any) => {
              viewer.imageryLayers.addImageryProvider(newLayer)
            }}
            isViewerLoading={isViewerLoading}
          />
          <AboutPage isShow={isAboutPageShow} closeModal={closeAboutPage} />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Main
