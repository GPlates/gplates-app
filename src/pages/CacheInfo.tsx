import React, { useState, useEffect } from 'react'
import './CacheInfo.scss'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonModal,
  IonRippleEffect,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  useIonAlert,
} from '@ionic/react'
import { trashOutline } from 'ionicons/icons'
import { cachingServant } from '../functions/cache'
import { constSelector, useRecoilState, useRecoilValue } from 'recoil'
import { isCacheInfoShowState } from '../functions/atoms'
import { getEnabledLayers, vectorLayers } from '../functions/vectorLayers'
import rasterMaps, { currentRasterIndex } from '../functions/rasterMaps'
import { currentModel } from '../functions/rotationModel'
import { buildAnimationURL } from '../functions/util'

export let cacheStatsList: Map<string, number> = new Map<string, number>()
let total = 0

export const getCacheStatsData = async () => {
  //do not remove the code below
  //for future reference
  /*
  await Promise.all(
   rasterMaps.map(async (raster) => {
      let data = await cachingServant.getCount(raster.layerName)
      cacheStatsList.set(raster.layerName, data)
    })
  )
  */
  cacheStatsList = await cachingServant.getLayerCountMap()
  total = 0
  cacheStatsList.forEach((value, key) => {
    total += value
  })
}

//
const CacheCurrentRasterAndOverlays = async () => {
  let overlays: string[] = []
  let enabledLayers = getEnabledLayers(currentRasterIndex)
  enabledLayers.forEach((layer) => {
    if (layer !== 'cities') {
      overlays.push(vectorLayers.get(currentModel.name)[layer].layerName)
    }
  })
  let url = buildAnimationURL(
    rasterMaps[currentRasterIndex].wmsUrl,
    rasterMaps[currentRasterIndex].layerName,
    overlays
  )
  console.log(url)
  let allUrls = await cachingServant.getAllUrls()
  let count = 0
  console.log(allUrls)
  currentModel.times.forEach((time) => {
    console.log(time)
    let newUrl = url.replaceAll('{{time}}', time.toString())
    if (!allUrls?.includes(newUrl)) {
      console.log(`caching ${newUrl}`)
      count += 1
      setTimeout(() => cachingServant.cacheURL(newUrl), count * 1000)
    }
  })
}

interface ContainerProps {}

export const CacheInfo: React.FC<ContainerProps> = () => {
  const [cacheInfoShow, setCacheInfoShow] = useRecoilState(isCacheInfoShowState)
  const [refresh, setRefresh] = useState(true)
  const [presentAlert] = useIonAlert()

  return (
    <IonModal isOpen={cacheInfoShow} animated backdropDismiss={false}>
      <IonToolbar>
        <IonTitle>Caching</IonTitle>
        <IonButtons slot={'end'}>
          <IonButton
            onClick={() => {
              setCacheInfoShow(false)
            }}
            color={'secondary'}
          >
            Close
            <IonRippleEffect />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
        <IonItem>
          <IonLabel class="cache-db-label">Database Name </IonLabel>
          <IonNote slot="end">{cachingServant.getDBName()}</IonNote>
        </IonItem>
        <IonList>
          <IonItem key={9999997}>
            <IonLabel>Cached Rasters </IonLabel>
          </IonItem>
          {Array.from(cacheStatsList).map((value, index) => (
            <IonItem key={index}>
              <IonIcon
                icon={trashOutline}
                style={{ color: 'red', fontSize: '20px' }}
                onClick={() => {
                  presentAlert({
                    header: `Purge ${value[0]}?`,
                    cssClass: 'purge-cache-alert',
                    buttons: [
                      {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                          console.log('Info: cache purge cancelled!')
                        },
                      },
                      {
                        text: 'Yes',
                        role: 'confirm',
                        handler: () => {
                          cachingServant.purge(value[0], async () => {
                            await getCacheStatsData()
                            setRefresh(!refresh)
                          })
                        },
                      },
                    ],
                    onDidDismiss: (e: CustomEvent) =>
                      console.log(`Dismissed with role: ${e.detail.role}`),
                  })
                }}
              />
              <IonLabel>{value[0]} </IonLabel>
              <IonNote slot="end">{value[1]}</IonNote>
            </IonItem>
          ))}
          <IonItem key={999999}>
            <IonLabel>Total </IonLabel>
            <IonNote slot="end">{total}</IonNote>
          </IonItem>
        </IonList>
        <br></br>
        <div className="cache-info-buttons-div">
          <IonButton
            shape="round"
            onClick={async () => {
              await getCacheStatsData()
              setRefresh(!refresh)
            }}
            color={'tertiary'}
          >
            Refresh
            <IonRippleEffect />
          </IonButton>

          <IonButton
            shape="round"
            onClick={() => {
              presentAlert({
                header: `Cache current raster and overlays?`,
                cssClass: 'populate-cache-alert',
                buttons: [
                  {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                      console.log(
                        'Info: Cache Current Raster And Overlays cancelled!'
                      )
                    },
                  },
                  {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                      CacheCurrentRasterAndOverlays()
                    },
                  },
                ],
                onDidDismiss: (e: CustomEvent) =>
                  console.log(`Dismissed with role: ${e.detail.role}`),
              })
            }}
            color={'secondary'}
          >
            Populate
            <IonRippleEffect />
          </IonButton>
        </div>
        <div className="cache-info-note">
          Note: Press the &quot;POPULATE&quot; button to precache the current
          raster and overlays for animation. Press the red bin to purge cache.
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </IonContent>
    </IonModal>
  )
}
