import React from "react"
import getWeatherIcon from "../data/weatherIcons"

function CurrentWeatherDisplay(props) {
  const {city, lat, long, currentTemp, currentWeather, currentDescription, currentIconId, currentSunrise, currentSunset} = props
  let currentWeatherIcon = getWeatherIcon(currentIconId)
  
  return (
    <div className="current-weather-display">
      <div className="current-title">Current weather:</div>
      <div className="current-main">
        <div className="current-temp">{currentTemp}°C</div>
        <div className="current-weather">
          <div className="current-icon">{currentWeatherIcon}</div>
          <div className="current-description">{currentWeather}, {currentDescription}</div>
          <div className="current-sunrise">Sunrise: {currentSunrise}</div>
          <div className="current-sunset">Sunset: {currentSunset}</div>
        </div>
      </div>

      <div className="current-place">
        <div className="current-lat">Latitude: {lat}</div>
        <div className="current-long">Longitude: {long}</div>  
        <div className="current-city">{city}</div>
      </div>

    </div>
  )
}

export default CurrentWeatherDisplay