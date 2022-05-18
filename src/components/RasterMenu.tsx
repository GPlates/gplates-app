import React from 'react'
import {
  IonBackdrop,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardSubtitle, IonCardTitle,
  IonContent, IonGrid, IonIcon, IonImg, IonModal,
  IonPopover, IonRow,
  IonSlide,
  IonSlides
} from '@ionic/react'

import './RasterMenu.scss'

interface ContainerProps {
  isShow: boolean
  closeWindow: Function
}


export const RasterMenu: React.FC<ContainerProps> = ({ isShow, closeWindow }) => {
  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      <div className={'raster_menu_backdrop'} onClick={() => {
        closeWindow()
      }} />
      <div className={'raster_menu_scroll'}>
        <IonCard style={{ display: 'inline-block', opacity: '1' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle color={'primary'}>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'selected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} style={{ marginTop: '1rem' }} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>
        <IonCard style={{ display: 'inline-block' }}>
          <IonIcon class={'demo_raster_map_icon'} />
          <IonCardHeader>
            <IonCardTitle>Clouds</IonCardTitle>
            <IonCardSubtitle>Current</IonCardSubtitle>
          </IonCardHeader>
          <div className={'unselected_opt'} />
        </IonCard>

      </div>
    </div>
  )
}