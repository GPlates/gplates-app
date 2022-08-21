import { Preferences } from '@capacitor/preferences'

const DEFAULT_SERVER_URL = 'https://gws.gplates.org'

export let serverURL: string = DEFAULT_SERVER_URL
export const setServerURL = (url: string) => {
  //TODO: validate the url parameter
  serverURL = url
  Preferences.set({ key: 'serverURL', value: url })
}
//try to get serverURL from Preferences
Preferences.get({ key: 'serverURL' }).then((result) => {
  serverURL = result.value ?? DEFAULT_SERVER_URL
})
