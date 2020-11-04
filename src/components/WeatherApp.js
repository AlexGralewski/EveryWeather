import React from "react"
import timestampToTime from "../data/timestampToTime"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"
import cities from "../data/cities"

class WeatherApp extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: "52.24", //latitude
      long: "21.02", //longitude
      city: "", //city of choice
      country: "",
      part: "minutely,hourly", //Excludes parts of weather data. Available values: "current", "minutely", "hourly", "daily", "alerts". Seperated by comma without spaces
      weatherApiKey: "692d3bd12adf77c08728b7324d9f2b14", //API key for OpenWeatherMapAPI
      weatherData: undefined, //data pulled from weather API
      locationApiKey: "44f5f3ce977746e7ab89ddeae84b48d3", //API key for openCageData
      locationData: undefined, //data pulled from location API
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLatLongSubmit = this.handleLatLongSubmit.bind(this)
    this.handleCitySubmit = this.handleCitySubmit.bind(this)
    this.handleLocationSubmit = this.handleLocationSubmit.bind(this)
  }


  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleLatLongSubmit(event) {
    event.preventDefault();

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
    this.setState({
      city: ""
    })
  }



  handleCitySubmit(event) {
    event.preventDefault();
    
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
    let apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 180) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey
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

  handleLocationSubmit(event) {
    event.preventDefault();
    
    console.log("handleLocationSubmit")
  }

  render() {
    const {city, lat, long, weatherData, locationData} = this.state
    let current = {}
    
    //assigning weather parameters
    if (weatherData !== undefined) {
      //set current temperature
      current.temp = Math.round(weatherData.current.temp - 273.15)
      //set current sunrise and sunset
      current.sunrise = timestampToTime(weatherData.current.sunrise)
      current.sunset = timestampToTime(weatherData.current.sunset)
      //set current weather
      current.description = weatherData.current.weather[0].description
      current.iconId = weatherData.current.weather[0].icon
    } 
    console.log(current)

    if (locationData !== undefined) {
        const cityL = locationData.results[0].components.city
        const countryL = locationData.results[0].components.country

      }


    return (
      <div className="weather-app">
        <div className="forms">
          <div className="lat-long-form">
            <form onSubmit={this.handleLatLongSubmit}>
              <label>
                Enter latitude:<br />
                <input 
                  type="number"
                  step="0.001"
                  name="lat"
                  value={lat}
                  onChange={this.handleChange}/> 
              </label>
              <label>
                Enter longitude: <br />
                <input 
                  type="number"
                  step="0.001"
                  name="long"
                  value={long}
                  onChange={this.handleChange}/> 
              </label>
              <button>Get current weather</button>
            </form>
          </div>
          <h1>OR</h1>
          <div className="city-form">
            <form onSubmit={this.handleCitySubmit}>
            <label>
              Enter a city:
              <div className="city-country-inputs">
                <input 
                  type="text"
                  name="city"
                  value = {city}
                  onChange={this.handleChange}/> 
                <select
                  value={this.state.country}
                  name="country"
                  onChange = {this.handleChange}>
                  <option value="">Country</option>
                  <option value="poland">Poland</option>
                  <option value="england">England</option>
                </select>
              </div>
            </label>
            <button>Get current weather</button>
          </form>
          </div>
          <h1>OR</h1>
          <div className="this-location-form">
            <button onClick={this.handleLocationSubmit}>Get current weather from your location</button>          
          </div>
        </div>

        <CurrentWeatherDisplay 
          city={city}
          lat={lat}
          long={long}
          currentTemp = {current.temp}
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