import { Storage } from '@ionic/storage'

let store = new Storage({ name: 'default' })

//remember to init the storage at the startup
export const init = async () => {
  await store.create()
}
export default store
