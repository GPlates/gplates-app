import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { age, isGraphPanelShowState } from '../functions/atoms'
import './GraphPanel.css'
import { EChartsType } from 'echarts'
import { getPlatforms } from '@ionic/react'
import assert from 'assert'
import { XAXisComponentOption } from 'echarts/types/dist/option'

type EChartsOption = echarts.EChartsOption
let MY_CHART: EChartsType
let OPTION: EChartsOption
let X_VALS
let Y_VALS
let DATA
let DATA_MAP: string[]

async function getData() {
  let data: any = await fetch(
    'https://gws.gplates.org/mobile/get_scotese_etal_2021_global_temp'
  )
  let data_map = await data.json()

  let x_vals: number[] = []
  let y_vals: number[] = []
  for (let key in data_map) {
    x_vals.push(Number(key))
    y_vals.push(data_map[key])
  }

  data = []
  for (let i = 0; i < x_vals.length; i++) {
    data.push([x_vals[i], y_vals[i]])
  }

  return [data_map, data, x_vals, y_vals]
}

interface ContainerProps {}

export const GraphPanel: React.FC<ContainerProps> = () => {
  const isShow = useRecoilValue(isGraphPanelShowState)
  const [_age, setAge] = useRecoilState(age)
  // initialization
  useEffect(() => {
    getData().then(([data_map, data, x_vals, y_vals]) => {
      DATA_MAP = data_map
      DATA = data
      X_VALS = x_vals
      Y_VALS = y_vals

      let chartDom = document.getElementById('graphPanel-statistics')!
      MY_CHART = echarts.init(chartDom)

      globalThis.addEventListener('resize', function () {
        MY_CHART.resize()
      })

      OPTION = {
        xAxis: {
          type: 'category',
          data: x_vals,
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
            data: data,
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
    })
  }, [])

  useEffect(() => {
    if (OPTION == undefined) {
      return
    }
    // @ts-ignore
    OPTION.xAxis!.axisPointer.value = _age
    MY_CHART.setOption(OPTION)
  }, [_age])

  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      <div id="graphPanel-statistics" className="graph-panel-statistics" />
    </div>
  )
}
