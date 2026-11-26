import { useEffect, useState } from 'react'

import weatherService from '../services/weather'

const Weather = ({ city, latlng }) => {
  const [weather, setWeather] = useState(null)
  const [failed, setFailed] = useState(false)
  const [latitude, longitude] = latlng

  useEffect(() => {
    setWeather(null)
    setFailed(false)
    weatherService
      .getCurrent([latitude, longitude])
      .then(data => setWeather(data))
      .catch(() => setFailed(true))
  }, [latitude, longitude])

  return (
    <div className="weather">
      <h2>Weather in {city}</h2>
      {failed && <p>Weather data is not available right now.</p>}
      {!failed && weather === null && <p>Loading weather...</p>}
      {weather && (
        <>
          <p>temperature {weather.temperature} °C</p>
          <p className="weather-icon" title={weather.description}>
            {weather.icon} {weather.description}
          </p>
          <p>wind {weather.wind} m/s</p>
        </>
      )}
    </div>
  )
}

export default Weather
