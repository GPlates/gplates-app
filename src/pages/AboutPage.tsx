import React from 'react'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import './AboutPage.scss'
import { Browser } from '@capacitor/browser'
import { useRecoilState } from 'recoil'
import { isAboutPageShow } from '../functions/atoms'

interface ContainerProps {}

export const AboutPage: React.FC<ContainerProps> = () => {
  const [isShow, setIsShow] = useRecoilState(isAboutPageShow)

  return (
    <IonContent>
      <div className={'about-page-icon'}>
        <img src={'assets/icon/icon.png'} alt={'app icon'} />
      </div>

      <div className={'about-page-intro-frame'}>
        <p className={'about-page-intro-text'}>
          The GPlates App is an education and outreach focussed application
          allowing users to reconstruct and visualise spatial data through
          geological time. It is a product of the plate reconstruction
          software,&nbsp;
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.gplates.org' })
            }}
          >
            GPlates
          </a>
          ,&nbsp;the&nbsp;
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://gwsdoc.gplates.org' })
            }}
          >
            GPlates Web Service
          </a>
          &nbsp;and the&nbsp;
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://portal.gplates.org' })
            }}
          >
            GPlates Portal
          </a>
          .
        </p>

        <p className={'about-page-intro-text'}>
          The GPlates App has been developed at
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.sydney.edu.au/' })
            }}
          >
            &nbsp;the University of Sydney&nbsp;
          </a>
          and is supported by the Australian government funded
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.auscope.org.au/' })
            }}
          >
            &nbsp;AuScope&nbsp;
          </a>
          National Collaborative Research Infrastructure System (NCRIS) program.
        </p>
        <p className={'about-page-intro-text'}>
          For more information on the GPlate App, please contact
        </p>

        <p>
          Maria Seton:&nbsp;
          <a href="mailto:maria.seton@sydney.edu.au">
            maria.seton@sydney.edu.au
          </a>
        </p>
        <p>
          Michael Chin:&nbsp;
          <a href="mailto:michael.chin@sydney.edu.au">
            michael.chin@sydney.edu.au
          </a>
        </p>
        <br />
      </div>
      <div className={'about-page-copyright'}>
        Copyright © 2022 The University of Sydney. All rights reserved.
      </div>
    </IonContent>
  )
}
