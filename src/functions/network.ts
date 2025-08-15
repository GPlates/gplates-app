import { Network } from '@capacitor/network'
import { UseIonAlertResult } from '@ionic/react'
import { SetterOrUpdater } from 'recoil'
import { Preferences } from '@capacitor/preferences'

let ionAlert: UseIonAlertResult
let setDownloadOnCellular: SetterOrUpdater<boolean>

/**
 *
 * @param alert
 * @param setter
 */
export const setPresentDataAlert = (
  alert: UseIonAlertResult,
  setter: SetterOrUpdater<boolean>,
) => {
  ionAlert = alert
  setDownloadOnCellular = setter
}

/**
 *
 * @param downloadOnCellular
 * @returns
 */
export const canDownload = async (downloadOnCellular: boolean) => {
  const status = await Network.getStatus()

  return (
    status.connected &&
    (status.connectionType !== 'cellular' || downloadOnCellular)
  )
}

let hasPresented = false

/**
 *
 * @returns
 */
export const presentDataAlert = async () => {
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
