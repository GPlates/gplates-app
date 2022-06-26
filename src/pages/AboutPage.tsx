import React from 'react'
import {
  IonButton,
  IonButtons, IonCol,
  IonContent,
  IonGrid,
  IonModal,
  IonRippleEffect, IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import './AboutPage.scss'
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
      <IonContent>
        <div className={'about-page-icon'}>
          <img src={"assets/icon/icon.png"}  alt={'app icon'} />
        </div>

        <p>
        The GPlates App is an education and outreach focussed application allowing users to reconstruct and visualise spatial data through geological time. It is a product of the plate reconstruction software, GPlates (www.gplates.org) and the GPlates Portal (https://portal.gplates.org).
        </p>
        <p>
        The GPlates App has been developed at the University of Sydney and is supported by the Australian government funded AuScope National Collaborative Research Infrastructure System (NCRIS) program.
        </p>
        <p>For more information on the GPlate App, please contact</p>
        <p>Maria Seton: maria.seton@sydney.edu.au</p>
        <p>Michael Chin: michael.chin@sydney.edu.au</p>
      </IonContent>
    </IonModal>


  )
}