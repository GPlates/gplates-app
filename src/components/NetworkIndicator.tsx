import './NetworkIndicator.scss'
import React, { useEffect, useState } from 'react'
import { ConnectionStatus, Network } from '@capacitor/network'
import { useRecoilState } from 'recoil'
import { networkStatus } from '../functions/atoms'
import {
  cellularOutline,
  cloudOfflineOutline,
  extensionPuzzleOutline,
  wifiOutline,
} from 'ionicons/icons'
import { IonIcon, useIonAlert } from '@ionic/react'

let timeoutId: NodeJS.Timeout | undefined

const NetworkIndicator: React.FC = () => {
  const [animate, setAnimate] = useState(true)
  const [icon, setIcon] = useState(extensionPuzzleOutline)
  const [label, setLabel] = useState('Unknown')
  const [status, setStatus] = useRecoilState(networkStatus)
  const [presentAlert] = useIonAlert()

  const onStatusChange = (newStatus: ConnectionStatus) => {
    const status = newStatus.connectionType
    setStatus(status)
    if (status === 'wifi') {
      setIcon(wifiOutline)
      setLabel('WiFi')
    } else if (status === 'cellular') {
      setIcon(cellularOutline)
      setLabel('Cellular')
    } else if (status === 'none') {
      setIcon(cloudOfflineOutline)
      setLabel('Disconnected')
    } else {
      setIcon(extensionPuzzleOutline)
      setLabel('Unknown')
    }
    clearTimeout(timeoutId)
    setAnimate(true)
    timeoutId = setTimeout(() => {
      setAnimate(false)
    }, 5000)
  }

  useEffect(() => {
    Network.getStatus().then((status) => {
      onStatusChange(status)
    })
    Network.addListener('networkStatusChange', (status) => {
      onStatusChange(status)
    })
  }, [])

  //
  const showAlert = () => {
    presentAlert({
      header:
        'This is a network indicator. ' +
        'The App needs to download data from our server. ' +
        'Switch to WiFi to avoid using too much of your cellular data.',
      cssClass: 'network-indicator-alert',
      buttons: [
        {
          text: 'Dismiss',
          role: 'confirm',
          handler: () => {},
        },
      ],
      onDidDismiss: (e: CustomEvent) => {
        let element = document.getElementById('network-indicator-label')
        element?.classList.add('animate')
        setTimeout(() => {
          element?.classList.remove('animate')
        }, 5000)
      },
    })
  }

  return (
    <div className={status + ' indicator'}>
      <div
        className={(animate ? 'animate ' : '') + 'label'}
        id="network-indicator-label"
      >
        <span>{label}</span>
      </div>
      <IonIcon icon={icon} onClick={showAlert} />
    </div>
  )
}
export default NetworkIndicator
