import React from 'react'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar
} from '@ionic/react'

import './AboutPage.scss'
import { Browser } from '@capacitor/browser'

import { Share } from '@capacitor/share';
interface ContainerProps {
  isShow: boolean
  closeModal: Function
}

const sentEmail = async (email: string) => {
  await Share.share({
    title: email,
    text: email,
  })
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

        <div className={'about-page-intro-frame'}>
          <p className={'about-page-intro-text'}>
            The GPlates App is an education and outreach focussed application allowing users to reconstruct and visualise spatial data through geological time.
            It is a product of the plate reconstruction software, GPlates
            <IonButton className={'about-page-clickable-info'} color={'tertiary'} onClick={async () => { await Browser.open({ url: "https://www.gplates.org" })}}>https://www.gplates.org</IonButton>
            and the GPlates Portal
            <IonButton color={'tertiary'} className={'about-page-clickable-info'} onClick={async () => { await Browser.open({ url: "https://portal.gplates.org" })}}>https://portal.gplates.org</IonButton> .
          </p>
          <p className={'about-page-intro-text'}>
          The GPlates App has been developed at the University of Sydney and is supported by the Australian government funded AuScope National Collaborative Research Infrastructure System (NCRIS) program.
          </p>
          <p className={'about-page-intro-text'}>For more information on the GPlate App, please contact</p>
          <p>Maria Seton:
            <IonButton className={'about-page-clickable-info'} color={'tertiary'} onClick={async () => { await sentEmail('maria.seton@sydney.edu.au')}}>maria.seton@sydney.edu.au</IonButton>
          </p>
          <p>Michael Chin:
            <IonButton className={'about-page-clickable-info'} color={'tertiary'} onClick={async () => { await sentEmail('michael.chin@sydney.edu.au')}}>michael.chin@sydney.edu.au</IonButton>
          </p>
        </div>
      </IonContent>
    </IonModal>
  )
}