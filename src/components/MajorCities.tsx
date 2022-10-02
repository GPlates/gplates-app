import React, { useEffect, useState, useRef } from 'react'
import * as Cesium from 'cesium'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { age, showCities } from '../functions/atoms'
import { serverURL } from '../functions/settings'
import { currentModel } from '../functions/rotationModel'

import { cesiumViewer } from '../functions/cesiumViewer'

//for example: "Sydney": [151.2099, -33.8651],
let citiesLonLat: any = null
//for example: "SETON2012": [801, 801, 801, 801, 801],
let cityPlateIDs: any = null

let cityCesiumEntities: any = []
let labels: any = null

const loadCityData = () => {
  fetch(serverURL + '/mobile/get_cities')
    .then((response) => response.json())
    .then((jsonData) => {
      citiesLonLat = jsonData.coords
      cityPlateIDs = jsonData['plate-ids']
      //console.log(cityPlateIDs)
      //console.log(citiesLonLat)
    })
    .catch((error) => {
      console.log(error)
    })
}
loadCityData()
//
//
interface MajorCitiesProps {}
//
//
const MajorCities: React.FC<MajorCitiesProps> = () => {
  const paleoAge = useRecoilValue(age)
  const showCitiesFlag = useRecoilValue(showCities)


  useEffect(() => {
    //TODO: add city reconstruction code here
  }, [paleoAge])

  useEffect(() => {
    //TODO: draw cities on cesium here
    if (showCitiesFlag) {
      for (let key in citiesLonLat) {
        let locationCartesian: Cesium.Cartesian3 =
          Cesium.Cartesian3.fromDegrees(
            citiesLonLat[key][0],
            citiesLonLat[key][1]
          )
        let pe = cesiumViewer.entities.add({
          name: key,
          position: locationCartesian,
          point: {
            color: Cesium.Color.BLUEVIOLET,
            pixelSize: 10,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3,
          },
        })

        cityCesiumEntities.push(pe)

        if (!labels) {
          //labels = cesiumViewer.scene.primitives.add(new Cesium.LabelCollection())
          //addLabel(0, 0, '0°E', false)
          labels = cesiumViewer.scene.primitives.add(
            new Cesium.LabelCollection()
          )
        }
        if (labels) {
          //console.log('add label')
          labels.add({
            position: locationCartesian,
            text: key,
            font: `bold 1rem Arial`,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 4,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(10, -6),
            eyeOffset: Cesium.Cartesian3.ZERO,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            scale: 1,
            scaleByDistance: new Cesium.NearFarScalar(1, 0.85, 8.0e6, 0.75),
          })
        }
      }
    } else {
      cityCesiumEntities.forEach((entity: any) => {
        cesiumViewer.entities.remove(entity)
        if (labels) {
          labels.removeAll()
          labels = null
        }
      })
    }
  }, [showCitiesFlag])


  return null // non-GUI component
}
export default MajorCities
