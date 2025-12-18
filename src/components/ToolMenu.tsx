import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  useIonToast,
} from '@ionic/react'
import React from 'react'
import {
  cogOutline,
  earthOutline,
  earthSharp,
  layersOutline,
  locateOutline,
  statsChartOutline,
} from 'ionicons/icons'

import { useAppState, useSetAppState } from '../functions/appStates'
import {
  isAddLocationWidgetShowState,
  isGraphPanelShowState,
  isRasterMenuShow,
  isSettingsMenuShow,
  isVectorMenuShow,
  rasterGroupState,
} from '../functions/appStates'
import { cesiumViewer } from '../functions/cesiumViewer'
import { SceneMode } from 'cesium'
import { RasterGroup } from '../functions/types'
import './ToolMenu.scss'

export const ToolMenu = () => {
  const [presentToast, dismissToast] = useIonToast()

  const setMenuPageShow = useSetAppState(isSettingsMenuShow)
  const setRasterMenuPageShow = useSetAppState(isRasterMenuShow)
  const setIsVectorDataLayerMenuShow = useSetAppState(isVectorMenuShow)

  const [isGraphPanelShow, setIsGraphPanelShow] = useAppState(
    isGraphPanelShowState,
  )
  const [showAddLocationWidget, setShowAddLocationWidget] = useAppState(
    isAddLocationWidgetShowState,
  )

  const setRasterGroup = useSetAppState(rasterGroupState)

  const toolMenuList: any[] = [
    <IonFabButton
      title="Rasters"
      key={'tool-menu-button' + 1}
      onClick={() => {
        setRasterMenuPageShow(true)
        setRasterGroup(RasterGroup.present)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={earthOutline} />
    </IonFabButton>,
    //--------------------------------------
    <IonFabButton
      title="Paleo-rasters"
      key={'tool-menu-button' + 7}
      onClick={() => {
        setRasterMenuPageShow(true)
        setRasterGroup(RasterGroup.paleo)
      }}
    >
      <IonIcon
        style={{ pointerEvents: 'none', transform: 'rotate(90deg)' }}
        icon={earthSharp}
      />
    </IonFabButton>,

    //--------------------------------------
    /*<IonFabButton
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
    </IonFabButton>,*/
    //--------------------------------------
    <IonFabButton
      title="Add Layers"
      key={'tool-menu-button' + 3}
      onClick={async () => {
        setIsVectorDataLayerMenuShow(true)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={layersOutline} />
    </IonFabButton>,
    //--------------------------------------
    /*<IonFabButton
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
    </IonFabButton>,*/
    //--------------------------------------
    <IonFabButton
      title="Show Graphs"
      key={'tool-menu-button' + 5}
      onClick={() => {
        setIsGraphPanelShow(!isGraphPanelShow)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={statsChartOutline} />
    </IonFabButton>,
    //--------------------------------------
    <IonFabButton
      title="Add Locations"
      key={'tool-menu-button' + 6}
      onClick={async () => {
        if (cesiumViewer.scene.mode !== SceneMode.SCENE3D) {
          await presentToast({
            buttons: [{ text: 'Dismiss', handler: () => dismissToast() }],
            duration: 3000,
            message:
              '"Add Location" widget is only available in 3D globe mode.',
            onDidDismiss: () => {},
          })
        } else {
          setShowAddLocationWidget(!showAddLocationWidget)
        }
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={locateOutline} />
    </IonFabButton>,
    //--------------------------------------
    <IonFabButton
      title="Settings"
      key={'tool-menu-button' + 0}
      onClick={() => {
        setMenuPageShow(true)
      }}
    >
      <IonIcon style={{ pointerEvents: 'none' }} icon={cogOutline} />
    </IonFabButton>,
  ]

  const toolMenuTopList: any[] = []
  const toolMenuEndList: any[] = []

  let buttonSize = 80
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
          setIsVectorDataLayerMenuShow(false)
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
