import startingImageWinter from "../images/starting-bg-winter.jpg"
import startingImageSpring from "../images/starting-bg-spring.jpg"
import startingImageSummer from "../images/starting-bg-summer.jpg"
import startingImageFall from "../images/starting-bg-fall.jpg"


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