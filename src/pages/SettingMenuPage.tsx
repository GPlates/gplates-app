import React, { useState } from 'react'
import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRippleEffect,
  IonRange,
  IonContent, IonToggle, IonCheckbox, IonSelectOption, IonSegment, IonSegmentButton, IonLabel,
  IonSelect
} from '@ionic/react'

interface ContainerProps {
  isShow: boolean;
  closeModal: Function;
}

// main component for setting menu
export const SettingMenuPage: React.FC<ContainerProps> = ({ isShow, closeModal }) => {
  return (
    <IonModal isOpen={isShow}
              animated
              backdropDismiss={false}
    >
      <IonHeader>
        <IonToolbar color={'primary'}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <IonTitle>Setting Menu</IonTitle>
            <IonButton
              onClick={() => {
                closeModal()
              }}
              color={'secondary'}
            >
              Close
              <IonRippleEffect />
            </IonButton>
          </div>
        </IonToolbar>

        {/* put new settings in this div element below */}
        {/* some demo is shown below */}
        <div style={{ margin: '1rem 0rem 1rem 0rem' }}>
          <IonToolbar>
            <div style={{ marginTop: '0.5rem' }}>
              <IonTitle>Animation Speed</IonTitle>
              <IonRange min={20} max={80} step={2} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '0.5rem' }}>
              <IonTitle style={{ marginTop: '0.5rem' }}>Background Color</IonTitle>
              <IonToggle />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '0.7rem', marginTop: '0.5rem' }}>
              <IonTitle style={{ marginTop: '0.5rem' }}>Enable Something</IonTitle>
              <IonCheckbox />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '0.7rem', marginTop: '0.5rem' }}>
              <IonTitle style={{ marginTop: '0.5rem' }}>Some Segmentation</IonTitle>
              <IonSegment value='sunny'>
                <IonSegmentButton value='T1'>
                  <IonLabel>Sunny</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value='T2'>
                  <IonLabel>Rainy</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginRight: '0.7rem', marginTop: '0.5rem' }}>
              <IonTitle style={{ marginTop: '0.5rem' }}>Select Something</IonTitle>
              <IonSelect>
                <IonSelectOption value='1'>1</IonSelectOption>
                <IonSelectOption value='2'>2</IonSelectOption>
                <IonSelectOption value='3'>3</IonSelectOption>
                <IonSelectOption value='4'>4</IonSelectOption>
              </IonSelect>
            </div>

          </IonToolbar>
        </div>

        {/*</div>*/}
      </IonHeader>
    </IonModal>
  )

}