import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { age, animateRange, isGraphPanelShowState } from '../functions/atoms'
import './GraphPanel.scss'
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

let graphChart: echarts.EChartsType
let graphOptions: any

//cut the xData and yData according to the give range(lower, upper)
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

//find the index of x in xData
//if x is not in xData, return xData[index] > x >xData[index-1]
//if x is in Data, return two indexes with the same value
//assume x wouldn't out of range
const findIndexes = (xData: string[], x: number) => {
  let firstIndex = -1
  if (xData.length > 1) {
    for (let i = 0; i < xData.length; i++) {
      if (
        Math.abs(Number(xData[i]) - x) < Number.EPSILON &&
        x.toString() === xData[i]
      ) {
        return { first: i, second: i } //find the exact data point
      }

      if (Number(xData[i]) < x) {
        continue //no result yet
      } else if (Number(xData[i]) > x && firstIndex === -1) {
        if (i === 0) {
          console.log(`Error: input x ${x} is out of range. (${xData}) `)
          return null
        } else {
          return { first: i - 1, second: i }
        } //find the x is between firstIndex and secondIndex
      }
    }
  }

  console.log(`Error: input x ${x} is out of range. (${xData}) `)
  return null
}

//assume the xData is in acsending order
//insert data points very 1Myr
const interpolate = (xData: string[], yData: number[]) => {
  let small = Math.ceil(Number(xData[0]))
  let big = Math.floor(Number(xData[xData.length - 1]))
  for (let i = small; i < big; i++) {
    let indexes = findIndexes(xData, i)
    if (indexes) {
      if (indexes.first === indexes.second) {
        continue //data point exists in xData
      } else {
        let yValue =
          ((yData[indexes.second] - yData[indexes.first]) /
            (Number(xData[indexes.second]) - Number(xData[indexes.first]))) *
            (i - Number(xData[indexes.first])) +
          yData[indexes.first]

        yData.splice(indexes.second, 0, parseFloat(yValue.toFixed(2)))

        xData.splice(indexes.second, 0, i.toString())
      }
    }
  }
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
    interpolate(xData, yData)

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
    }
    let chartDom = document.getElementById('graphPanel-statistics')!
    //if (graphChart != null) {
    //  graphChart.dispose()
    //}
    if (!graphChart) {
      graphChart = echarts.init(chartDom)
    }

    graphOptions = {
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
    if (graphOptions === undefined) {
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
