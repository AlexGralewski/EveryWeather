import React from "react"
import timestampToTime from "../data/timestampToTime"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"
import cities from "../data/cities"

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
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + (this.state.lat % 180) + "+" + (this.state.long % 180) + "&key="  + this.state.locationApiKey  
    console.log(locationApiUrl)
    //fetch weather API
    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({weatherData: res})
      })
      .catch(err => {
        console.log(err)
      })
    
    fetch(locationApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({locationData: res})
      })
      .catch(err => {
        console.log(err)
      })      

    console.log(this.state.locationData)
    this.setState({
      currentDisplay: "flex",
      formsDisplay: "none",
      returnButtonDisplay: "flex"
    })
  }



  handleCitySubmit(event) {
    event.preventDefault()
    
    let cityIndex
    for (cityIndex = 0; cityIndex < cities.length; cityIndex++) {
      if (cities[cityIndex].city === "warsaw") {
        this.setState({
          lat: cities[cityIndex].lat,
          long: cities[cityIndex].long
        })
      }
    }

    //URL string for weather API
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 90) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey
    console.log(apiURL)

    //fetch API
    fetch(apiURL)
      .then(response => response.json())
      .then(res => {
        this.setState({data: res});
      })
      .catch(err => {
        console.log(err);
      });   
  }

  handlePositionSubmit() {

    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude *1000) / 1000,
        formsDisplay: "none",
        currentDisplay: "block",
        returnButtonDisplay: "flex"
      }, this.handlePositionSubmit1)
    })
  }

  handlePositionSubmit1() {
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
    const {city, lat, long, weatherData, locationData, currentDisplay, formsDisplay, returnButtonDisplay} = this.state
    let currentWeather = {}
    
    //assigning weather parameters
    if (weatherData !== undefined) {
      //sets current temperature
      currentWeather.temp = Math.round(weatherData.current.temp - 273.15)
      //sets current sunrise and sunset
      currentWeather.sunrise = timestampToTime(weatherData.current.sunrise)
      currentWeather.sunset = timestampToTime(weatherData.current.sunset)
      //sets current weather parameters
      currentWeather.description = weatherData.current.weather[0].description
      currentWeather.iconId = weatherData.current.weather[0].icon
      currentWeather.pressure = weatherData.current.pressure
      currentWeather.humidity = weatherData.current.humidity
      currentWeather.wind = [weatherData.current.wind_deg, weatherData.current.wind_speed]

      
    } 
    console.log(currentWeather)

    if (locationData !== undefined) {
        const cityL = locationData.results[0].components.city
        const countryL = locationData.results[0].components.country

      }


    return (
      <div className="weather-app">
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
          <h1>OR</h1>
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
                  required>
                  <option value="">Country</option>
                  <option value="poland">Poland</option>
                  <option value="england">England</option>
                </select>
              </div>
            <button>Get current weather</button>
          </form>
          </div>
          <h1>OR</h1>
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
          currentTemp = {currentWeather.temp}
          currentDescription = {currentWeather.description}
          currentIconId = {currentWeather.iconId}
          currentSunrise = {currentWeather.sunrise}
          currentSunset = {currentWeather.sunset}
          />
        <button 
          onClick={this.handleReturnButton} 
          style={{display:returnButtonDisplay}} 
          className="return-button">
            <i class="fas fa-arrow-left"></i><p>Return</p>
        </button>
      </div>
    )
  }
}

export default WeatherApp