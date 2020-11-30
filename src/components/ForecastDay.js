import React from "react"
import getWeatherIcon from "../methods/weatherIcons"
import dayOfTheWeek from "../methods/dayOfTheWeek"

function ForecastDay(props) {
  const {day, temp, weather, iconId, humidity, today} = props
  let weatherIcon = getWeatherIcon(iconId)

  let whichDay
  if (day === 0) {
    whichDay = "Today"
  } else {
    whichDay = dayOfTheWeek((today + day) % 7)
  }

  let humidityIcon 
  if (humidity === 0) {
    humidityIcon = <i className="fas fa-tint-slash"></i>
  } else {
    humidityIcon = <i className="fas fa-tint"></i>
  }
  return(
    <div className = "fw-display-item">
      <div className = "fw-day">{whichDay}</div>
      <div className = "fw-representation">
        <div className = "fw-icon">{weatherIcon}</div>
        <div className = "fw-description">{weather}</div>
      </div>    
      <div className = "fw-details">
        <div className = "fw-temp">
          <div className = "fw-temp-day"><i class="far fa-sun"></i> {Math.round((temp.day - 273.15))}°C</div>
          <div className = "fw-temp-night"><i class="far fa-moon"></i> {Math.round(temp.night - 273.15)}°C</div>
        </div>
        <div className = "fw-humidity">{humidityIcon} {humidity}%</div>
      </div>
    </div>
  )
}

export default ForecastDay