import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { age, isGraphPanelShowState } from '../functions/atoms'
import './GraphPanel.css'
import { EChartsType } from 'echarts'

type EChartsOption = echarts.EChartsOption
let MU_CHART: EChartsType
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
  const [isShow, setIsShow] = useRecoilState(isGraphPanelShowState)
  const _age = useRecoilValue(age)
  // initialization
  useEffect(() => {
    getData().then(([data_map, data, x_vals, y_vals]) => {
      DATA_MAP = data_map
      DATA = data
      X_VALS = x_vals
      Y_VALS = y_vals

      let chartDom = document.getElementById('graphPanel-statistics')!
      MU_CHART = echarts.init(chartDom)

      OPTION = {
        xAxis: {
          type: 'value',
          data: x_vals,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: data,
            type: 'line',
            symbol: 'none',
            markLine: {
              data: [
                {
                  xAxis: _age,
                },
              ],
              animation: false,
              silent: false,
              label: {
                show: true,
                position: 'end',
                formatter: _age + 'Ma : ' + DATA_MAP[_age],
              },
            },
          },
        ],
      }
      OPTION && MU_CHART.setOption(OPTION)
    })
  }, [])

  useEffect(() => {
    console.log(_age)
    if (OPTION == undefined) {
      return
    }
    // @ts-ignore
    OPTION.series[0].markLine.data[0].xAxis = _age
    // @ts-ignore
    OPTION.series[0].markLine.label.formatter = _age + 'Ma : ' + DATA_MAP[_age]
    MU_CHART.setOption(OPTION)
  }, [_age])

  return (
    <div style={{ visibility: isShow ? 'visible' : 'hidden' }}>
      <div id="graphPanel-statistics" className="graph-panel-statistics" />
      <div id="graphPanel-timeline" className="graph-panel-timeline" />
    </div>
  )
}
