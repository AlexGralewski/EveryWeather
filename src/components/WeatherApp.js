import React from "react"
import timestampToTime from "../data/timestampToTime"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"


class WeatherApp extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: "0", //latitude
      long: "0", //longitude
      city: "", //city of choice
      country: "",
      part: "minutely,hourly", //Excludes parts of weather data. Available values: "current", "minutely", "hourly", "daily", "alerts". Seperated by comma without spaces
      weatherApiKey: "692d3bd12adf77c08728b7324d9f2b14", //API key for OpenWeatherMapAPI
      weatherData: undefined, //data pulled from weather API
      currentWeather: undefined,
      locationApiKey: "44f5f3ce977746e7ab89ddeae84b48d3", //API key for openCageData
      locationData: undefined, //data pulled from location API
      currentDisplay: "none",
      formsDisplay: "flex",
      returnButtonDisplay: "none"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLatLongSubmit = this.handleLatLongSubmit.bind(this)
    this.handleCitySubmit = this.handleCitySubmit.bind(this)
    this.handlePositionSubmit = this.handlePositionSubmit.bind(this)
    this.handleReturnButton = this.handleReturnButton.bind(this)
  }


  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleLatLongSubmit(event) {
    event.preventDefault()
    //URL string for weather API
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 180) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   
    console.log(weatherApiUrl)
    
    //fetch weather API
    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res
        }, 
        this.handleLatLongSubmit2,
        )
      })
      .catch(error => {
        console.log(error)
      })}
    
  handleLatLongSubmit2() {
    //URL string for reverse location API
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + (this.state.lat % 180) + "+" + (this.state.long % 180) + "&key="  + this.state.locationApiKey  

    console.log(locationApiUrl)

    //fetch location API
    fetch(locationApiUrl)
    .then(response => response.json())
    .then(res => {
      this.setState({
        locationData: res
      },
      this.assignCurrentWeatherParameters
      )
    })
    .catch(err => {
      console.log(err)
    })      
    
    this.setState({
      currentDisplay: "flex",
      formsDisplay: "none",
      returnButtonDisplay: "flex"
    })
  }
  
  assignCurrentWeatherParameters() {
    const {weatherData} = this.state
    let cWeather = {}

    //sets current temperature
    cWeather.temp = Math.round(weatherData.current.temp - 273.15)
    //sets current sunrise and sunset
    cWeather.sunrise = timestampToTime(weatherData.current.sunrise)
    cWeather.sunset = timestampToTime(weatherData.current.sunset)
    //sets current weather parameters
    cWeather.description = weatherData.current.weather[0].description
    cWeather.iconId = weatherData.current.weather[0].icon
    cWeather.pressure = weatherData.current.pressure
    cWeather.humidity = weatherData.current.humidity
    cWeather.wind = [weatherData.current.wind_deg, weatherData.current.wind_speed]
  
      
    this.setState({
      currentWeather: cWeather
    })

  }


  handleCitySubmit(event) {
    event.preventDefault()

    //URL string for forward location API
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "&key=" + this.state.locationApiKey
    console.log(locationApiUrl)
    fetch(locationApiUrl)
      .then(response => response.json())
      .then(res => {this.setState({
        locationData: res
      }, this.handleCitySubmit2)})

  }

  handleCitySubmit2() {
    this.setState({
      lat: this.state.locationData.results[0].geometry.lat,
      long: this.state.locationData.results[0].geometry.lng,
      city: this.state.locationData.results[0].components.city,
      country: this.state.locationData.results[0].components.country
    }, this.handleCitySubmit3)
  }

  handleCitySubmit3() {
    //URL string for weather API
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 180) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   
    console.log(weatherApiUrl)
    
    //fetch weather API
    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res,
          currentDisplay: "flex",
          formsDisplay: "none",
          returnButtonDisplay: "flex"
        }, this.assignCurrentWeatherParameters 
        )
      })
      .catch(error => {
        console.log(error)
      })
  }


  //
  handlePositionSubmit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude *1000) / 1000,
        formsDisplay: "none",
        currentDisplay: "block",
        returnButtonDisplay: "flex"
      }, this.handlePositionSubmit2)
    })
  }

  handlePositionSubmit2() {
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 90) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   

    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({weatherData: res})
      })
      .catch(err => {
        console.log(err)
      })

    console.log(weatherApiUrl)
  }

  handleReturnButton(event) {
    this.setState({
      formsDisplay: "flex",
      currentDisplay: "none",
      returnButtonDisplay: "none"
    })
    event.preventDefault()
  }

  render() {
    const {city, lat, long, weatherData, locationData, currentDisplay, formsDisplay, returnButtonDisplay, currentWeather} = this.state
   
    /*assigning location parameters
    if (locationData !== undefined) {

      console.log(locationData.results[0].components.city)
      console.log(locationData.results[0].components.country)
    } */

    return (
      <div className="weather-app">
        <div className="background-text">
          Get Your
          <p>Weather</p>
        </div>
        <div className="forms" style={{display:formsDisplay}}>
          <div className="lat-long-form">
            <form onSubmit={this.handleLatLongSubmit}>
              <label>
                Enter latitude:<br />
                <input 
                  type="number"
                  step="0.001"
                  name="lat"
                  value={lat}
                  onChange={this.handleChange}
                  required/> 
              </label>
              <label>
                Enter longitude: <br />
                <input 
                  type="number"
                  step="0.001"
                  name="long"
                  value={long}
                  onChange={this.handleChange}
                  required/> 
              </label>
              <button>Get current weather</button>
            </form>
          </div>
          <h1 className="or">OR</h1>
          <div className="city-form">
            <form onSubmit={this.handleCitySubmit}>
            <label>
              Enter a name of a city:
            </label>
              <div className="city-country-inputs">
                <input 
                  type="text"
                  name="city"
                  value = {city}
                  onChange={this.handleChange}
                  required/> 
                <select
                  value={this.state.country}
                  name="country"
                  onChange = {this.handleChange}
                  >
                  <option value="">Country</option>
                  <option value="poland">Poland</option>
                  <option value="england">England</option>
                </select>
              </div>
            <button>Get current weather</button>
          </form>
          </div>
          <h1 className="or">OR</h1>
          <div className="this-location-form">
            <button onClick={this.handlePositionSubmit}>Get current weather for your position</button>          
          </div>
        </div>

        <CurrentWeatherDisplay 
          city={city}
          lat={lat}
          long={long}
          currentDisplay = {currentDisplay}
          currentWeather = {currentWeather}
          />
        <button 
          onClick={this.handleReturnButton} 
          style={{display:returnButtonDisplay}} 
          className="return-button">
            <i className="fas fa-arrow-left"></i><p>Return</p>
        </button>
      </div>
    )
  }
}

export default WeatherApp