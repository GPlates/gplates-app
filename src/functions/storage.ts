import { Storage } from '@ionic/storage'

let store: Storage | null = null

//remember to init the storage at the startup
export const init = async () => {
  return getDefaultStore()
}

//
export const getDefaultStore = async () => {
  if (store === null) {
    let store_ = new Storage({ name: 'default-gplates-app-store' })
    await store_.create()
    store = store_
  }
  return store
}
