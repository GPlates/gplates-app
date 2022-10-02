import React, { useEffect, useState, useRef } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { age, showCities } from '../functions/atoms'
import { serverURL } from '../functions/settings'
import { currentModel } from '../functions/rotationModel'

//"Sydney": [151.2099, -33.8651],
let citiesLonLat: any = null
//"SETON2012": [801, 801, 801, 801, 801],
let cityPlateIDs: any = null

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

  useEffect(() => {
    //TODO: add city reconstruction code here
  }, [paleoAge])

  useEffect(() => {
    //TODO: draw cities on cesium here
  }, [showCities])

  return null // non-GUI component
}
export default MajorCities
