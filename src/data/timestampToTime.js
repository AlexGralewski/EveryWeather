function timestampToTime(timestamp) {
  let dateObject = new Date(timestamp * 1000)
  let hours = dateObject.getHours()
  let minutes = dateObject.getMinutes()
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  return (
    hours + ":" + minutes
  )
}

export default timestampToTime