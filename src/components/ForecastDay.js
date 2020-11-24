import React from "react"
import getWeatherIcon from "../methods/weatherIcons"
import dayOfTheWeek from "../methods/dayOfTheWeek"

function ForecastDay(props) {
  const {day, temp, weather, iconId, humidity, today} = props
  let weatherIcon = getWeatherIcon(iconId)

  let humidityIcon 
  if (humidity === 0) {
    humidityIcon = <i className="fas fa-tint-slash"></i>
  } else {
    humidityIcon = <i className="fas fa-tint"></i>
  }
  return(
    <div className = "forecast-display-item">
        <div className = "forecast-day">{dayOfTheWeek((today + day) % 7)}</div>
        <div className = "forecast-icon">{weatherIcon}</div>
        <div className = "forecast-weather">{weather}</div>
        <div className = "forecast-temp">
          <div className = "forecast-temp-day">{Math.round((temp.day - 273.15))}°C</div>
          <div className = "forecast-temp-night">{Math.round(temp.night - 273.15)}°C</div>
        </div>
        <div className = "forecast-humidity">{humidityIcon} {humidity}%</div>
    </div>
  )
}

export default ForecastDay