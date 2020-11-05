import React from "react"
import getWeatherIcon from "../data/weatherIcons"


function CurrentWeatherDisplay(props) {
  const {city, lat, long, currentTemp, currentDescription, currentIconId, currentSunrise, currentSunset, currentDisplay} = props
  let currentWeatherIcon = getWeatherIcon(currentIconId)
  
  return (
    <div className="current-weather-display" style={{display:currentDisplay}}> 
      <div className="current-title">Current weather:</div>
      <div className="current-main">
        <div className="current-temp">{currentTemp}°C</div>
        <div className="current-weather">
          <div className="current-icon">{currentWeatherIcon}</div>
          <div className="current-description">{currentDescription}</div>
          <div className="current-sunrise">Sunrise: {currentSunrise}</div>
          <div className="current-sunset">Sunset: {currentSunset}</div>
        </div>
      </div>
      <button>Go Back</button>
      <div className="current-place">
        <div className="current-lat-long">Latitude: {lat}, Longitude: {long}</div>
        <div className="current-city">{city}</div>
      </div>

    </div>
  )
}

export default CurrentWeatherDisplay