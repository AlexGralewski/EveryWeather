function timestampToTime(timestamp) {
  let dateObject = new Date(timestamp * 1000)
  let hours = dateObject.getHours()
  let minutes = dateObject.getMinutes()
  return (
    hours + ":" + minutes
  )
}

export default timestampToTime