import React from "react"
import timestampToTime from "../methods/timestampToTime"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"
import ForecastDisplay from "./ForecastDisplay"

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
      forecastWeather: undefined,
      locationApiKey: "44f5f3ce977746e7ab89ddeae84b48d3", //API key for openCageData
      locationData: undefined, //data pulled from location API
      formsDisplay: "flex", //displa
      currentDisplay: "none",
      forecastDisplay: "none",
      returnButtonDisplay: "none"
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLatLongCurrentSubmit = this.handleLatLongCurrentSubmit.bind(this)
    this.handleCityCurrentSubmit = this.handleCityCurrentSubmit.bind(this)
    this.handlePositionCurrentSubmit = this.handlePositionCurrentSubmit.bind(this)
    this.handleReturnButton = this.handleReturnButton.bind(this)
    this.handleLatLongForecastSubmit = this.handleLatLongForecastSubmit.bind(this)
    this.handleCityForecastSubmit = this.handleCityForecastSubmit.bind(this)
    this.handlePositionForecastSubmit = this.handlePositionForecastSubmit.bind(this)
  }

  //Handles change of all inputs in forms section.
  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  //Handles submit of latitude and longitude form (current weather). Fetches data from OpenWeatherMap API.
  handleLatLongCurrentSubmit(event) {
    event.preventDefault()
    //URL string for weather API
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 180) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey
    
    //fetch weather API
    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res
        }, 
        this.handleLatLongCurrentSubmit2,
        )
      })
      .catch(err => {
        console.log(err)
      })
    }
    
  //Second part of latitude andlongitude form (current weather). Fetches data from OpenCageData API.
  handleLatLongCurrentSubmit2() {
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
      this.handleLatLongCurrentSubmit3
      )
    })
    .catch(err => {
      console.log(err)
    })      
    
  }
  
  //Third part of latitude and longitude form (current weather). Sets city and country, if possible for entered coords.
  handleLatLongCurrentSubmit3() {
    let city, country

    if (this.state.locationData.results[0].components.city !== undefined) {
      city = this.state.locationData.results[0].components.city
      country = this.state.locationData.results[0].components.country
    } else {
      city = ""
      country = ""
    }
    
    this.setState({
      city: city,
      country: country
    }, this.assignCurrentWeatherParameters
    )
  }

  //Handles submit of city form (current weather). Fetches data from OpenCageData API.
  handleCityCurrentSubmit(event) {
    event.preventDefault()

    let locationApiUrl
    //URL string for forward location API

    if (this.state.country === ""){
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "&key=" + this.state.locationApiKey

    } else {
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "%2C" + this.state.country + "&key=" + this.state.locationApiKey 
    }
    fetch(locationApiUrl)
    .then(response => response.json())
    .then(res => {this.setState({
      locationData: res
    }, this.handleCityCurrentSubmit2)})

  }

  //Second part of city form (current weather). Sets latitude and longitude parameters of city entered in form input.  
  handleCityCurrentSubmit2() {
    this.setState({
      lat: this.state.locationData.results[0].geometry.lat,
      long: this.state.locationData.results[0].geometry.lng
    }, this.handleCityCurrentSubmit3)
  }

  //Third part of city form (current weather). Fetches data from OpenWeatherMap API.
  handleCityCurrentSubmit3() {
    //URL string for weather API
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 180) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   
    console.log(weatherApiUrl)
    
    //fetch weather API
    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res,
        }, this.assignCurrentWeatherParameters 
        )
      })
      .catch(err => {
        console.log(err)
      })
  }


  //Handles submit of position form (current weather). Sets latitude and longitude based on current position of user.
  handlePositionCurrentSubmit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude *1000) / 1000
      }, this.handlePositionCurrentSubmit2)
    })
  }

  //Second part of position form (current weather)
  handlePositionCurrentSubmit2() {
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 90) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   

    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res
        }, this.assignCurrentWeatherParameters)
      })
      .catch(err => {
        console.log(err)
      })

    console.log(weatherApiUrl)
  }

  //Last part of every form (current weather). Assigns current parameters pulled from API to this.state.currentWeather object. Changes view from forms to result display.
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
      currentWeather: cWeather,
      formsDisplay: "none",
      currentDisplay: "block",
      returnButtonDisplay: "flex"
    })

  }

  //Handles submit of latitude and longitude form (forecast weather). Fetches data from OpenWeatherMap API.
  handleLatLongForecastSubmit(event) {
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
        this.handleLatLongForecastSubmit2,
        )
      })
      .catch(error => {
        console.log(error)
      })}
    
  //Second part of latitude and longitude form (forecast weather). Fetches data from OpenCageData API.
  handleLatLongForecastSubmit2() {
    //URL string for reverse location API
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + (this.state.lat % 180) + "+" + (this.state.long % 180) + "&key="  + this.state.locationApiKey  

    //fetch location API
    fetch(locationApiUrl)
    .then(response => response.json())
    .then(res => {
      this.setState({
        locationData: res
      },
      this.handleLatLongForecastSubmit3
      )
    })
    .catch(err => {
      console.log(err)
    })      
    
  }

  //Third part of latitude and longitude form (forecast weather). Sets city and country, if possible for entered coords.
  handleLatLongForecastSubmit3() {
    let city, country

    if (this.state.locationData.results[0].components.city !== undefined) {
      city = this.state.locationData.results[0].components.city
      country = this.state.locationData.results[0].components.country
    } else {
      city = ""
      country = ""
    }
    
    this.setState({
      city: city,
      country: country
    }, this.assignForecastParameters
    )
  }

  //Handles submit of city form (forecast weather). Fetches data from OpenCageData API.
  handleCityForecastSubmit(event) {
    event.preventDefault()
    console.log(this.state.country)

    let locationApiUrl
    //URL string for forward location API

    if (this.state.country === ""){
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "&key=" + this.state.locationApiKey

    } else {
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "%2C" + this.state.country + "&key=" + this.state.locationApiKey 
    }
    fetch(locationApiUrl)
    .then(response => response.json())
    .then(res => {this.setState({
      locationData: res
    }, this.handleCityForecastSubmit2)})

  }

  //Second part of city form (forecast weather). Sets latitude and longitude parameters of city entered in form input.  
  handleCityForecastSubmit2() {
    this.setState({
      lat: this.state.locationData.results[0].geometry.lat,
      long: this.state.locationData.results[0].geometry.lng,
    }, this.handleCityForecastSubmit3)
  }

  //Third part of city form (forecast weather). Fetches data from OpenWeatherMap API.
  handleCityForecastSubmit3() {
    //URL string for weather API
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 180) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   
    console.log(weatherApiUrl)
    
    //fetch weather API
    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res,
        }, this.assignForecastParameters 
        )
      })
      .catch(err => {
        console.log(err)
      })
  }

  //Handles submit of position form (forecast weather). Sets latitude and longitude based on forecast position of user.
  handlePositionForecastSubmit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude *1000) / 1000
      }, this.handlePositionForecastSubmit2)
    })
  }

  //Second part of position form (forecast weather)
  handlePositionForecastSubmit2() {
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + (this.state.lat % 90) + "&lon=" + (this.state.long % 180) + "&exclude=" + this.state.part + "&appid=" + this.state.weatherApiKey   

    fetch(weatherApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          weatherData: res
        }, this.assignForecastParameters)
      })
      .catch(err => {
        console.log(err)
      })

    console.log(weatherApiUrl)
  }

  //Last part of every form (forecast weather). Assigns forecast parameters pulled from API to this.state.forecastWeather object. Changes view from forms to result display.
  assignForecastParameters() {
    const {weatherData} = this.state
    let fWeather = []
    
    weatherData.daily.forEach(function(day,index) {
      fWeather.push({
        dayIndex: index,
        temp: day.temp,
        weather: day.weather[0].description,
        iconId: day.weather[0].icon,
        humidity: day.humidity
      })
    })

    this.setState({
      forecastWeather: fWeather,
      formsDisplay: "none",
      forecastDisplay: "flex",
      returnButtonDisplay: "flex"
    })

  }

  //Handles Return button click.
  handleReturnButton(event) {
    this.setState({
      lat: 0,
      long: 0,
      city: "",
      country: "",
      formsDisplay: "flex",
      currentDisplay: "none",
      forecastDisplay: "none",
      returnButtonDisplay: "none"
    })
    event.preventDefault()
  }

  render() {
    const {city, country, lat, long, currentDisplay, formsDisplay, returnButtonDisplay, currentWeather, forecastWeather, forecastDisplay} = this.state
   
    return (
      <div className="weather-app">
        <div className="background-text">
          Get Your
          <p>Weather</p>
        </div>
        <div className="forms" style={{display:formsDisplay}}>
          <div className="forms-title">Weather App</div>
          <div className="position-form">
            <div className="submit-buttons">
              <button onClick={this.handlePositionCurrentSubmit} className="current-weather-button">Get current weather for your position</button>          
              <button onClick={this.handlePositionForecastSubmit} className="forecast-weather-button">Get seven day forecast for your position</button>          
            </div>
          </div>
          <h1 className="or">OR</h1>
          <div className="city-form">
            <form>
              <label>
                Enter a name of a city:
              </label>
              <div className="city-country-inputs">
                <div className = "city-input">
                <input 
                  type="text"                  
                  name="city"
                  value = {city}
                  onChange={this.handleChange}
                  placeholder = "City"
                  required/> 
                </div>
                <div className = "country-input">
                  <input 
                    type="text" 
                    list="country" 
                    value={this.state.country}
                    name="country"
                    onChange = {this.handleChange}
                    placeholder = "Country*"
                    />
                  <datalist id="country">
                    <option value="">Country*</option>
                    <option>Australia</option>
                    <option>Brazil</option>
                    <option>China</option>
                    <option>France</option>
                    <option>Germany</option>
                    <option>Japan</option>
                    <option>Poland</option>
                    <option>Russia</option>
                    <option>Spain</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                  </datalist>
                </div>
              </div>
              <p>*You may specify a country to help narrow the results,<br /> though it's not required.</p>
              <div className="submit-buttons">
                <button onClick={this.handleCityCurrentSubmit} className="current-weather-button">Get current weather</button>
                <button onClick={this.handleCityForecastSubmit} className="forecast-weather-button">Get seven day forecast</button>
              </div>
          </form>
          </div>
          <h1 className="or">OR</h1>
          <div className="lat-long-form">
            <form>
              <label>
                Enter latitude:
              </label>
              <input 
                type="number"
                step="0.001"
                name="lat"
                value={lat}
                onChange={this.handleChange}
                required/> 
              <label>
                Enter longitude:
              </label>
              <input 
                type="number"
                step="0.001"
                name="long"
                value={long}
                onChange={this.handleChange}
                required/> 
              <div className="submit-buttons">
                <button onClick={this.handleLatLongCurrentSubmit} className="current-weather-button">Get current weather</button>
                <button onClick={this.handleLatLongForecastSubmit} className="forecast-weather-button">Get seven day forecast</button>
              </div>
            </form>
          </div>
        </div>

        <CurrentWeatherDisplay 
          city={city}
          country={country}
          lat={lat}
          long={long}
          currentDisplay = {currentDisplay}
          currentWeather = {currentWeather}
          />
        <ForecastDisplay 
          city={city}
          country = {country}
          lat={lat}
          long= {long}
          forecastDisplay = {forecastDisplay}
          forecastWeather = {forecastWeather}
          />
        

        <button 
          onClick={this.handleReturnButton} 
          style={{display:returnButtonDisplay}} 
          className="return-button">
            <i className="fas fa-arrow-left"></i><span>Return</span>
        </button>
      </div>
    )
  }
}

export default WeatherApp