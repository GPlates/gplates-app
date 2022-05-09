import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
} from '@ionic/react'
import { SceneMode } from 'cesium'
import { searchOutline, homeOutline, helpOutline } from 'ionicons/icons'
import { columbusViewPath, flatMapPath, globePath } from '../theme/paths'
import './CustomToolbar.scss'
import { useState } from 'react'

const CustomToolbar = (props: any) => {
  const sceneModes = [
    {
      id: SceneMode.SCENE3D,
      name: '3D',
      onClick: () => props.scene.morphTo3D(),
      path: globePath,
    },
    {
      id: SceneMode.SCENE2D,
      name: '2D',
      onClick: () => props.scene.morphTo2D(),
      path: flatMapPath,
    },
    {
      id: SceneMode.COLUMBUS_VIEW,
      name: 'Columbus View',
      onClick: () => props.scene.morphToColumbusView(),
      path: columbusViewPath,
    },
  ]
  const [mode, setMode] = useState(sceneModes[0])

  return (
    <div>
      <IonButton>
        <IonIcon icon={searchOutline} />
      </IonButton>
      <IonButton
        onClick={() => {
          props.scene.camera.flyHome()
        }}
      >
        <IonIcon icon={homeOutline} />
      </IonButton>
      <IonButton id="scene-mode-button">
        <svg className="button scene-mode-icon" viewBox="0 0 64 64">
          <path d={mode.path} />
        </svg>
        <IonPopover dismissOnSelect={true} trigger="scene-mode-button">
          <IonContent>
            <IonList>
              {sceneModes.map((m) => (
                <IonItem
                  disabled={m.id === mode.id}
                  key={m.id}
                  onClick={() => {
                    m.onClick()
                    setMode(m)
                  }}
                >
                  <svg className="scene-mode-icon" viewBox="0 0 64 64">
                    <path d={m.path} />
                  </svg>
                  {m.name}
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonPopover>
      </IonButton>
      <IonButton>
        <IonIcon icon={helpOutline} />
      </IonButton>
    </div>
  )
}
export default CustomToolbar
