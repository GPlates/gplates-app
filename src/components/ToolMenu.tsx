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
  isModelInfoShowState,
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
  const setShowModelInfo = useSetRecoilState(isModelInfoShowState)

  const toolMenuList: any[] = [
    <IonFabButton
      title="Choose Rasters"
      key={'tool-menu-button' + 1}
      onClick={() => {
        setRasterMenuPageShow(true)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={earthOutline} />
    </IonFabButton>,
    <IonFabButton
      title="Settings"
      key={'tool-menu-button' + 0}
      onClick={() => {
        setMenuPageShow(true)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={cogOutline} />
    </IonFabButton>,
    <IonFabButton
      title="Share Screenshot"
      key={'tool-menu-button' + 2}
      onClick={async () => {
        await SocialSharing(present, dismiss, presentToast, dismissToast)
      }}
    >
      <IonIcon
        style={{ pointerEvents: 'none' }}
        icon={shareSocialOutline}
      ></IonIcon>
    </IonFabButton>,
    <IonFabButton
      title="Add Layers"
      key={'tool-menu-button' + 3}
      onClick={async () => {
        setIsVectorDataLayerMenuShow(true)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={layersOutline} />
    </IonFabButton>,
    <IonFabButton
      title="Model Info"
      key={'tool-menu-button' + 4}
      onClick={() => {
        setShowModelInfo(true)
      }}
    >
      <IonIcon
        style={{ pointerEvents: 'none' }}
        icon={informationCircleOutline}
      />
    </IonFabButton>,
    <IonFabButton
      title="Show Graphs"
      key={'tool-menu-button' + 5}
      onClick={() => {
        setIsGraphPanelShow(!isGraphPanelShow)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={statsChartOutline} />
    </IonFabButton>,
    <IonFabButton
      title="Add Locations"
      key={'tool-menu-button' + 6}
      onClick={() => {
        setShowAddLocationWidget(!showAddLocationWidget)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={locateOutline} />
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
          setIsGraphPanelShow(false)
          setShowAddLocationWidget(false)
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
