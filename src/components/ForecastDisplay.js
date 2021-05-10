import React from "react"
import ForecastDay from "./ForecastDay"
import ReturnButton from "./ReturnButton"

const ForecastDisplay = (props) => {
  const {city, country, lat, long, forecastDisplay, forecastWeather,handleReturnButton} = props
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
      <div className = "fw-display" style = {{display:forecastDisplay ? "flex" : "none"}}>
        <div className="display-header">
          <ReturnButton handleReturnButton={handleReturnButton} />
          <div className="title">Seven day forecast</div>
        </div>
        <div className = "place">
        <span className="for">For:</span>
        <span className = "place-lat-long">
          <div>lat: {lat}</div>
          <div>long: {long}</div>
          </span>
        <span> {place}</span>
       
      </div>
        <div className = "fw-results">
          {display}
        </div>

      </div>
  )
  } else {
    return (
      <div className = "fw-weather-display" style = {{display:forecastDisplay ? "flex" : "none"}}> 
      </div>
    )
  }
}


export default ForecastDisplay