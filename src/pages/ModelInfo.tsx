import React, { useState, useEffect } from 'react'
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
import { getRasterByID } from '../functions/rasterMaps'
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
  root: 'Info',
  model: 'Model Details',
  about: 'About GPlates',
  howtouse: 'How To Handle 3D Globe',
}

interface ContainerProps {}

export const ModelInfo: React.FC<ContainerProps> = () => {
  const [modelInfoShow, setModelInfoShow] = useRecoilState(isModelInfoShowState)
  const currentRasterID = useRecoilValue(currentRasterIDState)
  const [path, setPath] = useRecoilState(infoPath)
  const [showRasterLengend, setShowRasterLengend] = useState(false)

  //
  //
  //
  useEffect(() => {
    setShowRasterLengend(false)
  }, [currentRasterID])

  let currentRaster = getRasterByID(currentRasterID)
  if (!currentRaster) return null

  //get time range
  let timeRangeStr = 'Present-day Only'
  if (currentRaster.startTime > currentRaster.endTime) {
    timeRangeStr =
      currentRaster.startTime.toString() +
      ' Ma - ' +
      currentRaster.endTime.toString() +
      ' Ma'
  }

  //
  //
  //
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
          <IonList>
            <IonItem key={'raster-title'}>
              <IonLabel className={'info-small-label'}>{'Raster'} </IonLabel>
              <IonNote slot="end">{currentRaster?.title}</IonNote>
            </IonItem>

            <IonItem key={'time-range'}>
              <IonLabel className={'info-small-label'}>{'Time Range'}</IonLabel>
              <IonNote slot="end">{timeRangeStr}</IonNote>
            </IonItem>
            {currentRaster.model && (
              <IonItem key={'rotation-model'}>
                <IonLabel className={'info-small-label'}>
                  {'Rotation Model'}
                </IonLabel>
                <IonNote slot="end">{currentRaster.model}</IonNote>
              </IonItem>
            )}
          </IonList>

          {subPageRouting('about', 'About GPlates')}
          {subPageRouting('howtouse', 'How To Handle 3D Globe')}

          <div
            className="raster-legend"
            style={showRasterLengend ? {} : { display: 'none' }}
          >
            <img
              src={serverURL + '/static/app-legend/' + currentRasterID + '.png'}
              alt={'Raster Legend Not Available'}
              height={50}
              onLoad={() => setShowRasterLengend(true)}
            />
          </div>
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
