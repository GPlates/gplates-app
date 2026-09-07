import { Preferences } from '@capacitor/preferences'

const DEFAULT_SERVER_URL = 'https://gws.gplates.org'

export let serverURL: string = DEFAULT_SERVER_URL

//
// save the server URL in Preferences if it has been changed
// return true if changed. return false if not changed
//
/**
 * return true if the given string is a well-formed http(s) URL
 */
export const isValidServerURL = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const setServerURL = async (url: string) => {
  if (!isValidServerURL(url)) {
    // invalid URL -- leave serverURL untouched, caller should show an error
    return false
  }
  const trimmedUrl = url.replace(/\/+$/, '') //remove the trailing /, important
  serverURL = trimmedUrl

  let oldUrl = await Preferences.get({ key: 'serverURL' })
  if (serverURL != oldUrl.value) {
    Preferences.set({ key: 'serverURL', value: trimmedUrl })
    return true
  }
  return false
}

//try to get serverURL from Preferences
Preferences.get({ key: 'serverURL' }).then((result) => {
  serverURL = result.value ?? DEFAULT_SERVER_URL
})

export const DEBUG = false
