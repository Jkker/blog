import { useEffect } from 'react'
import { useGeolocated } from 'react-geolocated'

function GeoLocate({ setGeoLocated, setIsLoading }) {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    })
  useEffect(() => {
    setGeoLocated({ coords, isGeolocationAvailable, isGeolocationEnabled })
    setIsLoading(!coords)
  }, [
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    setGeoLocated,
    setIsLoading,
  ])

  return null
}

export default GeoLocate
