import React from "react"
import timestampToTime from "../data/timestampManagement"

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
    let currentWeather = {}
    if (data !== undefined) {
      //set current temperature
      currentWeather.temp = Math.floor(data.current.temp - 273.15)
      //set current sunrise and sunset
      currentWeather.sunrise = timestampToTime(data.current.sunrise)
      currentWeather.sunset = timestampToTime(data.current.sunset)
      //set current weather
      currentWeather.weather = data.current.weather[0].main
    } 
    console.log(currentWeather)
    
    return (
      <div className="weather-app">
        <div className="city-form">
          <form onSubmit={this.handleSubmit}>
           <label>
             Enter your city:
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
        
        <div className="lat-long-form">
          <form onSubmit={this.handleSubmit}>
            <label>
              Enter your latitude:
              <input 
                type="text"
                name="lat"
                value = {lat}
                placeholder = "Latitude"
                onChange={this.handleChange}/> 
            </label>
            <br />
            <label>
              Enter your longitude:
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

        <div className="data-display">
          <h1>{city}</h1>
          <h1>{lat}</h1>
          <h1>{long}</h1>
          <p>Current temperature: {currentWeather.temp}°C</p>
          <p>Current weather: {currentWeather.weather}</p>
          <p>Sunrise: {currentWeather.sunrise}</p>
          <p>Sunset: {currentWeather.sunset}</p>
          <p></p>
          <p></p>
        </div>

      </div>
    )
  }
}

export default WeatherApp