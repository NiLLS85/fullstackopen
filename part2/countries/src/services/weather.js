import axios from 'axios'

// Open-Meteo no necesita clave de API.
const baseUrl = 'https://api.open-meteo.com/v1/forecast'

// Códigos meteorológicos de la OMM (WMO) que usa Open-Meteo.
const descriptions = {
  0: 'clear sky',
  1: 'mainly clear',
  2: 'partly cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'rime fog',
  51: 'light drizzle',
  53: 'drizzle',
  55: 'dense drizzle',
  61: 'light rain',
  63: 'rain',
  65: 'heavy rain',
  71: 'light snow',
  73: 'snow',
  75: 'heavy snow',
  80: 'rain showers',
  81: 'heavy rain showers',
  82: 'violent rain showers',
  95: 'thunderstorm',
}

const icons = {
  clear: '☀️',
  cloud: '☁️',
  fog: '🌫️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
}

const iconFor = code => {
  if (code <= 1) return icons.clear
  if (code <= 3) return icons.cloud
  if (code <= 48) return icons.fog
  if (code >= 95) return icons.storm
  if (code >= 71 && code <= 77) return icons.snow
  return icons.rain
}

const getCurrent = ([latitude, longitude]) =>
  axios
    .get(baseUrl, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,wind_speed_10m,weather_code',
        wind_speed_unit: 'ms',
      },
    })
    .then(response => {
      const current = response.data.current
      return {
        temperature: current.temperature_2m,
        wind: current.wind_speed_10m,
        description: descriptions[current.weather_code] ?? 'unknown',
        icon: iconFor(current.weather_code),
      }
    })

export default { getCurrent }
