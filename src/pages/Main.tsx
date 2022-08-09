import React, { useEffect, useState } from 'react'

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonPage,
  useIonLoading,
  useIonViewDidEnter,
} from '@ionic/react'

import {
  cogOutline,
  earthOutline,
  exitOutline,
  layersOutline,
  informationOutline,
} from 'ionicons/icons'

import './Main.scss'

import {
  Camera,
  Credit,
  GeographicTilingScheme,
  Ion,
  Rectangle,
  Viewer,
  WebMapTileServiceImageryProvider,
} from 'cesium'
import CustomToolbar from '../components/CustomToolbar'
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
import { VectorDataLayerMenu } from '../components/VectorDataLayerMenu'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  age,
  animateExact,
  animateFps,
  animateIncrement,
  animateLoop,
  animatePlaying,
  animateRange,
  backgroundIsStarry,
  isAboutPageShow,
  isRasterMenuShow,
  isVectorMenuShow,
  isSettingsMenuShow,
  rasterMapState,
} from '../functions/atoms'
import { getRasterMap } from '../functions/rasterMap'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMGFjYTVjNC04OTJjLTQ0Y2EtYTExOS1mYzAzOWFmYmM1OWQiLCJpZCI6MjA4OTksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1Nzg1MzEyNjF9.KyUbfBd_2aCHlvBlrBgdM3c3uDEfYyKoEmWzAHSGSsk'

let animationService: AnimationService
let cachingService: CachingService
export let viewer: Viewer

const Main: React.FC = () => {
  const [present, dismiss] = useIonLoading()

  const [vectorData, setVectorData] = useState({})

  const setIsAboutPageShow = useSetRecoilState(isAboutPageShow)
  const setRasterMenuPageShow = useSetRecoilState(isRasterMenuShow)
  const [isSettingMenuPageShow, setMenuPageShow] =
    useRecoilState(isSettingsMenuShow)
  const setIsVectorDataLayerMenuShow = useSetRecoilState(isVectorMenuShow)

  // Animation
  const setAge = useSetRecoilState(age)
  const [exact, setExact] = useRecoilState(animateExact)
  const fps = useRecoilValue(animateFps)
  const increment = useRecoilValue(animateIncrement)
  const [loop, setLoop] = useRecoilState(animateLoop)
  const [playing, _setPlaying] = useRecoilState(animatePlaying)
  const [range, setRange] = useRecoilState(animateRange)

  const setRasterMaps = useSetRecoilState(rasterMapState)
  getRasterMap(setRasterMaps)

  animationService = new AnimationService(
    cachingService,
    setAge,
    exact,
    setExact,
    fps,
    increment,
    loop,
    setLoop,
    playing,
    _setPlaying,
    range,
    setRange,
    viewer
  )
  useEffect(() => {
    if (isSettingMenuPageShow) {
      animationService.setPlaying(false)
    }
  })

  const isStarryBackgroundEnable = useRecoilValue(backgroundIsStarry)

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

    // if (document.getElementsByClassName('cesium-viewer').length === 0) {
    //   viewer = new Viewer('cesiumContainer')
    // }

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
      let initialVectorLayer =
        viewer.imageryLayers.addImageryProvider(gplates_coastlines)

      setVectorData({ coastlines: initialVectorLayer })
    }
  })

  const isViewerLoading = () => {
    return viewer.scene.globe.tilesLoaded
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <StarrySky />

        <div id="cesiumContainer" />
        <div id="credit" style={{ display: 'none' }} />
        <div className="toolbar-top">
          <AgeSlider
            buttons={<CustomToolbar scene={viewer?.scene} />}
            animationService={animationService}
          />
        </div>
        <IonFab
          vertical="bottom"
          horizontal="start"
          className={'toolbar-bottom'}
        >
          <IonFabButton
            onClick={() => {
              setRasterMenuPageShow(false)
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
                setMenuPageShow(true)
              }}
            >
              <IonIcon icon={cogOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={() => {
                setRasterMenuPageShow(true)
              }}
            >
              <IonIcon icon={earthOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={async () => {
                await SocialSharing(
                  viewer,
                  isStarryBackgroundEnable,
                  present,
                  dismiss
                )
              }}
            >
              <IonIcon icon={exitOutline} />
            </IonFabButton>
            <IonFabButton
              onClick={async () => {
                setIsVectorDataLayerMenuShow(true)
              }}
            >
              <IonIcon icon={layersOutline} />
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
          <SettingMenuPage viewer={viewer} />
          <RasterMenu
            addLayer={(newLayer: any) => {
              viewer.imageryLayers.addImageryProvider(newLayer)
              // viewer.imageryLayers.remove()
            }}
            isViewerLoading={isViewerLoading}
          />
          <AboutPage />
          <VectorDataLayerMenu
            checkedVectorData={vectorData}
            setVectorData={setVectorData}
            addLayer={(newLayer: WebMapTileServiceImageryProvider) => {
              return viewer.imageryLayers.addImageryProvider(newLayer)
            }}
            removeLayer={(targetLayer: any) => {
              viewer.imageryLayers.remove(targetLayer)
            }}
            isViewerLoading={isViewerLoading}
          />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Main
