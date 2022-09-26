import { Network } from '@capacitor/network'
import { UseIonAlertResult } from '@ionic/react'
import { SetterOrUpdater } from 'recoil'
import { Preferences } from '@capacitor/preferences'

export const canDownload = async (downloadOnCellular: boolean) => {
  const status = await Network.getStatus()

  return (
    status.connected &&
    (status.connectionType !== 'cellular' || downloadOnCellular)
  )
}

let hasPresented = false

export const presentDataAlert = async (
  ionAlert: UseIonAlertResult,
  setDownloadOnCellular: SetterOrUpdater<boolean>
) => {
  if (!hasPresented) {
    const [presentAlert] = ionAlert
    const unpauseButton = {
      text: 'Unpause',
      handler: () => {
        setDownloadOnCellular(true)
        Preferences.set({
          key: 'networkSettings',
          value: JSON.stringify({ downloadOnCellular: true }),
        })
      },
    }
    await presentAlert({
      backdropDismiss: false,
      header: 'Download paused',
      subHeader: '',
      message:
        'Downloading imagery over a mobile connection can lead to high data usage. Connecting to WiFi is recommended',
      buttons: [unpauseButton, 'OK'],
    })
    hasPresented = true
  }
  return
}
