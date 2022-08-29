import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonLoading,
  useIonToast,
} from '@ionic/react'
import React, { useState } from 'react'
import {
  cogOutline,
  earthOutline,
  informationCircleOutline,
  layersOutline,
  locateOutline,
  shareSocialOutline,
  statsChartOutline,
} from 'ionicons/icons'
import { SocialSharing } from './SocialSharing'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  isAboutPageShow,
  isAddLocationWidgetShowState,
  isGraphPanelShowState,
  isRasterMenuShow,
  isSettingsMenuShow,
  isVectorMenuShow,
} from '../functions/atoms'

export const ToolMenu = () => {
  const [presentToast, dismissToast] = useIonToast()
  const [present, dismiss] = useIonLoading()

  const setMenuPageShow = useSetRecoilState(isSettingsMenuShow)
  const setRasterMenuPageShow = useSetRecoilState(isRasterMenuShow)
  const setIsVectorDataLayerMenuShow = useSetRecoilState(isVectorMenuShow)
  const setIsAboutPageShow = useSetRecoilState(isAboutPageShow)
  const [isGraphPanelShow, setIsGraphPanelShow] = useRecoilState(
    isGraphPanelShowState
  )

  const [showAddLocationWidget, setShowAddLocationWidget] = useRecoilState(
    isAddLocationWidgetShowState
  )

  const toolMenuList: any[] = [
    <IonFabButton
      key={'tool-menu-button' + 0}
      onClick={() => {
        setMenuPageShow(true)
      }}
    >
      <IonIcon icon={cogOutline} />
    </IonFabButton>,
    <IonFabButton
      key={'tool-menu-button' + 1}
      onClick={() => {
        setRasterMenuPageShow(true)
      }}
    >
      <IonIcon icon={earthOutline} />
    </IonFabButton>,
    <IonFabButton
      key={'tool-menu-button' + 2}
      onClick={async () => {
        await SocialSharing(present, dismiss, presentToast, dismissToast)
      }}
    >
      <IonIcon icon={shareSocialOutline}></IonIcon>
    </IonFabButton>,
    <IonFabButton
      key={'tool-menu-button' + 3}
      onClick={async () => {
        setIsVectorDataLayerMenuShow(true)
      }}
    >
      <IonIcon icon={layersOutline} />
    </IonFabButton>,
    <IonFabButton
      key={'tool-menu-button' + 4}
      onClick={() => {
        setIsAboutPageShow(true)
      }}
    >
      <IonIcon icon={informationCircleOutline} />
    </IonFabButton>,
    <IonFabButton
      key={'tool-menu-button' + 5}
      onClick={() => {
        setIsGraphPanelShow(!isGraphPanelShow)
      }}
    >
      <IonIcon icon={statsChartOutline} />
    </IonFabButton>,
    <IonFabButton
      key={'tool-menu-button' + 6}
      onClick={() => {
        console.log(showAddLocationWidget)
        setShowAddLocationWidget(!showAddLocationWidget)
      }}
    >
      <IonIcon icon={locateOutline} />
    </IonFabButton>,
  ]

  const toolMenuTopList: any[] = []
  const toolMenuEndList: any[] = []

  let buttonSize = 58
  let mainButtonSize = 56 + 10 + 10 // button size + left margin + right margin
  let count = 0
  for (let idx = 0; idx < screen.width - mainButtonSize; idx += buttonSize) {
    if (count >= toolMenuList.length) {
      break
    }
    toolMenuEndList.push(toolMenuList[count])
    count++
  }
  while (count < toolMenuList.length) {
    toolMenuTopList.push(toolMenuList[count])
    count++
  }

  return (
    <IonFab vertical="bottom" horizontal="start" className={'toolbar-bottom'}>
      <IonFabButton
        onClick={() => {
          setRasterMenuPageShow(false)
        }}
      >
        <IonIcon
          src={'/assets/setting_menu_page/toolbox.svg'}
          style={{ fontSize: '2rem' }}
        />
      </IonFabButton>
      <IonFabList side="top">{toolMenuTopList}</IonFabList>
      <IonFabList side="end">{toolMenuEndList}</IonFabList>
    </IonFab>
  )
}
