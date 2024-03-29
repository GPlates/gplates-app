import React, { useState } from 'react'
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
import { useRecoilState, useRecoilValue } from 'recoil'
import { isCacheInfoShowState, currentRasterIDState } from '../functions/atoms'
import { getEnabledLayers, vectorLayers } from '../functions/vectorLayers'
import rasterMaps, { getRasterIndexByID } from '../functions/rasterMaps'
import { currentModel } from '../functions/rotationModel'
import { getLowResImageUrlForGeosrv } from '../functions/util'

export let cacheStatsMap: Map<string, number> = new Map<string, number>()
let total = 0

/**
 *
 */
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
  cacheStatsMap = await cachingServant.getRasterLayerCount()
  total = 0
  cacheStatsMap.forEach((value, key) => {
    total += value
  })
}

/**
 * Cache the current raster and overlays
 * for now, only work for geoserver
 */
const CacheCurrentRasterAndOverlays = async (currentRasterID: string) => {
  let overlays: string[] = []
  let enabledLayers = getEnabledLayers(currentRasterID)
  enabledLayers.forEach((layer) => {
    if (layer !== 'cities') {
      overlays.push(vectorLayers.get(currentRasterID)[layer].layerName)
    }
  })
  let index = getRasterIndexByID(currentRasterID)
  if (!index) return
  let url = getLowResImageUrlForGeosrv(
    rasterMaps[index].wmsUrl,
    rasterMaps[index].layerName,
    overlays
  )

  let allUrls = await cachingServant.getAllUrls()
  let count = 0

  currentModel?.times.forEach((time) => {
    let newUrl = url.replaceAll('{{time}}', time.toString())
    if (!allUrls?.includes(newUrl)) {
      //console.log(`caching ${newUrl}`)
      count += 1
      setTimeout(() => cachingServant.cacheURL(newUrl), count * 1000)
    }
  })
}

/**
 *
 */
interface ContainerProps {}

/**
 *
 * @returns
 */
export const CacheInfo: React.FC<ContainerProps> = () => {
  const [cacheInfoShow, setCacheInfoShow] = useRecoilState(isCacheInfoShowState)
  const [refresh, setRefresh] = useState(true)
  const [presentAlert] = useIonAlert()
  const currentRasterID = useRecoilValue(currentRasterIDState)

  let cacheStatsList = Array.from(cacheStatsMap, (entry) => {
    let nameAndUrlPattern = entry[0].split('{{sep}}')
    return [nameAndUrlPattern[0], nameAndUrlPattern[1], entry[1]]
  })

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
            <IonLabel>Cached Basemaps </IonLabel>
          </IonItem>
          {cacheStatsList.map((value, index) => (
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
                          cachingServant.purge(
                            value[1].toString(),
                            async () => {
                              await getCacheStatsData()
                              setRefresh(!refresh)
                            }
                          )
                        },
                      },
                    ],
                    onDidDismiss: (e: CustomEvent) =>
                      console.log(`Dismissed with role: ${e.detail.role}`),
                  })
                }}
              />
              <IonLabel>{value[0]} </IonLabel>
              <IonNote slot="end">{value[2]}</IonNote>
            </IonItem>
          ))}
          <IonItem key={999999}>
            <IonLabel>Total </IonLabel>
            <IonNote slot="end">{total}</IonNote>
          </IonItem>
        </IonList>
        <br></br>
        <div className="cache-info-buttons-div">
          {/* the refresh button */}
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

          {/* the purge button */}
          <IonButton
            shape="round"
            onClick={() => {
              presentAlert({
                header: `Purge All Cache Files?`,
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
                      cachingServant.clearCachedData(async () => {
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
            color={'danger'}
          >
            Purge
            <IonRippleEffect />
          </IonButton>

          {/* the Download button */}
          <IonButton
            shape="round"
            onClick={() => {
              presentAlert({
                header: `Cache current basemap and overlays?`,
                cssClass: 'populate-cache-alert',
                buttons: [
                  {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                      console.log(
                        'Info: Cache Current Basemap And Overlays cancelled!'
                      )
                    },
                  },
                  {
                    text: 'Yes',
                    role: 'confirm',
                    handler: () => {
                      CacheCurrentRasterAndOverlays(currentRasterID)
                    },
                  },
                ],
                onDidDismiss: (e: CustomEvent) =>
                  console.log(`Dismissed with role: ${e.detail.role}`),
              })
            }}
            color={'secondary'}
          >
            Download
            <IonRippleEffect />
          </IonButton>
        </div>
        <div className="cache-info-note">
          Note: Press the &quot;DOWNLOAD&quot; button to cache the current
          basemap and overlays for animation.
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
