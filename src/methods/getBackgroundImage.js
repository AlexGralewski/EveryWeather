import clearday from "../images/clear-day-bg.jpg"
import clearnight from "../images/clear-night-bg.jpg"
import cloudsday from "../images/clouds-day-bg.jpg"
import cloudsnight from "../images/clouds-night-bg.jpg"
import clouds from "../images/clouds-bg.jpg"
import rainday from "../images/rain-day-bg.jpg"
import rainnight from "../images/rain-night-bg.jpg"
import rain from "../images/rain-bg.jpg"
import smog from "../images/smog-bg.jpg"
import snow from "../images/snow-bg.jpg"
import storm from "../images/storm-bg.png"


function getBackgroundImage(weatherId) {
  if (weatherId === "01d") {
    return (clearday)
  } else if (weatherId === "01n") {
    return (clearnight)
  } else if (weatherId === "02d") {
    return (cloudsday)
  } else if (weatherId === "02n") {
    return (cloudsnight)
  } else if (weatherId === "03d" || weatherId === "03n" || weatherId === "04d" || weatherId === "04n") {
    return (clouds)
  } else if (weatherId === "09d" || weatherId === "09n") {
    return (rain)
  } else if (weatherId === "10d") {
    return (rainday)
  } else if (weatherId === "10n") {
    return (rainnight)
  } else if (weatherId === "11d" || weatherId === "11n") {
    return (storm)
  } else if (weatherId === "13d" || weatherId === "13n") {
    return (snow)
  } else if (weatherId === "50d" || weatherId === "50n") {
    return (smog)
  }
  return ('No icon')
}

export default getBackgroundImage