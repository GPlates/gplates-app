import { Storage } from '@ionic/storage'
import { serverURL } from '../functions/settings'

let store: Storage | null = null

//raster/basemap ID : layers config data in json format
//each raster can have several vector layers
export let vectorLayers: Map<string, any> = new Map<string, any>()

//raster/basemap ID : vector layer names(array)
const enabledLayers: Map<string, string[]> = new Map<string, string[]>()

//
// get vector-layers local storage object
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
// fetch the vector-layer configurate for a given raster ID from server
//
export const loadVectorLayers = async (rasterID: string) => {
  try {
    let response = await fetch(
      serverURL.replace(/\/+$/, '') +
        '/mobile/get_vector_layers?raster=' +
        rasterID
    )
    let json = await response.json()
    //console.log(json)
    vectorLayers.set(rasterID, json)
    let vectorLayerStore = await getVectorLayerStore()
    vectorLayerStore.set(rasterID, json)
    //console.log(json)
  } catch (error) {
    console.log(error) //handle the promise rejection
    //if the network is down, try to get data from local storage
    let data = await (await getVectorLayerStore()).get(rasterID)
    vectorLayers.set(rasterID, data)
  }
}

//
// get all vector layers for a raster
//
export const getVectorLayers = (rasterID: string) => {
  return vectorLayers.get(rasterID)
}

//
// add a new vector layer name into enabledLayers
//
export const enableLayer = (rasterID: string, layerName: string) => {
  let layers = enabledLayers.get(rasterID)
  //console.log('enableLayer')
  //console.log(layers)
  if (layers === undefined) {
    enabledLayers.set(rasterID, [layerName])
  } else {
    if (layers.indexOf(layerName) == -1) {
      layers.push(layerName)
    }
  }
  console.log(enabledLayers)
}

//
// remove a vector layer name from enabledLayers
//
export const disableLayer = (rasterID: string, layerName: string) => {
  let layers = enabledLayers.get(rasterID)
  if (layers !== undefined) {
    const index = layers.indexOf(layerName)
    // only remove when item is found
    if (index > -1) {
      layers.splice(index, 1) // 1 means remove one item only
    }
  }
}

//
// get enable the vector layer names
//
export const getEnabledLayers = (rasterID: string) => {
  //console.log(enabledLayers)
  return enabledLayers.get(rasterID) ?? []
}
