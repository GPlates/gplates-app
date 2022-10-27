import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { age, animateRange, isGraphPanelShowState } from '../functions/atoms'
import './GraphPanel.scss'
import { EChartsType } from 'echarts'
import {
  getPlatforms,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/react'
import { caretDownOutline } from 'ionicons/icons'
import { requestDataByUrl } from '../functions/util'
import { serverURL } from '../functions/settings'

let graphChart: EChartsType
let graphOptions: any

//
const sliceData = (
  xData: string[],
  yData: number[],
  lower: number,
  upper: number
) => {
  let big = Math.max(lower, upper)
  let small = Math.min(lower, upper)
  let smallIdx = -1,
    bigIdx = -1
  xData.every((x, idx) => {
    if (Number(x) > small && smallIdx < 0) {
      smallIdx = idx
      if (smallIdx > 0) {
        smallIdx -= 1 //move back one position
      }
    }
    if (Number(x) > big && bigIdx < 0) {
      bigIdx = idx + 1
      return false
    }
    return true
  })
  if (smallIdx >= 0 && bigIdx > smallIdx) {
    return {
      x: xData.slice(smallIdx, bigIdx),
      y: yData.slice(smallIdx, bigIdx),
    }
  }
  return { x: [] as string[], y: [] as number[] }
}

interface ContainerProps {}

export const GraphPanel: React.FC<ContainerProps> = () => {
  const isShow = useRecoilValue(isGraphPanelShowState)
  const [_age, setAge] = useRecoilState(age)
  const rasterMapAnimateRange = useRecoilValue(animateRange)
  const [curGraphIdx, setCurGraphIdx] = useState(0)
  const [graphList, setGraphList] = useState([] as string[][])
  const [curGraphName, setCurGraphName] = useState('')

  //
  /*
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
  }*/

  //
  const loadGraph = async (instantCurGraphIdx: number) => {
    if (!(graphList.length > instantCurGraphIdx)) return

    //the second coloum [1] is the data url
    let dataMap = await requestDataByUrl(graphList[instantCurGraphIdx][1])
    let xData: string[] = []
    let yData: number[] = []
    //we need to sort by the keys first
    let dataArray = Object.entries(dataMap)
    dataArray.sort((a: any, b: any) => {
      return Number(a[0]) - Number(b[0])
    })
    dataArray.forEach((item) => {
      xData.push(item[0])
      yData.push(Number(item[1]))
    })
    //with 1Ma step, such as [0,4, 23,24,35...] is possible.
    //so, use linear interpolate on the data before cutting the range
    /*;[data_map, data, x_vals, y_vals] = process_data(
      data_map,
      data,
      x_vals,
      y_vals
    )
    */
    if (
      rasterMapAnimateRange.upper != 0 &&
      rasterMapAnimateRange.upper != rasterMapAnimateRange.lower
    ) {
      let xy = sliceData(
        xData,
        yData,
        rasterMapAnimateRange.lower,
        rasterMapAnimateRange.upper
      )
      xData = xy.x
      yData = xy.y
      //console.log(xData)
    }
    let chartDom = document.getElementById('graphPanel-statistics')!
    //if (graphChart != null) {
    //  graphChart.dispose()
    //}
    if (!graphChart) {
      graphChart = echarts.init(chartDom)
    }

    let graphOptions = {
      grid: {
        top: '7%',
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisPointer: {
          show: true,
          snap: true,
          value: _age,
          handle: {
            show: true,
            size: 20,
            margin: 35,
            color: 'white',
            icon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z',
          },
          label: {
            show: true,
            margin: 3,
            formatter: (params: any) => {
              /*let num_age = _age
              if (typeof params.value === 'string') {
                num_age = parseInt(params.value)
                setAge(num_age)//need to think about this more
              }*/
              return `${params.value} Ma`
            },
          },
        },
      },

      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: yData,
          type: 'line',
          symbol: 'none',
        },
      ],
      tooltip: {},
    }

    // for pc mode
    if (getPlatforms().includes('desktop')) {
      graphOptions.tooltip = {
        triggerOn: 'none',
      }
    } else {
      // for touch device mode
      graphOptions.xAxis!.axisPointer.handle.icon = 'none'
    }
    graphOptions && graphChart.setOption(graphOptions)
  }

  //
  const loadGraphList = async () => {
    let data_map: any = await requestDataByUrl(
      serverURL.replace(/\/+$/, '') + '/mobile/get_graphs'
    )
    const graphList: string[][] = []
    for (let [key, value] of Object.entries(data_map)) {
      graphList.push([key, value as string])
    }
    setGraphList(graphList)
    setCurGraphName(graphList[curGraphIdx][0])
    return graphList
  }

  // initialization
  useEffect(() => {
    if (graphList.length === 0) {
      loadGraphList()
    }
    globalThis.addEventListener('resize', function () {
      graphChart.resize()
    })
  }, [])

  //
  useEffect(() => {
    loadGraph(curGraphIdx).catch((err) => {
      console.log(err)
    })
  }, [rasterMapAnimateRange])

  //
  useEffect(() => {
    if (graphOptions == undefined) {
      return
    }

    graphOptions.xAxis!.axisPointer.value = _age
    graphChart.setOption(graphOptions)
  }, [_age])

  let optionList = []
  for (let i = 0; i < graphList.length; i++) {
    optionList.push(
      <IonItem
        key={i}
        onClick={async () => {
          setCurGraphIdx(i)
          setCurGraphName(graphList[i][0])
          await loadGraph(i)
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
        <div id="graph-panel-click-trigger">
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
