import React, { useEffect, useState, useRef } from 'react'
import * as Cesium from 'cesium'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { age, showCities, currentRasterMapIndexState } from '../functions/atoms'
import { serverURL } from '../functions/settings'
import { currentModel } from '../functions/rotationModel'
import { cesiumViewer } from '../functions/cesiumViewer'

//for example: "Sydney": [151.2099, -33.8651],
let citiesLonLat: any = null
//for example: "SETON2012": [801, 801, 801, 801, 801],
let cityPlateIDs: any = null

let cityCesiumEntities: any = []
let labels: any = null

//
//
const undrawCities = () => {
  cityCesiumEntities.forEach((entity: any) => {
    cesiumViewer.entities.remove(entity)
  })
  if (labels) {
    labels.removeAll()
    labels = null
  }
}

//
const drawCity = (lon: number, lat: number, name: string) => {
  let locationCartesian: Cesium.Cartesian3 = Cesium.Cartesian3.fromDegrees(
    lon,
    lat
  )
  let pe = cesiumViewer.entities.add({
    name: name,
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
    labels = cesiumViewer.scene.primitives.add(new Cesium.LabelCollection())
  }
  if (labels) {
    labels.add({
      position: locationCartesian,
      text: name,
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

//
//
const drawPaleoCity = (city: number[], name: string, age: number) => {
  if (cityPlateIDs) {
    //reconstruct location
    let reconstructedCity = currentModel.rotateLonLatPid(
      currentModel.getTimeIndex(age),
      {
        lon: city[0],
        lat: city[1],
        pid: cityPlateIDs[currentModel.name][city[2]], //plate ID
      }
    )
    drawCity(reconstructedCity.lon, reconstructedCity.lat, name) //draw reconstructed coordinates
  } else {
    console.log('Warning: cityPlateIDs is not loaded yet.')
  }
}

//
//
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

//
//
interface MajorCitiesProps {}
//
//
const MajorCities: React.FC<MajorCitiesProps> = () => {
  const paleoAge = useRecoilValue(age)
  const showCitiesFlag = useRecoilValue(showCities)

  //
  //
  useEffect(() => {
    if (showCitiesFlag) {
      undrawCities()
      // fetch finite rotation for plate IDs
      // finite rotation must be ready before currentModel.rotateLonLatPid()
      currentModel.fetchFiniteRotations(cityPlateIDs[currentModel.name])

      for (let key in citiesLonLat) {
        drawPaleoCity(citiesLonLat[key], key, paleoAge)
      }
    }
  }, [paleoAge])

  //
  //
  useEffect(() => {
    // fetch finite rotation for plate IDs
    if (currentModel && cityPlateIDs) {
      currentModel.fetchFiniteRotations(cityPlateIDs[currentModel.name])
    }
    // draw cities on cesium here
    if (showCitiesFlag) {
      for (let key in citiesLonLat) {
        //paleoAge !== 0, draw reconstructed city coordinates
        if (paleoAge !== 0 && currentModel) {
          drawPaleoCity(citiesLonLat[key], key, paleoAge)
        } else {
          drawCity(citiesLonLat[key][0], citiesLonLat[key][1], key) //paleoAge===0, draw present-day cities
        }
      }
    } else {
      undrawCities() // showCitiesFlag===false
    }
  }, [showCitiesFlag])

  //
  //
  useEffect(() => {
    loadCityData()
  }, [])

  return null // non-GUI component
}
export default MajorCities
