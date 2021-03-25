import startingImageWinter from "../assets/starting-bg-winter.jpg"
import startingImageSpring from "../assets/starting-bg-spring.jpg"
import startingImageSummer from "../assets/starting-bg-summer.jpg"
import startingImageFall from "../assets/starting-bg-fall.jpg"


function startingBackgroundImage() {
  const today = new Date()
  const cMonth = today.getMonth()
  if (cMonth < 2 || cMonth === 11) {
    return (startingImageWinter)
  } else if (cMonth < 5) {
    return (startingImageSpring)
  } else if (cMonth < 8) {
    return (startingImageSummer)
  } else {
    return (startingImageFall)
  }
}

export default startingBackgroundImage