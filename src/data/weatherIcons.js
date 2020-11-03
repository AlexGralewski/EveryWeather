import React from "react"

function getWeatherIcon(iconId) {
  if (iconId === "01d") {
    return (<i className="fas fa-sun fa-5x"></i>)
  } else if (iconId === "01n") {
    return (<i className="fas fa-moon fa-5x"></i>)
  } else if (iconId === "02d") {
    return (<i className="fas fa-cloud-sun fa-5x"></i>)
  } else if (iconId === "02n") {
    return (<i className="fas fa-cloud-moon fa-5x"></i>)
  } else if (iconId === "03d" || iconId === "03n" || iconId === "04d" || iconId === "04n") {
    return (<i className="fas fa-cloud fa-5x"></i>)
  } else if (iconId === "09d" || iconId === "09n") {
    return (<i className="fas fa-cloud-showers-heavy fa-5x"></i>)
  } else if (iconId === "10d") {
    return (<i className="fas fa-cloud-rain fa-5x"></i>)
  } else if (iconId === "10n") {
    return (<i className="fas fa-cloud-moon-rain fa-5x"></i>)
  } else if (iconId === "11d" || iconId === "11n") {
    return (<i className="fas fa-bolt fa-5x"></i>)
  } else if (iconId === "13d" || iconId === "13n") {
    return (<i className="fas fa-snowflake fa-5x"></i>)
  } else if (iconId === "50d" || iconId === "50n") {
    return (<i className="fas fa-smog fa-5x"></i>)
  }
  return ('No icon')
}
export default getWeatherIcon