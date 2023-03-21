import { Preferences } from '@capacitor/preferences'

const DEFAULT_SERVER_URL = 'https://gws.gplates.org'

export let serverURL: string = DEFAULT_SERVER_URL

//
// save the server URL in Preferences if it has been changed
// return true if changed. return false if not changed
//
export const setServerURL = async (url: string) => {
  //TODO: validate the url parameter
  serverURL = url.replace(/\/+$/, '') //remove the trailing /, important

  let oldUrl = await Preferences.get({ key: 'serverURL' })
  if (serverURL != oldUrl.value) {
    Preferences.set({ key: 'serverURL', value: url })
    return true
  }
  return false
}

//try to get serverURL from Preferences
Preferences.get({ key: 'serverURL' }).then((result) => {
  serverURL = result.value ?? DEFAULT_SERVER_URL
})

export const DEBUG = false
