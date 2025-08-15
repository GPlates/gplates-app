import {
  IonButton,
  IonContent,
  IonPage,
  useIonViewDidLeave,
} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
//import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import * as Types from 'swiper/types'

import { Preferences } from '@capacitor/preferences'
import { SplashScreen } from '@capacitor/splash-screen'
//import { useNavigate } from 'react-router'
import { useHistory } from 'react-router'
import './Tutorial.scss'

const Tutorial: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [show, setShow] = useState(false)
  const [swiper, setSwiper] = useState<Types.Swiper>()
  //const navigate = useNavigate()
  const history = useHistory()

  useEffect(() => {
    // Navigate to main if user has already completed the tutorial
    Preferences.get({
      key: 'hasFinishedTutorial',
    }).then((res) => {
      if (res.value) {
        history.replace('/main')
        //navigate('/main', { replace: true })
      } else {
        setShow(true)
        SplashScreen.hide()
      }
    })
  }, [])

  useIonViewDidLeave(() => setShow(true))

  const onSlideChange = (s: Types.Swiper) => setIndex(s.realIndex)

  const finishTutorial = () => {
    return Preferences.set({ key: 'hasFinishedTutorial', value: 'true' }).then(
      () => history.replace('/main'),
      //() => navigate('/main', { replace: true }),
    )
  }

  const getPrevSkip = () => {
    if (index === 0) {
      return (
        <IonButton
          className={'prev nav-button'}
          fill={'clear'}
          onClick={finishTutorial}
        >
          Skip
        </IonButton>
      )
    } else {
      return (
        <IonButton
          className={'prev nav-button'}
          fill={'clear'}
          onClick={() => swiper?.slidePrev()}
        >
          Prev
        </IonButton>
      )
    }
  }

  const getNextFinish = () => {
    if (swiper && index === swiper.slides.length - 1) {
      return (
        <IonButton
          className={'next nav-button'}
          fill={'clear'}
          onClick={finishTutorial}
        >
          Finish
        </IonButton>
      )
    } else {
      return (
        <IonButton
          className={'next nav-button'}
          fill={'clear'}
          onClick={() => swiper?.slideNext()}
        >
          Next
        </IonButton>
      )
    }
  }

  return (
    <IonPage>
      <CSSTransition in={show} timeout={200} unmountOnExit classNames={'fade'}>
        <IonContent fullscreen scrollY={false}>
          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination]}
            onSlideChange={(s) => onSlideChange(s)}
            onSwiper={(s) => setSwiper(s)}
            className={'tutorial-swiper slide' + index}
          >
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide0.svg'} />
              <h1>Welcome to GPlates!</h1>
              <p>Swipe left to get started</p>
            </SwiperSlide>
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide1.svg'} />
              <h3>Age Slider</h3>
              <p>
                Use the age slider (top right) to reconstruct geological and
                paleographic features through time
              </p>
            </SwiperSlide>
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide2.svg'} />
              <h3>Toolbox</h3>
              <p>
                Access settings, tools, and more from the toolbox (bottom left)
              </p>
            </SwiperSlide>
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide3.png'} />
              <h3>Rasters</h3>
              <p>Explore different models with the raster menu</p>
            </SwiperSlide>
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide4.svg'} />
              <h3>Overlays</h3>
              <p>See additional information, like coastlines, with overlays</p>
            </SwiperSlide>
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide5.svg'} />
              <h3>Graphs</h3>
              <p>
                View stats, such as global temperature, as they change through
                time
              </p>
            </SwiperSlide>
            <SwiperSlide className={'ion-padding'}>
              <img src={'/assets/slides/slide6.svg'} />
              <h3>Locations</h3>
              <p>
                Pinpoint places on the globe and keep track of their location as
                time changes
              </p>
            </SwiperSlide>
          </Swiper>
          {getPrevSkip()}
          {getNextFinish()}
        </IonContent>
      </CSSTransition>
    </IonPage>
  )
}

export default Tutorial
