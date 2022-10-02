import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { age, animateRange, isGraphPanelShowState } from '../functions/atoms'
import './GraphPanel.scss'
import { EChartsType } from 'echarts'
import {
  getPlatforms,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
  useIonLoading,
} from '@ionic/react'
import rasterMaps from '../functions/rasterMaps'
import { requestDataByUrl, timeout } from '../functions/util'
import { getDefaultStore } from '../functions/storage'
import { serverURL } from '../functions/settings'

type EChartsOption = echarts.EChartsOption
let MY_CHART: EChartsType
let OPTION: EChartsOption
let X_VALS
let Y_VALS
let DATA
let DATA_MAP: string[]

const getGraphList = async () => {
  let data_map: any = await requestDataByUrl(
    serverURL.replace(/\/+$/, '') + '/mobile/get_graphs'
  )
  const graphList = []
  for (let key in data_map) {
    graphList.push([key, data_map[key]])
  }
  return graphList
}

async function getData(url: string) {
  let data_map: any = await requestDataByUrl(url)
  let x_vals: number[] = []
  let y_vals: number[] = []
  for (let key in data_map) {
    x_vals.push(Number(key))
    y_vals.push(data_map[key])
  }

  let data = []
  for (let i = 0; i < x_vals.length; i++) {
    data.push([x_vals[i], y_vals[i]])
  }

  return [data_map, data, x_vals, y_vals]
}

interface ContainerProps {}

export const GraphPanel: React.FC<ContainerProps> = () => {
  const isShow = useRecoilValue(isGraphPanelShowState)
  const [_age, setAge] = useRecoilState(age)
  const rasterMapAnimateRange = useRecoilValue(animateRange)
  const [curGraphIdx, setCurGraphIdx] = useState(0)
  const [present, dismiss] = useIonLoading()
  const [graphList, setGraphList] = useState([] as string[][])
  const loadGraph = async (instantCurGraphIdx?: number) => {
    let curIdx = curGraphIdx
    if (instantCurGraphIdx != undefined) curIdx = instantCurGraphIdx

    // waiting for graph list loading finish
    while (graphList == undefined) await timeout(200)

    await getData(graphList[curIdx][1]).then(
      ([data_map, data, x_vals, y_vals]) => {
        DATA_MAP = data_map
        DATA = data
        X_VALS = x_vals
        Y_VALS = y_vals
        //TODO: The time data fetched from the server may not be arithmetic sequence
        //with 1Ma step, such as [0,4, 23,24,35...] is possible.
        //the code below needs improvement
        //Better to use linear interpolate on the data before cutting the range
        if (rasterMapAnimateRange.upper != 0) {
          DATA = data.slice(
            rasterMapAnimateRange.lower,
            rasterMapAnimateRange.upper
          )
          X_VALS = x_vals.slice(
            rasterMapAnimateRange.lower,
            rasterMapAnimateRange.upper
          )
          Y_VALS = y_vals.slice(
            rasterMapAnimateRange.lower,
            rasterMapAnimateRange.upper
          )
        }
        console.log(DATA)
        console.log(X_VALS)
        console.log(Y_VALS)
        console.log(rasterMapAnimateRange)

        let chartDom = document.getElementById('graphPanel-statistics')!

        if (MY_CHART != null) {
          MY_CHART.dispose()
        }
        MY_CHART = echarts.init(chartDom)

        globalThis.addEventListener('resize', function () {
          MY_CHART.resize()
        })

        OPTION = {
          title: [
            {
              left: 'center',
              top: '5%',
              text: graphList[curIdx][0],
            },
          ],
          xAxis: {
            type: 'category',
            data: X_VALS,
            axisPointer: {
              show: true,
              snap: true,
              value: _age,
              handle: {
                show: true,
                size: 20,
                margin: 35,
                color: 'white',
              },
              label: {
                show: true,
                margin: 3,
                formatter: (params) => {
                  let num_age = _age
                  if (typeof params.value === 'string') {
                    num_age = parseInt(params.value)
                    //setAge(num_age)//need to think about this more
                  }
                  return num_age + 'Ma : ' + DATA_MAP[num_age]
                },
              },
            },
          },

          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: DATA,
              type: 'line',
              symbol: 'none',
            },
          ],
        }

        // for pc mode
        if (getPlatforms().includes('desktop')) {
          OPTION.tooltip = {
            triggerOn: 'none',
          }
        } else {
          // for touch device mode
          // @ts-ignore
          OPTION.xAxis!.axisPointer.handle.icon = 'none'
        }
        OPTION && MY_CHART.setOption(OPTION)
      }
    )
  }
  // initialization
  useEffect(() => {
    if (graphList.length === 0) {
      getGraphList()
        .then((res) => {
          setGraphList(res)
          for (let each in res) {
            getData(each[1]) // add all data into local storage
          }
        })
        .catch((err) => {})
    }
  }, [])

  useEffect(() => {
    loadGraph().catch((err) => {})
  }, [rasterMapAnimateRange])

  useEffect(() => {
    if (OPTION == undefined) {
      return
    }
    // @ts-ignore
    OPTION.xAxis!.axisPointer.value = _age
    MY_CHART.setOption(OPTION)
  }, [_age])

  let optionList = []
  for (let i = 0; i < graphList.length; i++) {
    optionList.push(
      <IonItem
        key={i}
        onClick={async () => {
          await present({ message: 'Loading...' })
          setCurGraphIdx(i)
          await loadGraph(i)
          await dismiss()
        }}
      >
        <IonLabel
          style={
            i === curGraphIdx
              ? { fontWeight: 'bolder', color: 'var(--ion-color-primary)' }
              : {}
          }
        >
          {graphList[i][0]}
        </IonLabel>
      </IonItem>
    )
  }

  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      <div id="graphPanel-statistics" className="graph-panel-statistics" />
      <IonAccordionGroup className="graph-panel-list" hidden={!isShow}>
        <IonAccordion value="first">
          <IonItem slot="header">
            <IonLabel>Graph List</IonLabel>
          </IonItem>
          <div slot="content">
            <IonList>{optionList}</IonList>
          </div>
        </IonAccordion>
      </IonAccordionGroup>
    </div>
  )
}
