import React from "react"
import timestampToTime from "../methods/timestampToTime"
import CurrentWeatherDisplay from "./CurrentWeatherDisplay"
import ForecastDisplay from "./ForecastDisplay"
import startingBackgroundImage from "../methods/startingBackgroundImage"
import getBackgroundImage from "../methods/getBackgroundImage"
import snowflake from "../assets/snowflake.svg"

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
      formsDisplay: "flex", //determines if forms section is displayed
      currentWeatherDisplay: "none", //determines if current weather section is displayed
      forecastDisplay: "none", //determines if forecast section is displayed
      returnButtonDisplay: "none", //determines if return button is displayed
      cityListDisplay: "none", //determines if city list section is displayed
      loadingScreen: "none", 
      startingScreen: "flex",
      backgroundImage: startingBackgroundImage()
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

  componentDidMount() {
    setTimeout( () => { 
      this.setState({
      startingScreen: "none"
      }) 
    }, 2000);
    
  }

  //Handles change of all inputs in forms section.
  handleChange(event) {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  //Handles submit of coords form (current weather). Fetches data from OpenWeatherMap API.
  handleCoordsCurrentWeatherSubmit(event) {
    event.preventDefault()

    this.setState({
      loadingScreen: "flex"
    })

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
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + (this.state.lat % 180) + "+" + (this.state.long % 180) + "&key=" + this.state.locationApiKey

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

    this.setState({
      loadingScreen: "flex"
    })

    let locationApiUrl
    //URL string for forward location API
    if (this.state.country === "") {
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "&key=" + this.state.locationApiKey
    } else {
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "%2C" + this.state.country + "&key=" + this.state.locationApiKey
    }


    fetch(locationApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          locationData: res
        }, this.handleCityCurrentWeatherSubmit2)
      })
  }

  //Second part of the city form submit (current weather). Creates a list of places that match the city entered in the city form. If there are no matches it displays an alert, if there is one match it goes to assignCurrentWeatherParameters function, if there is more than one match it goes to cityListDisplayForCurrentWeather.
  handleCityCurrentWeatherSubmit2() {
    let cityList = []

    console.log(this.locationData)
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
    } else if (cityList.length > 1) {
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
        country: "",
        loadingScreen: "none"
      })
    }
  }

  //Conditional (2.1) part of the city form submit (current weather). Creates a list of places that match the one entered in the form. 
  cityListDisplayForCurrentWeather() {
    this.setState({
      loadingScreen: "none"
    })

    let cities = this.state.locationData.map((city, index) => {
      if (city.components.city !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.city}</div>
            <div className="city-details">City in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForCurrentWeather)
            }}>This one</button>
          </div>
        )
      } else if (city.components.town !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.town}</div>
            <div className="city-details">Town in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForCurrentWeather)
            }}>This one</button>
          </div>)
      } else if (city.components.village !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.village}</div>
            <div className="city-details">Village in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForCurrentWeather)
            }}>This one</button>
          </div>)
      } else if (city.components.county !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.county}</div>
            <div className="city-details">County in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForCurrentWeather)
            }}>This one</button>
          </div>)
      }

    })

    this.setState({
      cityList: <div className="city-list-items">{cities}</div>,

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
  handlePositionCurrentWeatherSubmit(event) {
    event.preventDefault()

    this.setState({
      loadingScreen: "flex"
    })

    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude * 1000) / 1000
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
    const { weatherData } = this.state
    let cWeather = {}

    //sets current temperature
    cWeather.temp = Math.round((weatherData.current.temp - 273.15) * 10) / 10
    cWeather.feels_like = Math.round((weatherData.current.feels_like - 273.15) * 10) / 10

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
      loadingScreen: "none",
      backgroundImage: getBackgroundImage(weatherData.current.weather[0].icon)
    })

  }

  //Handles submit of latitude and longitude form (forecast weather). Fetches data from OpenWeatherMap API.
  handleCoordsForecastSubmit(event) {
    event.preventDefault()

    this.setState({
      loadingScreen: "flex"
    })

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
    let locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + (this.state.lat % 180) + "+" + (this.state.long % 180) + "&key=" + this.state.locationApiKey

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

    this.setState({
      loadingScreen: "flex"
    })

    let locationApiUrl
    //URL string for forward location API
    if (this.state.country === "") {
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "&key=" + this.state.locationApiKey
    } else {
      locationApiUrl = "https://api.opencagedata.com/geocode/v1/json?q=" + this.state.city + "%2C" + this.state.country + "&key=" + this.state.locationApiKey
    }
    fetch(locationApiUrl)
      .then(response => response.json())
      .then(res => {
        this.setState({
          locationData: res
        }, this.handleCityForecastSubmit2)
      })


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
    } else if (cityList.length > 1) {
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
        country: "",
        loadingScreen: "none"
      })
    }
  }

  //Conditional (2.1) part of the city form submit (forecast). Creates a list of places that match the one entered in the form. 
  cityListDisplayForForecast() {
    this.setState({
      loadingScreen: "none"
    })

    let cities = this.state.locationData.map((city, index) => {
      if (city.components.city !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.city}</div>
            <div className="city-details">City in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForForecast)
            }}>This one</button>
          </div>
        )
      } else if (city.components.town !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.town}</div>
            <div className="city-details">Town in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForForecast)
            }}>This one</button>
          </div>)
      } else if (city.components.village !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.village}</div>
            <div className="city-details">Village in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForForecast)
            }}>This one</button>
          </div>)
      } else if (city.components.county !== undefined) {
        return (
          <div key={index} className="city-list-item">
            <div className="city-name">{city.components.county}</div>
            <div className="city-details">County in {city.components.state}, {city.components.country}</div>
            <div className="city-coords">
              <div className="city-latitude">Latitude: {Math.round((city.geometry.lat) * 1000) / 1000}</div>
              <div className="city-longitude">Longitude: {Math.round((city.geometry.lng) * 1000) / 1000}</div>
            </div>
            <button className="city-button" onClick={() => {
              this.setState({
                chosenCityIndex: index
              }, this.handleChosenCityForForecast)
            }}>This one</button>
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
  handlePositionForecastSubmit(event) {
    event.preventDefault()

    this.setState({
      loadingScreen: "flex"
    })

    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: Math.round(position.coords.latitude * 1000) / 1000,
        long: Math.round(position.coords.longitude * 1000) / 1000
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
    const { weatherData } = this.state
    let fWeather = []

    weatherData.daily.forEach((day, index) => {
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
      cityListDisplay: "none",
      loadingScreen: "none",
      backgroundImage: getBackgroundImage(weatherData.current.weather[0].icon)
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
      backgroundImage: startingBackgroundImage()
    })
    event.preventDefault()
  }

  render() {
    const { city, country, lat, long, currentWeatherDisplay, formsDisplay,
      returnButtonDisplay, currentWeather, forecastWeather, forecastDisplay,
      cityListDisplay, cityList, backgroundImage, loadingScreen, startingScreen } = this.state

    return (
      <div className="weather-app" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="loading-screen" style={{ display: loadingScreen }}> <svg id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><g><path d="m204.381 396.158c-1.938 0-3.875-.375-5.704-1.127-3.773-1.551-6.751-4.572-8.249-8.366l-18.404-46.629-46.458-18.055c-3.802-1.478-6.838-4.44-8.41-8.205-1.571-3.765-1.541-8.006.083-11.749l19.958-45.985-20.084-45.617c-1.644-3.733-1.696-7.975-.145-11.748s4.572-6.751 8.366-8.249l46.629-18.404 18.055-46.458c1.478-3.802 4.44-6.838 8.205-8.41 3.764-1.571 8.005-1.542 11.749.083l45.985 19.958 45.617-20.084c3.733-1.644 7.976-1.697 11.748-.145 3.773 1.551 6.751 4.572 8.249 8.366l18.404 46.629 46.458 18.055c3.802 1.478 6.838 4.44 8.41 8.205 1.571 3.765 1.541 8.006-.083 11.749l-19.958 45.985 20.084 45.617c1.644 3.733 1.696 7.975.145 11.748s-4.572 6.751-8.366 8.249l-46.629 18.404-18.055 46.458c-1.478 3.802-4.44 6.838-8.205 8.41-3.765 1.57-8.007 1.541-11.749-.083l-45.985-19.958-45.617 20.084c-1.924.847-3.983 1.272-6.044 1.272zm-53.413-96.491 38.036 14.781c3.896 1.515 6.984 4.586 8.519 8.475l15.086 38.223 37.347-16.443c3.827-1.684 8.182-1.696 12.017-.032l37.695 16.36 14.781-38.035c1.515-3.896 4.586-6.984 8.475-8.519l38.223-15.086-16.443-37.347c-1.685-3.826-1.696-8.182-.032-12.017l16.361-37.695-38.036-14.781c-3.896-1.515-6.984-4.586-8.519-8.475l-15.086-38.223-37.347 16.443c-3.826 1.685-8.181 1.697-12.017.032l-37.695-16.36-14.781 38.035c-1.515 3.896-4.586 6.984-8.475 8.519l-38.223 15.086 16.443 37.347c1.685 3.826 1.696 8.182.032 12.017z" fill="#4793ff"/></g><path d="m394.886 301.574-20.084-45.617 19.958-45.985c1.624-3.742 1.654-7.984.083-11.749s-4.607-6.727-8.41-8.205l-46.458-18.055-18.404-46.629c-1.498-3.794-4.476-6.815-8.249-8.366-3.772-1.552-8.015-1.499-11.748.145l-45.574 20.066v31.388c2.06 0 4.119-.422 6.045-1.27l37.347-16.443 15.086 38.223c1.535 3.889 4.623 6.96 8.519 8.475l38.036 14.781-16.361 37.695c-1.665 3.835-1.653 8.19.032 12.017l16.443 37.347-38.223 15.086c-3.889 1.535-6.96 4.623-8.475 8.519l-14.781 38.035-37.695-16.36c-1.905-.827-3.939-1.238-5.972-1.238v31.387l.043-.019 45.985 19.958c3.742 1.624 7.984 1.654 11.749.083s6.727-4.607 8.205-8.41l18.055-46.458 46.629-18.404c3.794-1.498 6.815-4.476 8.366-8.249 1.55-3.773 1.497-8.014-.147-11.748z" fill="#525cdd"/><path d="m311.638 30.569c-4.142-7.175-13.314-9.633-20.49-5.49l-35.148 20.292-35.148-20.292c-7.176-4.144-16.349-1.684-20.49 5.49-4.142 7.174-1.684 16.348 5.49 20.49l41.443 23.927c2.362 1.364 4.941 2.012 7.486 2.012.408 0 .814-.023 1.219-.056.405.033.811.056 1.219.056 2.544 0 5.124-.648 7.486-2.012l41.443-23.927c7.174-4.142 9.632-13.316 5.49-20.49z" fill="#7dd5f4"/><path d="m306.147 460.941-41.443-23.927c-2.742-1.583-5.774-2.196-8.708-1.956-2.932-.238-5.962.374-8.702 1.956l-41.443 23.927c-7.174 4.142-9.632 13.316-5.49 20.49 2.778 4.813 7.82 7.502 13.004 7.502 2.544 0 5.124-.648 7.486-2.012l35.149-20.292 35.148 20.293c2.362 1.364 4.941 2.012 7.486 2.012 5.184 0 10.226-2.69 13.004-7.502 4.142-7.175 1.684-16.349-5.491-20.491z" fill="#7dd5f4"/><path d="m466.629 256 20.292-35.148c4.142-7.174 1.684-16.348-5.49-20.49-7.175-4.144-16.349-1.685-20.49 5.49l-23.927 41.443c-1.582 2.741-2.195 5.772-1.956 8.705-.239 2.932.373 5.964 1.956 8.705l23.927 41.443c2.778 4.813 7.82 7.502 13.004 7.502 2.544 0 5.124-.648 7.486-2.012 7.174-4.142 9.632-13.316 5.49-20.49z" fill="#4793ff"/><path d="m74.986 247.295-23.927-41.443c-4.142-7.174-13.316-9.633-20.49-5.49-7.174 4.142-9.632 13.316-5.49 20.49l20.292 35.148-20.293 35.148c-4.142 7.174-1.684 16.348 5.49 20.49 2.362 1.364 4.941 2.012 7.486 2.012 5.184 0 10.226-2.69 13.004-7.502l23.927-41.443c1.582-2.741 2.195-5.772 1.956-8.705.24-2.933-.373-5.964-1.955-8.705z" fill="#7dd5f4"/><path d="m454.746 376.062c-2.145-8.001-10.368-12.754-18.371-10.606l-46.223 12.386c-3.056.819-5.632 2.529-7.536 4.77-2.243 1.905-3.955 4.482-4.774 7.54l-12.386 46.224c-2.144 8.002 2.604 16.227 10.606 18.371 1.301.349 2.606.515 3.892.515 6.623 0 12.684-4.42 14.479-11.122l10.504-39.203 39.202-10.504c8.002-2.144 12.751-10.37 10.607-18.371z" fill="#4793ff"/><path d="m135.937 57.253c-8.004-2.145-16.227 2.605-18.371 10.606l-10.504 39.203-39.202 10.504c-8.002 2.144-12.75 10.369-10.606 18.371 1.795 6.702 7.856 11.122 14.479 11.122 1.285 0 2.591-.167 3.892-.515l46.224-12.385c3.063-.821 5.643-2.537 7.549-4.786 2.236-1.904 3.944-4.474 4.761-7.525l12.386-46.224c2.143-8.001-2.606-16.227-10.608-18.371z" fill="#7dd5f4"/><path d="m444.139 117.566-39.202-10.504-10.504-39.202c-2.145-8.002-10.368-12.752-18.371-10.606-8.002 2.144-12.75 10.369-10.606 18.371l12.386 46.223c.818 3.051 2.526 5.622 4.762 7.526 1.905 2.249 4.485 3.964 7.548 4.785l46.224 12.386c1.301.349 2.606.515 3.892.515 6.623 0 12.684-4.42 14.479-11.122 2.143-8.002-2.606-16.228-10.608-18.372z" fill="#4793ff"/><path d="m146.544 436.375-12.386-46.224c-.819-3.058-2.531-5.635-4.774-7.54-1.904-2.242-4.48-3.951-7.536-4.77l-46.224-12.386c-8.006-2.146-16.228 2.604-18.371 10.606-2.144 8.002 2.604 16.227 10.606 18.371l39.202 10.504 10.504 39.202c1.796 6.702 7.856 11.122 14.479 11.122 1.285 0 2.591-.167 3.892-.515 8.003-2.143 12.752-10.369 10.608-18.37z" fill="#7dd5f4"/><path d="m497 241h-204.787l144.806-144.806c5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.213 0l-144.806 144.806v-204.787c0-8.284-6.716-15-15-15s-15 6.716-15 15v204.787l-144.806-144.806c-5.857-5.858-15.355-5.858-21.213 0s-5.858 15.355 0 21.213l144.806 144.806h-204.787c-8.284 0-15 6.716-15 15s6.716 15 15 15h204.787l-144.806 144.806c-5.858 5.858-5.858 15.355 0 21.213 2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.464 10.606-4.394l144.807-144.806v204.787c0 8.284 6.716 15 15 15s15-6.716 15-15v-204.787l144.806 144.806c2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.464 10.606-4.394c5.858-5.858 5.858-15.355 0-21.213l-144.805-144.806h204.787c8.284 0 15-6.716 15-15s-6.716-15-15-15z" fill="#7dd5f4"/><g fill="#4793ff"><path d="m497 241h-204.787l144.806-144.806c5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.213 0l-144.806 144.806v-204.787c0-8.284-6.716-15-15-15v512c8.284 0 15-6.716 15-15v-204.787l144.806 144.806c2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.464 10.606-4.394c5.858-5.858 5.858-15.355 0-21.213l-144.805-144.806h204.787c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/><path d="m311.638 30.569c-4.142-7.175-13.314-9.633-20.49-5.49l-35.148 20.292v31.572c.405.033.811.056 1.219.056 2.544 0 5.124-.648 7.486-2.012l41.443-23.927c7.174-4.143 9.632-13.317 5.49-20.491z"/><path d="m306.147 460.941-41.443-23.927c-2.741-1.583-5.773-2.195-8.705-1.956v31.571l35.148 20.293c2.362 1.364 4.941 2.012 7.486 2.012 5.184 0 10.226-2.69 13.004-7.502 4.143-7.175 1.685-16.349-5.49-20.491z"/></g></g></svg>
        </div>
        <div className="starting-screen" style={{ display: startingScreen }}><h1>EveryWeather</h1></div>
          
        <button
          onClick={this.handleReturnButton}
          style={{ display: returnButtonDisplay }}
          className="return-button">
          <span className="return-icon"><i class="fas fa-chevron-left"></i></span>
          <span className="return-text">Return</span>
        </button>
        <div className="forms" style={{ display: formsDisplay }}>
          <div className="forms-title">EveryWeather</div>
          <div className="forms-desc">Get weather data for any place!</div>
          <div className="position-form">
            <form>
              <label>For your current position</label>
              <div className="submit-buttons">
                <button onClick={this.handlePositionCurrentWeatherSubmit} className="current-weather-button">Get <b>current weather</b></button>
                <button onClick={this.handlePositionForecastSubmit} className="forecast-weather-button">Get <b>seven day forecast</b> </button>
              </div>
            </form>
          </div>
          <h1 className="or">OR</h1>
          <div className="city-form">
            <form>
              <label>
                Search by the name of a place:
              </label>
              <div className="city-country-inputs">
                <div className="city-input">
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={this.handleChange}
                    placeholder="City"
                    required />
                </div>
                <div className="country-input">
                  <input
                    type="text"
                    list="country"
                    value={this.state.country}
                    name="country"
                    onChange={this.handleChange}
                    placeholder="Country*"
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
                type="number"
                step="0.001"
                name="lat"
                value={lat}
                onChange={this.handleChange}
                required />
              <label>
                Enter longitude:
              </label>
              <input
                type="number"
                step="0.001"
                name="long"
                value={long}
                onChange={this.handleChange}
                required />
              <div className="submit-buttons">
                <button onClick={this.handleCoordsCurrentWeatherSubmit} className="current-weather-button">Get current weather</button>
                <button onClick={this.handleCoordsForecastSubmit} className="forecast-weather-button">Get seven day forecast</button>
              </div>
            </form>
          </div>
        </div>

        <CurrentWeatherDisplay
          city={city}
          country={country}
          lat={lat}
          long={long}
          currentDisplay={currentWeatherDisplay}
          currentWeather={currentWeather}
        />
        <ForecastDisplay
          city={city}
          country={country}
          lat={lat}
          long={long}
          forecastDisplay={forecastDisplay}
          forecastWeather={forecastWeather}
        />

        <div className="city-list" style={{ display: cityListDisplay }}>
          <div className="title">Which place did you have in mind?</div>
          {cityList}
        </div>


      </div>
    )
  }
}

export default WeatherApp