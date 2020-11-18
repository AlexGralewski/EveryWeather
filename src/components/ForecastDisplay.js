import React from "react"
import ForecastDay from "./ForecastDay"

function ForecastDisplay(props) {
  const {city, lat, long, forecastDisplay, forecastWeather} = props
  if (forecastWeather !== undefined) {

    const display = forecastWeather.map(day => <ForecastDay key={day.index} temp={day.temp} weather={day.weather} iconId={day.iconId} humidity={day.humidity}/>)
    return (
      <div className="forecast-weather-display" style={{display:forecastDisplay}}>
        {display}
      </div>
  )
  } else {
    return (
      <div className="forecast-weather-display" style={{display:forecastDisplay}}> 
    </div>
    )
  }
}


export default ForecastDisplay