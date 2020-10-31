import React from "react"

function getWeatherIcon(iconId) {
  if (iconId === "01d") {
    return (<i class="fas fa-sun"></i>)
  } else if (iconId === "01n") {
    return (<i class="fas fa-moon"></i>)
  } else if (iconId === "02d") {
    return (<i class="fas fa-cloud-sun"></i>)
  } else if (iconId === "02n") {
    return (<i class="fas fa-cloud-moon"></i>)
  } else if (iconId === "03d" || iconId === "03n" || iconId === "04d" || iconId === "04n") {
    return (<i class="fas fa-cloud fa-5x"></i>)
  } else if (iconId === "09d" || iconId === "09n") {
    return (<i class="fas fa-cloud-showers-heavy"></i>)
  } else if (iconId === "10d") {
    return (<i class="fas fa-cloud-rain"></i>)
  } else if (iconId === "10n") {
    return (<i class="fas fa-cloud-moon-rain"></i>)
  } else if (iconId === "11d" || iconId === "11n") {
    return (<i class="fas fa-bolt"></i>)
  } else if (iconId === "13d" || iconId === "13n") {
    return (<i class="fas fa-snowflake"></i>)
  } else if (iconId === "50d" || iconId === "50n") {
    return (<i class="fas fa-smog"></i>)
  }
  return ('No icon')
}
export default getWeatherIcon