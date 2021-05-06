import React from "react";
import getWeatherIcon from "../methods/getWeatherIcon";
import windDirection from "../methods/windDirection";
import ReturnButton from "./ReturnButton";

const CurrentWeatherDisplay = (props) => {
  const {
    city,
    country,
    lat,
    long,
    currentWeather,
    currentDisplay,
    handleReturnButton,
  } = props;
  if (currentWeather !== undefined) {
    let currentWeatherIcon = getWeatherIcon(currentWeather.iconId);

    let place;
    if (city !== "") {
      place = (
        <div className="place-city">
          <i className="fas fa-map-marker-alt"></i> {city}, {country}
        </div>
      );
    }

    return (
      <div className="cw-display" style={{ display: currentDisplay }}>
        <div className="display-header">
          <ReturnButton handleReturnButton={handleReturnButton} />
          <div className="title">Current weather</div>
        </div>
      <div className = "place">
        <span className="for">For:</span>
        <span className = "place-lat-long">
          <div>lat: {lat}</div>
          <div>long: {long}</div>
          </span>
        <span> {place}</span>
       
      </div>
        <div className="cw-main">
          <div className="cw-representation">
            <div className="cw-icon">{currentWeatherIcon}</div>
            <div className="cw-description">{currentWeather.description}</div>
          </div>
          <div className="cw-temp">
            <div className="cw-temp-actual">{currentWeather.temp}°C</div>
            <div className="cw-temp-feels-like">
              Feels like:{" "}
              <span className="feels-like-value">
                {currentWeather.feels_like}°C
              </span>
            </div>
          </div>
        </div>
        <div className="cw-details">
          <div className="cw-humidity cw-detail-box">
            <div className="cw-detail-box-title">Humidity</div>
            <div className="cw-detail-box-value">
              {currentWeather.humidity}
              <span className="unit">%</span>
            </div>
          </div>
          <div className="cw-clouds cw-detail-box">
            <div className="cw-detail-box-title">Clouds</div>
            <div className="cw-detail-box-value">
              {currentWeather.clouds}
              <span className="unit">%</span>
            </div>
          </div>
          <div className="cw-uvi cw-detail-box">
            <div className="cw-detail-box-title">UVI</div>
            <div className="cw-detail-box-value">{currentWeather.uvi}</div>
          </div>
          <div className="cw-visibility cw-detail-box">
            <div className="cw-detail-box-title">Visibility</div>
            <div className="cw-detail-box-value">
              {currentWeather.visibility}
              <span className="unit">km</span>
            </div>
          </div>
          <div className="cw-wind cw-detail-box">
            <div className="cw-detail-box-title">Wind</div>
            <div className="cw-detail-box-value wind-value">
              <div className="wind-speed">
                {currentWeather.wind[1]}
                <span className="unit">m/s</span>
              </div>
              <div className="wind-deg">
                {currentWeather.wind[0]}°(
                {windDirection(currentWeather.wind[0])})
                <span className="unit"></span>
              </div>
            </div>
          </div>
          <div className="cw-pressure cw-detail-box">
            <div className="cw-detail-box-title">Pressure</div>
            <div className="cw-detail-box-value">
              {currentWeather.pressure}
              <span className="unit">hPa</span>
            </div>
          </div>
          <div className="cw-sunrise cw-detail-box">
            <div className="cw-detail-box-title">Sunrise</div>
            <div className="cw-detail-box-value">{currentWeather.sunrise}</div>
          </div>
          <div className="cw-sunset cw-detail-box">
            <div className="cw-detail-box-title">Sunset</div>
            <div className="cw-detail-box-value">{currentWeather.sunset}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="cw-display" style={{ display: currentDisplay }}></div>
    );
  }
};

export default CurrentWeatherDisplay;
