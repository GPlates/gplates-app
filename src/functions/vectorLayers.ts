import { Storage } from '@ionic/storage'
import { serverURL } from '../functions/settings'

let store: Storage | null = null

//model name : layer object
export let vectorLayers: Map<string, any> = new Map<string, any>()

//raster index : layer names(array)
export let enabledLayers: Map<number, string[]> = new Map<number, string[]>()

//
export const getVectorLayerStore = async () => {
  if (store === null) {
    let store_ = new Storage({ name: 'vector-layers' })
    await store_.create()
    store = store_
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

//
export const enableLayer = (rasterIndex: number, layerName: string) => {
  let layers = enabledLayers.get(rasterIndex)
  if (layers === undefined) {
    enabledLayers.set(rasterIndex, [layerName])
  } else {
    layers.push(layerName)
  }
}

//
export const disableLayer = (rasterIndex: number, layerName: string) => {
  let layers = enabledLayers.get(rasterIndex)
  if (layers !== undefined) {
    const index = layers.indexOf(layerName)
    // only remove when item is found
    if (index > -1) {
      layers.splice(index, 1) // 1 means remove one item only
    }
  }
}

//
export const getEnabledLayers = (rasterIndex: number) => {
  return enabledLayers.get(rasterIndex) ?? []
}
