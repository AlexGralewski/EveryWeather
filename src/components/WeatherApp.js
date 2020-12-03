import React from "react"
import timestampToTime from "../methods/timestampToTime"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"
import ForecastDisplay from "./ForecastDisplay"
import startingBackgroundImage from "../images/starting-bg.jpg"
import getBackgroundImage from "../methods/getBackgroundImage"

class WeatherApp extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: "0", //latitude
      long: "0", //longitude
      city: "", //City, town or village
      state: "",
      country: "",
      part: "minutely,hourly", //Excludes parts of weather data. Available values: "current", "minutely", "hourly", "daily", "alerts". Seperated by comma without spaces
      weatherApiKey: "692d3bd12adf77c08728b7324d9f2b14", //API key for OpenWeatherMapAPI
      weatherData: undefined, //data pulled from weather API
      currentWeather: undefined,
      forecastWeather: undefined,
      locationApiKey: "44f5f3ce977746e7ab89ddeae84b48d3", //API key for openCageData
      locationData: undefined, //data pulled from location API
      cityList: <div className="city-list-items"></div>,
      chosenCityIndex: "",
      formsDisplay: "flex", //determines if forms section is visible
      currentWeatherDisplay: "none", //determines if current weather section is visible
      forecastDisplay: "none", //determines if forecast section is visible
      returnButtonDisplay: "none", //determines if return button is visible
      cityListDisplay: "none", //determines if city list section is visible
      backgroundImage: startingBackgroundImage
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCoordsCurrentWeatherSubmit = this.handleCoordsCurrentWeatherSubmit.bind(this)
    this.handleCityCurrentWeatherSubmit = this.handleCityCurrentWeatherSubmit.bind(this)
    this.handlePositionCurrentWeatherSubmit = this.handlePositionCurrentWeatherSubmit.bind(this)
    this.handleReturnButton = this.handleReturnButton.bind(this)
    this.handleCoordsForecastSubmit = this.handleCoordsForecastSubmit.bind(this)
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

  //Handles submit of coords form (current weather). Fetches data from OpenWeatherMap API.
  handleCoordsCurrentWeatherSubmit(event) {
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
        this.handleCoordsCurrentWeatherSubmit2,
        )
      })
      .catch(err => {
        console.log(err)
      })
    }
    
  //Second part of coords form (current weather). Fetches data from OpenCageData API.
  handleCoordsCurrentWeatherSubmit2() {
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
      this.handleCoordsCurrentWeatherSubmit3
      )
    })
    .catch(err => {
      console.log(err)
    })      
    
  }
  
  //Third part of coords form (current weather). Sets city and country, if possible for entered coords.
  handleCoordsCurrentWeatherSubmit3() {
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

  //Handles submit of the city form (current weather). Fetches data from OpenCageData API.
  handleCityCurrentWeatherSubmit(event) {
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
    }, this.handleCityCurrentWeatherSubmit2)})
  }

  //Second part of the city form submit (current weather). Creates a list of places that match the city entered in the city form. If there are no matches it displays an alert, if there is one match it goes to assignCurrentWeatherParameters function, if there is more than one match it goes to cityListDisplayForCurrentWeather.
  handleCityCurrentWeatherSubmit2() {    
    let cityList = []

    this.state.locationData.results.forEach((place, placeIndex) => {
      if (place.components._category === "place") {
        if (place.confidence < 7) {
          cityList.push(place)
        } else if (place.components.city !== undefined) {
          if (place.components.city.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        } else if (place.components.town !== undefined) {
          if (place.components.town.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        } else if (place.components.village !== undefined) {
          if (place.components.village.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        } else if (place.components._type !== "county") {
          if (place.components.county.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        }
      }
    })

    if (cityList.length === 1) {
      this.setState({
        lat: this.state.locationData.results[0].geometry.lat,
        long: this.state.locationData.results[0].geometry.lng,
        country: this.state.locationData.results[0].components.country
      }, this.fetchWeatherDataForCurrentWeather)
    } else if (cityList.length > 1){
      this.setState({
        locationData: cityList,
        cityListDisplay: "flex",
        formsDisplay: "none",
        returnButtonDisplay: "flex"
      }, this.cityListDisplayForCurrentWeather)
    } else {
      alert("No results")
      this.setState({
        city: "",
        country: ""
        })
    }
  }
   
  //Conditional (2.1) part of the city form submit (current weather). Creates a list of places that match the one entered in the form. 
  cityListDisplayForCurrentWeather() {
    let cities = this.state.locationData.map((city, index) => {
    if (city.components.city !== undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.city}</div>
          <div className = "city-details">City in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForCurrentWeather)}}>This one</button>
        </div>
        )
    } else if (city.components.town !==undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.town}</div>
          <div className = "city-details">Town in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForCurrentWeather)}}>This one</button>
        </div>)
    } else if (city.components.village !==undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.village}</div>
          <div className = "city-details">Village in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForCurrentWeather)}}>This one</button>
        </div>)
    } else if (city.components.county !== undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.county}</div>
          <div className = "city-details">County in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForCurrentWeather)}}>This one</button>
        </div>)
    } 

    })

    this.setState({
      cityList: <div className="city-list-items">{cities}</div>
    })
  }

  //Conditional (2.2) part of the city form submit (current weather). Assigns coords and country of the city chosen from the list. Goes to fetchWeatherDataForCurrentWeather function.
  handleChosenCityForCurrentWeather() {
  this.setState({
    lat: this.state.locationData[this.state.chosenCityIndex].geometry.lat,
    long: this.state.locationData[this.state.chosenCityIndex].geometry.lng,
    country: this.state.locationData[this.state.chosenCityIndex].components.country
  }, this.fetchWeatherDataForCurrentWeather)
  }

  //Third part of the city form submit (current weather). Fetches data from OpenWeatherMap API. Goes to assignCurrentWeatherParameters function.
  fetchWeatherDataForCurrentWeather() {  
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
  handlePositionCurrentWeatherSubmit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude *1000) / 1000
      }, this.handlePositionCurrentWeatherSubmit2)
    })
  } 

  //Second part of position form (current weather)
  handlePositionCurrentWeatherSubmit2() {
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
    cWeather.temp = Math.round((weatherData.current.temp - 273.15)*10) /10
    cWeather.feels_like = Math.round((weatherData.current.feels_like - 273.15)*10) /10

    //sets current sunrise and sunset
    cWeather.sunrise = timestampToTime(weatherData.current.sunrise)
    cWeather.sunset = timestampToTime(weatherData.current.sunset)
    //sets current weather parameters
    cWeather.description = weatherData.current.weather[0].description
    cWeather.iconId = weatherData.current.weather[0].icon
    cWeather.pressure = weatherData.current.pressure
    cWeather.humidity = weatherData.current.humidity
    cWeather.wind = [Math.round(weatherData.current.wind_deg), weatherData.current.wind_speed]
    cWeather.clouds = weatherData.current.clouds
    cWeather.uvi = weatherData.current.uvi
    cWeather.visibility = weatherData.current.visibility / 1000


    this.setState({
      currentWeather: cWeather,
      formsDisplay: "none",
      currentWeatherDisplay: "flex",
      returnButtonDisplay: "flex",
      cityListDisplay: "none",
      backgroundImage: getBackgroundImage(weatherData.current.weather[0].icon)
    })

  }

  //Handles submit of latitude and longitude form (forecast weather). Fetches data from OpenWeatherMap API.
  handleCoordsForecastSubmit(event) {
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
        this.handleCoordsForecastSubmit2,
        )
      })
      .catch(error => {
        console.log(error)
      })
  }
    
  //Second part of latitude and longitude form (forecast weather). Fetches data from OpenCageData API.
  handleCoordsForecastSubmit2() {
    //URL string for reverse location API
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + (this.state.lat % 180) + "+" + (this.state.long % 180) + "&key="  + this.state.locationApiKey  

    //fetch location API
    fetch(locationApiUrl)
    .then(response => response.json())
    .then(res => {
      this.setState({
        locationData: res
      },
      this.handleCoordsForecastSubmit3
      )
    })
    .catch(err => {
      console.log(err)
    })      
    
  }

  //Third part of latitude and longitude form (forecast weather). Sets city and country, if possible for entered coords.
  handleCoordsForecastSubmit3() {
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

  //Handles submit of the city form (current weather). Fetches data from OpenCageData API.
  handleCityForecastSubmit(event) {
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
    }, this.handleCityForecastSubmit2)})

    
  }

  //Second part of the city form submit (forecast). Creates a list of places that match the city entered in the city form. If there are no matches it displays an alert, if there is one match it goes to assignCurrentWeatherParameters function, if there is more than one match it goes to cityListDisplayForCurrentWeather.
  handleCityForecastSubmit2() {    
    let cityList = []

    this.state.locationData.results.forEach((place, placeIndex) => {
      if (place.components._category === "place") {
        if (place.confidence < 7) {
          cityList.push(place)
        } else if (place.components.city !== undefined) {
          if (place.components.city.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        } else if (place.components.town !== undefined) {
          if (place.components.town.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        } else if (place.components.village !== undefined) {
          if (place.components.village.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        } else if (place.components._type !== "county") {
          if (place.components.county.toLowerCase() === this.state.city.toLowerCase()) {
            cityList.push(place)
          }
        }
      }
    })

    if (cityList.length === 1) {
      this.setState({
        lat: this.state.locationData.results[0].geometry.lat,
        long: this.state.locationData.results[0].geometry.lng,
        country: this.state.locationData.results[0].components.country
      }, this.fetchWeatherDataForForecast)
    } else if (cityList.length > 1){
      this.setState({
        locationData: cityList,
        cityListDisplay: "flex",
        formsDisplay: "none",
        returnButtonDisplay: "flex"
      }, this.cityListDisplayForForecast)
    } else {
      alert("No results")
      this.setState({
        city: "",
        country: ""
        })
    }
  }
   
  //Conditional (2.1) part of the city form submit (forecast). Creates a list of places that match the one entered in the form. 
  cityListDisplayForForecast() {
    let cities = this.state.locationData.map((city, index) => {
    if (city.components.city !== undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.city}</div>
          <div className = "city-details">City in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForForecast)}}>This one</button>
        </div>
        )
    } else if (city.components.town !== undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.town}</div>
          <div className = "city-details">Town in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForForecast)}}>This one</button>
        </div>)
    } else if (city.components.village !==undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.village}</div>
          <div className = "city-details">Village in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForForecast)}}>This one</button>
        </div>)
    } else if (city.components.county !== undefined) {
      return(
        <div key={index} className="city-list-item">
          <div className = "city-name">{city.components.county}</div>
          <div className = "city-details">County in {city.components.state}, {city.components.country}</div>
          <div className = "city-coords">
            <div className = "city-latitude">Latitude: {Math.round((city.geometry.lat)*1000)/1000}</div>
            <div className = "city-longitude">Longitude: {Math.round((city.geometry.lng)*1000)/1000}</div>
          </div>
          <button className = "city-button" onClick = {() => {this.setState({
            chosenCityIndex: index
          }, this.handleChosenCityForForecast)}}>This one</button>
        </div>)
    } 

    })

    this.setState({
      cityList: <div className="city-list-items">{cities}</div>
    })
  }

  //Conditional (2.2) part of the city form submit (forecast). Assigns coords and country of the city chosen from the list. Goes to fetchWeatherDataForCurrentWeather function.
  handleChosenCityForForecast() {
  this.setState({
    lat: this.state.locationData[this.state.chosenCityIndex].geometry.lat,
    long: this.state.locationData[this.state.chosenCityIndex].geometry.lng,
    country: this.state.locationData[this.state.chosenCityIndex].components.country
  }, this.fetchWeatherDataForForecast)
  }

  //Third part of the city form submit (forecast). Fetches data from OpenWeatherMap API. Goes to assignCurrentWeatherParameters function.
  fetchWeatherDataForForecast() {  
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

  //Handles submit of position form (forecast). Sets latitude and longitude based on forecast position of user.
  handlePositionForecastSubmit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude *1000) / 1000
      }, this.handlePositionForecastSubmit2)
    })
  }

  //Second part of position form (forecast)
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

  //Last part of every form (forecast). Assigns forecast parameters pulled from API to this.state.forecastWeather object. Changes view from forms to result display.
  assignForecastParameters() {
    const {weatherData} = this.state
    let fWeather = []
    
    weatherData.daily.forEach((day,index) => {
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
      returnButtonDisplay: "flex",
      cityListDisplay: "none"
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
      currentWeatherDisplay: "none",
      forecastDisplay: "none",
      returnButtonDisplay: "none",
      cityListDisplay: "none",
      backgroundImage: startingBackgroundImage
    })
    event.preventDefault()
  }

  render() {
    const {city, country, lat, long, currentWeatherDisplay, formsDisplay, returnButtonDisplay, currentWeather, forecastWeather, forecastDisplay, cityListDisplay, cityList, backgroundImage} = this.state
   
    return (
      <div className = "weather-app" style={{backgroundImage:`url(${backgroundImage})`}}>

        <div className = "forms" style = {{display:formsDisplay}}>
          <div className = "forms-title">EveryWeather</div>
          <div className = "forms-desc">Get weather data for any place!</div>
          <div className = "position-form">
            <div className = "submit-buttons">
              <button onClick = {this.handlePositionCurrentWeatherSubmit} className = "current-weather-button">Get current weather for your position</button>          
              <button onClick = {this.handlePositionForecastSubmit} className = "forecast-weather-button">Get seven day forecast for your position</button>          
            </div>
          </div>
          <h1 className = "or">OR</h1>
          <div className = "city-form">
            <form>
              <label>
                Search by the name of a place:
              </label>
              <div className = "city-country-inputs">
                <div className = "city-input">
                <input 
                  type="text"                  
                  name="city"
                  value = {city}
                  onChange = {this.handleChange}
                  placeholder = "City"
                  required/> 
                </div>
                <div className = "country-input">
                  <input 
                    type = "text" 
                    list = "country" 
                    value = {this.state.country}
                    name = "country"
                    onChange = {this.handleChange}
                    placeholder = "Country*"
                    />
                  <datalist id = "country">
                    <option value = "">Country*</option>
                    <option>Australia</option>
                    <option>Brazil</option>
                    <option>China</option>
                    <option>France</option>
                    <option>Germany</option>
                    <option>Ireland</option>
                    <option>Japan</option>
                    <option>Poland</option>
                    <option>Portugal</option>
                    <option>Russia</option>
                    <option>Spain</option>
                    <option>Sweden</option>
                    <option>United Kingdom</option>
                    <option>United%20States</option>
                  </datalist>
                </div>
              </div>
              <p>*You may specify a country to help narrow the results, though it's not required.</p>
              <div className="submit-buttons">
                <button onClick={this.handleCityCurrentWeatherSubmit} className="current-weather-button">Get current weather</button>
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
                type = "number"
                step = "0.001"
                name = "lat"
                value = {lat}
                onChange = {this.handleChange}
                required/> 
              <label>
                Enter longitude:
              </label>
              <input 
                type = "number"
                step = "0.001"
                name = "long"
                value = {long}
                onChange = {this.handleChange}
                required/> 
              <div className="submit-buttons">
                <button onClick = {this.handleCoordsCurrentWeatherSubmit} className="current-weather-button">Get current weather</button>
                <button onClick = {this.handleCoordsForecastSubmit} className="forecast-weather-button">Get seven day forecast</button>
              </div>
            </form>
          </div>
        </div>

        <CurrentWeatherDisplay 
          city = {city}
          country = {country}
          lat = {lat}
          long = {long}
          currentDisplay = {currentWeatherDisplay}
          currentWeather = {currentWeather}
          />
        <ForecastDisplay 
          city = {city}
          country = {country}
          lat = {lat}
          long = {long}
          forecastDisplay = {forecastDisplay}
          forecastWeather = {forecastWeather}
          />
        
        <div className="city-list" style = {{display:cityListDisplay}}>
          <div className = "city-list-title">Which place did you have in mind?</div>
          {cityList}
        </div>

        <button 
          onClick = {this.handleReturnButton} 
          style = {{display:returnButtonDisplay}} 
          className = "return-button">
            <span className="return-icon"><i className = "fas fa-arrow-left"></i></span>
            <span className = "return-text">Return</span>
        </button>
      </div>
    )
  }
}

export default WeatherApp