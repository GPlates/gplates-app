import React from 'react'
import { IonButton, IonButtons, IonModal, IonRippleEffect, IonTitle, IonToolbar } from '@ionic/react'

interface ContainerProps {
  isShow: boolean
  closeModal: Function
}

export const AboutPage: React.FC<ContainerProps> = ({ isShow,
                                                      closeModal}) => {


  return (
    <IonModal isOpen={isShow} animated backdropDismiss={false}>
      <IonToolbar>
        <IonTitle>About</IonTitle>
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
    </IonModal>


  )
}