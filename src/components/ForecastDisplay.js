import React from "react"

function ForecastDisplay(props) {
  let forecast = 
  return (
    <div className="forecast-display">
      <div className="forecast-display-item">
        <div className="forecast-day"></div>
        <div className="forecast-temp"></div>
        <div className="forecast-icon"></div>
        <div className="forecast-humidity"></div>
      </div>
    </div>
  )
}

export default ForecastDisplay