import React, { useState } from 'react'
import './SettingMenuPage.css'
import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRippleEffect,
  IonRange,
  IonToggle,
  IonCheckbox,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSelect, IonContent, IonList, IonItemDivider, IonItem, IonRadioGroup, IonRadio, IonButtons
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

      <IonToolbar>
        <IonTitle>Setting Menu</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              closeModal()
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
      <IonList>
        <IonItemDivider>Main Setting Section1</IonItemDivider>
        <IonItem>
          <IonLabel>Animation Speed</IonLabel>
        </IonItem>
        <IonItem>
          <IonRange min={20} max={80} step={2} />
        </IonItem>

        <IonItemDivider>Main Setting Section2</IonItemDivider>
        <IonItem>
          <IonLabel>Background Color</IonLabel>
          <IonToggle />
        </IonItem>

        <IonItemDivider>Main Setting Section3</IonItemDivider>
        <IonItem>
          <IonLabel>Enable Something</IonLabel>
          <IonCheckbox class={'single-setting-option'} />
        </IonItem>

        <IonItemDivider>Main Setting Section4</IonItemDivider>
        <IonItem>
          <IonLabel>Some Segmentation</IonLabel>
          <IonRadioGroup>
            <IonItem>
              <IonItem>
                <IonLabel>1</IonLabel>
                <IonRadio slot='end' value='1' />
              </IonItem>
              <IonItem>
                <IonLabel>2</IonLabel>
                <IonRadio slot='end' value='2' />
              </IonItem>
            </IonItem>
          </IonRadioGroup>
        </IonItem>

        <IonItemDivider>Main Setting Section5</IonItemDivider>
        <IonItem>
          <IonLabel>Select Something</IonLabel>
          <IonSelect>
            <IonSelectOption value='1'>1</IonSelectOption>
            <IonSelectOption value='2'>2</IonSelectOption>
            <IonSelectOption value='3'>3</IonSelectOption>
            <IonSelectOption value='4'>4</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
    </IonModal>
  )

}