import React from 'react'
import { IonContent } from '@ionic/react'
import './DatasetInfo.scss'
import { serverURL } from '../functions/settings'
import { useAppState } from '../functions/appStates'
import { datasetInfoState } from '../functions/appStates'

interface ContainerProps {}

export const DatasetInfo: React.FC<ContainerProps> = () => {
  const [datasetInfo, setDatasetInfo] = useAppState(datasetInfoState)
  React.useEffect(() => {
    fetch(serverURL.replace(/\/+$/, '') + '/mobile/get_datasets_info')
      .then((response) => response.json())
      .then((jsonData: any) => {
        //console.log(jsonData)
        const values = Array.isArray(jsonData)
          ? jsonData
          : Object.values(jsonData)
        setDatasetInfo(values as any[])
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  return (
    <IonContent>
      <div className="dataset-info-page">
        {datasetInfo &&
          datasetInfo.map((data, index) => {
            return (
              <div
                key={index}
                style={{ borderBottom: '2px solid rgba(128, 128, 128, 0.3)' }}
              >
                {data.name && <h4>{data.name}</h4>}
                {data.ref && <p>{data.ref}</p>}
              </div>
            )
          })}
      </div>
    </IonContent>
  )
}
