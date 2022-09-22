import { Storage } from '@ionic/storage'
import { serverURL } from '../functions/settings'

let store: Storage | null = null

export let vectorLayers: Map<string, any> = new Map<string, any>()

export const getVectorLayerStore = async () => {
  if (store === null) {
    store = new Storage({ name: 'vector-layers' })
    await store.create()
  }
  return store
}

//
export const loadVectorLayers = async (rasterModel: string) => {
  try {
    let response = await fetch(
      serverURL.replace(/\/+$/, '') +
        '/mobile/get_vector_layers?model=' +
        rasterModel
    )
    let json = await response.json()
    vectorLayers.set(rasterModel, json)
    ;(await getVectorLayerStore()).set(rasterModel, json)
  } catch (error) {
    console.log(error) //handle the promise rejection
    //if the network is down, try to get data from local storage
    let data = await (await getVectorLayerStore()).get(rasterModel)
    vectorLayers.set(rasterModel, data)
  }
}

//
export const getVectorLayers = (rasterModel: string) => {
  return vectorLayers.get(rasterModel)
}
