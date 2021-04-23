import React from "react"

const StartingScreen = props => (
  <div
  className={
    props.display ?
       "starting-screen active"
      : "starting-screen"
  }
  style={{ visibility: props.display ? "visible" : "hidden" }}
>
  <h1>EveryWeather</h1>
</div>
)

export default StartingScreen