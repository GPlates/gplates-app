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
import rasterMaps from '../functions/rasterMaps'
import { serverURL } from '../functions/settings'
import { useRecoilState } from 'recoil'
import {
  isModelInfoShowState,
  isAboutPageShow,
  currentRasterMapIndexState,
  infoPath,
} from '../functions/atoms'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { CSSTransition } from 'react-transition-group'
import { AboutPage } from './AboutPage'
import { HowToUse } from './HowToUse'
//
const titles: { [key: string]: string } = {
  root: 'Information',
  about: 'About',
  howtouse: 'How To Use',
}

interface ContainerProps {}

export const ModelInfo: React.FC<ContainerProps> = () => {
  const [modelInfoShow, setModelInfoShow] = useRecoilState(isModelInfoShowState)
  const [aboutPageShow, setAboutPageShow] = useRecoilState(isAboutPageShow)
  const [currentRasterMapIndex, setCurrentRasterMapIndex] = useRecoilState(
    currentRasterMapIndexState
  )
  const [path, setPath] = useRecoilState(infoPath)
  const nodeRef = useRef(null)

  let currentRaster = rasterMaps[currentRasterMapIndex]
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

      {/* put new settings in this IonList element below */}
      {/* some demo is shown below */}
      <CSSTransition
        in={path === 'root'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <IonContent>
          {subPageRouting('about', 'About')}
          {subPageRouting('howtouse', 'How To Use')}

          <div className="open-about-page-button">
            <IonButton
              expand="full"
              shape="round"
              onClick={() => {
                setAboutPageShow(true)
              }}
              color={'tertiary'}
            >
              About The GPlates App And Contact Us
              <IonRippleEffect />
            </IonButton>
          </div>
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
        timeout={200}
        nodeRef={nodeRef}
        unmountOnExit
        classNames={'fade'}
      >
        <AboutPage></AboutPage>
      </CSSTransition>

      {/* HowToUse subpage */}
      <CSSTransition
        in={path === 'howtouse'}
        timeout={200}
        unmountOnExit
        classNames={'fade'}
      >
        <HowToUse />
      </CSSTransition>
    </IonModal>
  )
}
