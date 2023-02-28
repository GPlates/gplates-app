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
        <h4>About This App</h4>
        <p className={'about-page-intro-text'}>
          The GPlates App is a powerful tool designed to enable users to
          reconstruct and visualize spatial data through geological time. Built
          on top of the acclaimed plate reconstruction software,&nbsp;
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.gplates.org' })
            }}
          >
            GPlates
          </a>
          ,&nbsp;the App benefits from the feature-rich web APIs and the
          flexible software architecture of its underlying technology. With its
          intuitive interface and advanced capabilities, the GPlates App is an
          invaluable tool for anyone seeking to gain a deeper understanding of
          the Earth&apos;s geological history. Whether you are a student,
          teacher, researcher, or just a curious enthusiast, the GPlates App is
          the perfect tool to explore our ever-evolving planet. In addition,
          the&nbsp;
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://gwsdoc.gplates.org' })
            }}
          >
            GPlates Web Service/APIs
          </a>
          &nbsp;and&nbsp;
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://portal.gplates.org' })
            }}
          >
            GPlates Portal
          </a>
          &nbsp;provide users with even more powerful features and
          functionalities. Advanced users will likely find them very useful.
        </p>
        <h4>Dev Team</h4>
        <p className={'about-page-intro-text'}>
          The GPlates App is developed by{' '}
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.earthbyte.org/' })
            }}
          >
            EarthByte
          </a>{' '}
          group at
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.sydney.edu.au/' })
            }}
          >
            &nbsp;The University of Sydney&nbsp;
          </a>
          with funding support from the Australian government-funded
          <a
            onClick={async () => {
              await Browser.open({ url: 'https://www.auscope.org.au/' })
            }}
          >
            &nbsp;AuScope&nbsp;
          </a>
          National Collaborative Research Infrastructure System (NCRIS) program.
        </p>
        <h4>Contact Us</h4>
        <p className={'about-page-intro-text'}>
          For more information about the GPlate App, you may contact us.
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
