import React, { useRef } from 'react'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  isPlatform,
} from '@ionic/react'
import './ModelInfo.scss'
import rasterMaps, { getRasterByID } from '../functions/rasterMaps'
import { serverURL } from '../functions/settings'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  isModelInfoShowState,
  currentRasterIDState,
  infoPath,
} from '../functions/atoms'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { CSSTransition } from 'react-transition-group'
import { AboutPage } from './AboutPage'
import { HowToUse } from './HowToUse'
//
const titles: { [key: string]: string } = {
  root: 'Information',
  model: 'Model Details',
  about: 'About GPlates',
  howtouse: 'How To Handle 3D Globe',
}

interface ContainerProps {}

export const ModelInfo: React.FC<ContainerProps> = () => {
  const [modelInfoShow, setModelInfoShow] = useRecoilState(isModelInfoShowState)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const [path, setPath] = useRecoilState(infoPath)

  let currentRaster = getRasterByID(currentRasterID)
  if (!currentRaster) return null
  let rasterID = rasterMaps.length > 0 ? currentRaster.id : ''
  let listMap = {
    Model: rasterMaps.length > 0 ? currentRaster.model : '',
    Raster: rasterMaps.length > 0 ? currentRaster.layerName : '',
    End: rasterMaps.length > 0 ? currentRaster.endTime : '',
    Start: rasterMaps.length > 0 ? currentRaster.startTime : '',
    WMTS: rasterMaps.length > 0 ? currentRaster.url : '',
    WMS: rasterMaps.length > 0 ? currentRaster.wmsUrl : '',
  }

  const subPageRouting = (path: string, name: string) => {
    return (
      <IonItem
        button
        onClick={() => {
          setPath(path)
        }}
      >
        {!isPlatform('ios') && <IonIcon icon={chevronForward} slot={'end'} />}
        <IonLabel>{name}</IonLabel>
      </IonItem>
    )
  }

  return (
    <IonModal isOpen={modelInfoShow} animated backdropDismiss={false}>
      <IonToolbar>
        {path !== 'root' && (
          <IonButtons slot={'start'}>
            <IonButton
              onClick={() => {
                setPath('root')
              }}
              color={'secondary'}
            >
              <IonIcon icon={chevronBack} />
              <IonRippleEffect />
            </IonButton>
          </IonButtons>
        )}
        <IonTitle>{titles[path]}</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              setModelInfoShow(false)
              setPath('root')
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      {/* root page */}
      <CSSTransition
        in={path === 'root'}
        timeout={200}
        unmountOnExit
        classNames={'info-fade'}
      >
        <IonContent>
          {subPageRouting('model', 'Model Details')}
          {subPageRouting('about', 'About GPlates')}
          {subPageRouting('howtouse', 'How To Handle 3D Globe')}
        </IonContent>
      </CSSTransition>

      {/* model information page */}
      <CSSTransition
        in={path === 'model'}
        timeout={200}
        unmountOnExit
        classNames={'info-fade'}
      >
        <IonContent>
          <IonList>
            {Object.entries(listMap).map((value) => (
              <IonItem key={value[0]}>
                <IonLabel>{value[0]} </IonLabel>
                <IonNote slot="end">{value[1]}</IonNote>
              </IonItem>
            ))}
          </IonList>
          <div className="raster-legend">
            <img src={serverURL + '/static/app-legend/' + rasterID + '.png'} />
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </IonContent>
      </CSSTransition>

      {/* About subpage */}
      <CSSTransition
        in={path === 'about'}
        appear={true}
        timeout={2000}
        unmountOnExit
        classNames={'info-fade'}
      >
        <AboutPage />
      </CSSTransition>

      {/* HowToUse subpage */}
      <CSSTransition
        in={path === 'howtouse'}
        timeout={4000}
        unmountOnExit
        classNames={'how-fade'}
      >
        <HowToUse />
      </CSSTransition>
    </IonModal>
  )
}
