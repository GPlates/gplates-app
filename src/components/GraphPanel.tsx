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
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSelect,
  IonSelectOption,
  useIonLoading,
} from '@ionic/react'
import { caretDownOutline } from 'ionicons/icons'
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
    y_vals.push(Number(data_map[key]))
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
  const [curGraphName, setCurGraphName] = useState('')

  function process_data(
    data_map: any,
    data: any[],
    x_vals: number[],
    y_vals: number[]
  ) {
    let new_x_vals = []
    let new_y_vals = []
    for (let i = 0; i < x_vals.length - 1; i++) {
      new_x_vals.push(x_vals[i])
      new_y_vals.push(y_vals[i])

      // linear interpolate if having missed values
      let fromIdx = x_vals[i]
      let toIdx = x_vals[i + 1]
      let betweenNum = toIdx - fromIdx
      let increment = (y_vals[i + 1] - y_vals[i]) / betweenNum
      let curIncr = increment
      for (let inserIdx = fromIdx + 1; inserIdx < toIdx; inserIdx++) {
        new_x_vals.push(inserIdx)
        new_y_vals.push(y_vals[i] + curIncr)
        curIncr += increment
      }
    }

    let new_data = []
    for (let i = 0; i < new_x_vals.length; i++) {
      new_data.push([new_x_vals[i], new_y_vals[i]])
    }

    return [data_map, new_data, new_x_vals, new_y_vals]
  }

  const loadGraph = async (instantCurGraphIdx?: number) => {
    let curIdx = curGraphIdx
    if (instantCurGraphIdx != undefined) curIdx = instantCurGraphIdx

    // waiting for graph list loading finish
    while (graphList == undefined) await timeout(200)

    await getData(graphList[curIdx][1]).then(
      ([data_map, data, x_vals, y_vals]) => {
        //with 1Ma step, such as [0,4, 23,24,35...] is possible.
        //so, use linear interpolate on the data before cutting the range
        ;[data_map, data, x_vals, y_vals] = process_data(
          data_map,
          data,
          x_vals,
          y_vals
        )
        DATA_MAP = data_map
        DATA = data
        X_VALS = x_vals
        Y_VALS = y_vals

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

        let chartDom = document.getElementById('graphPanel-statistics')!

        if (MY_CHART != null) {
          MY_CHART.dispose()
        }
        MY_CHART = echarts.init(chartDom)

        globalThis.addEventListener('resize', function () {
          MY_CHART.resize()
        })

        OPTION = {
          grid: {
            top: '7%',
          },
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
          setCurGraphName(res[curGraphIdx][0])
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
          setCurGraphName(graphList[i][0])
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
      <div className="graph-panel-list">
        <div
          id="graph-panel-click-trigger"
          style={{
            margin: '0.5rem 10% 0 10%',
            width: 'auto',
            textAlign: 'center',
          }}
        >
          {curGraphName + '  '}
          <IonIcon icon={caretDownOutline} />
        </div>
        <IonPopover trigger="graph-panel-click-trigger" triggerAction="click">
          <IonList>{optionList}</IonList>
        </IonPopover>
      </div>
    </div>
  )
}
