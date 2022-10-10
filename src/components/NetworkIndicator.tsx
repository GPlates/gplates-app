import './NetworkIndicator.scss'
import React, { useEffect, useState } from 'react'
import { ConnectionStatus, Network } from '@capacitor/network'
import { useRecoilState } from 'recoil'
import { networkStatus } from '../functions/atoms'
import {
  cellularOutline,
  cloudOfflineOutline,
  helpOutline,
  wifiOutline,
} from 'ionicons/icons'
import { IonIcon } from '@ionic/react'

let timeoutId: NodeJS.Timeout | undefined

const NetworkIndicator: React.FC = () => {
  const [animate, setAnimate] = useState(true)
  const [icon, setIcon] = useState(helpOutline)
  const [label, setLabel] = useState('Unknown')
  const [status, setStatus] = useRecoilState(networkStatus)

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
      setIcon(helpOutline)
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

  return (
    <div className={status + ' indicator'}>
      <div className={(animate ? 'animate ' : '') + 'label'}>
        <span>{label}</span>
      </div>
      <IonIcon icon={icon} />
    </div>
  )
}
export default NetworkIndicator
