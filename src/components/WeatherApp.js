import React from "react"
import timestampToTime from "../data/timestampManagement"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"

console.log(timestampToTime(1603949182))

class WeatherApp extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: 52.24, //latitude
      long: 21.02, //longitude
      city: "warsaw", //city of choice
      part: "minutely,hourly", //Excludes parts of weather data. Available values: "current", "minutely", "hourly", "daily", "alerts". Seperated by comma without spaces
      apiKey: "692d3bd12adf77c08728b7324d9f2b14", //APIkey for OpenWeatherMapAPI
      data: undefined, //data pulled from API
      
    }
    this.handleChange = this.handleChange.bind(this)

  }

  componentDidMount() {
    const {lat, long, part, apiKey} = this.state
    const apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=" + part + "&appid=" + apiKey
    console.log(apiURL)
    fetch(apiURL)
      .then(response => response.json())
      .then(res => {
        this.setState({data: res});
      })
      .catch(err => {
        console.log(err);
      });
        }

  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    const {name, value} = event.target
  }

  render() {
    const {city, lat, long, data} = this.state
    let current = {}
    if (data !== undefined) {
      //set current temperature
      current.temp = Math.floor(data.current.temp - 273.15)
      //set current sunrise and sunset
      current.sunrise = timestampToTime(data.current.sunrise)
      current.sunset = timestampToTime(data.current.sunset)
      //set current weather
      current.weather = data.current.weather[0].main
      current.description = data.current.weather[0].description
      current.iconId = data.current.weather[0].icon
    } 
    console.log(current)
    
    return (
      <div className="weather-app">
        <div className="forms">
          <div className="city-form">
            <form onSubmit={this.handleSubmit}>
            <label>
              Enter your city:
              <br />
              <input 
                type="text"
                name="city"
                value = {city}
                placeholder = "City"
                onChange={this.handleChange}/> 
            </label>
            <button>Submit</button>
          </form>
          </div>
          <h1>OR</h1>
          <div className="lat-long-form">
            <form onSubmit={this.handleSubmit}>
              <label>
                Enter your latitude:<br />
                <input 
                  type="text"
                  name="lat"
                  value = {lat}
                  placeholder = "Latitude"
                  onChange={this.handleChange}/> 
              </label>
              <label>
                Enter your longitude: <br />
                <input 
                  type="text"
                  name="long"
                  value = {long}
                  placeholder = "Longitude"
                  onChange={this.handleChange}/> 
              </label>
              <button>Submit</button>
            </form>
          </div>
          <h1>OR</h1>
          <div className="this-location-form">
            <button>Get weather from your location</button>          
          </div>
        </div>

        <CurrentWeatherDisplay 
          city={city}
          lat={lat}
          long={long}
          currentTemp = {current.temp}
          currentWeather = {current.weather}
          currentDescription = {current.description}
          currentIconId = {current.iconId}
          currentSunrise = {current.sunrise}
          currentSunset = {current.sunset}
          />
      </div>
    )
  }
}

export default WeatherApp