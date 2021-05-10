import React from "react"

const Alert = props => {
  return(
    <div className="alert" style={{display: props.display ? "flex" : "none"}}>
      <div className="alert-backdrop" onClick={props.closeAlert}/>
      <div className="alert-message">
        <h1>
        Search did not find any results, please try again.</h1>
      <button onClick={props.closeAlert}>OK</button>
        </div>
    </div>
  )
}

export default Alert