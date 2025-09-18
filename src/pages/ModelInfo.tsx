import React, { useState, useEffect } from 'react'
import {
  IonButton,
  IonButtons,
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
import { useAppState, useAppStateValue } from '../functions/appStates'
import {
  isModelInfoShowState,
  currentRasterIDState,
  infoPath,
} from '../functions/appStates'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { AboutPage } from './AboutPage'
import { HowToUse } from './HowToUse'
//
const titles: { [key: string]: string } = {
  root: 'Info',
  model: 'Model Details',
  about: 'About',
  howtouse: 'How To Handle 3D Globe',
}

interface ContainerProps {}

export const ModelInfo: React.FC<ContainerProps> = () => {
  const [modelInfoShow, setModelInfoShow] = useAppState(isModelInfoShowState)
  const currentRasterID = useAppStateValue(currentRasterIDState)
  const [path, setPath] = useAppState(infoPath)
  const [showRasterLengend, setShowRasterLengend] = useState(false)

  /**
   *
   */
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

  /**
   *
   * @param path
   * @param name
   * @returns
   */
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

  /**
   *
   * @returns
   */
  const rootPage = () => {
    return (
      <div className={'model-info-content'}>
        <IonList>
          <IonItem key={'raster-title'}>
            <IonLabel className={'info-small-label'}>{'Title'} </IonLabel>
            <IonNote slot="end">{currentRaster?.title}</IonNote>
          </IonItem>

          <IonItem key={'raster-subtitle'}>
            <IonLabel className={'info-small-label'}>{'Subtitle'} </IonLabel>
            <IonNote slot="end">{currentRaster?.subTitle}</IonNote>
          </IonItem>

          <IonItem key={'basemap-id'}>
            <IonLabel className={'info-small-label'}>{'Basemap ID'} </IonLabel>
            <IonNote slot="end">{currentRaster?.id}</IonNote>
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

          {subPageRouting('about', 'About GPlates')}
          {subPageRouting('howtouse', 'How To Handle 3D Globe')}
        </IonList>
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
      </div>
    )
  }

  return (
    <IonModal
      isOpen={modelInfoShow}
      animated
      backdropDismiss={false}
      className={'model-info-model'}
    >
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

      {path == 'root' && rootPage()}

      {/* About subpage */}

      {path == 'about' && <AboutPage />}

      {/* HowToUse subpage */}

      {path == 'howtouse' && <HowToUse />}
    </IonModal>
  )
}
