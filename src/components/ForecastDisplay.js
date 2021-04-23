import React from "react"
import ForecastDay from "./ForecastDay"

const ForecastDisplay = (props) => {
  const {city, country, lat, long, forecastDisplay, forecastWeather} = props
  const today = (new Date()).getDay()
  
  let place
  if (city !== "") {
    place = <div className="place-city"><i className="fas fa-map-marker-alt"></i> {city}, {country}</div>
  }

  if (forecastWeather !== undefined) {
    const display = forecastWeather.map(day => 
      <ForecastDay 
        key = {day.dayIndex} 
        day = {day.dayIndex} 
        temp = {day.temp} 
        weather = {day.weather} 
        iconId = {day.iconId} 
        humidity = {day.humidity} 
        today = {today}
        />)
    return (
      <div className = "fw-display" style = {{display:forecastDisplay}}>
        <div className = "title">
          Seven Day Forecast
        </div>
        <div className = "fw-results">
          {display}
        </div>
        <div className = "place">
          <div className = "place-lat-long">Latitude: {lat}, Longitude: {long}</div>
          {place}
        </div>
      </div>
  )
  } else {
    return (
      <div className = "fw-weather-display" style = {{display:forecastDisplay}}> 
    </div>
    )
  }
}


export default ForecastDisplay