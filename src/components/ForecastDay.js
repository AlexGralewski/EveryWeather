import React from "react"
import getWeatherIcon from "../methods/weatherIcons"

function ForecastDay(props) {
  const {temp, weather, iconId, humidity, key} = props
  let weatherIcon = getWeatherIcon(iconId)
  console.log(key)
  return(
    <div className="forecast-display-item">
        <div className="forecast-day">Day</div>
        <div className="forecast-temp-day">{Math.round((temp.day - 273.15))}</div>
        <div className="forecast-temp-night">{Math.round(temp.night - 273.15)}</div>
        <div className="forecast-icon">{weatherIcon}</div>
        <div className="forecast-weather">{weather}</div>
        <div className="forecast-humidity">{humidity}%</div>
    </div>
  )
}

export default ForecastDay