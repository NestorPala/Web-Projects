const START_LETTER = 'A'
const STOP_LETTER = 'Z'
const TIME_MIN = 0.5
const TIME_MAX = 5
const DEFAULT_LETTER_COLOR = "white"
const CORRECT_LETTER = "green"
const WRONG_LETTER = "red"
let changeLetterTimeInMiliseconds = 2000
let changeLetterInterval
let timeGapInput = document.getElementById('time-gap')
let startButton = document.getElementById('button-start')
let stopButton = document.getElementById('button-stop')
let randomLetter = document.getElementById('random-letter')


const setTimeBetweenLetters = () => {
    let timeInSeconds = timeGapInput.value

    if (timeInSeconds < TIME_MIN || timeInSeconds > TIME_MAX) {
        alert(`Time must be between ${TIME_MIN} and ${TIME_MAX} seconds!`)
        if (timeGapInput.value > TIME_MAX) {
            timeGapInput.value = TIME_MAX
        } else {
            timeGapInput.value = TIME_MIN
        }
        return false
    }

    changeLetterTimeInMiliseconds = timeInSeconds * 1000
    
    return true
}


// "ABC".charCodeAt(0) // returns 65
const getASCIICodeFromLetter = letter => letter.charCodeAt(0)


// String.fromCharCode(65,66,67); // returns 'ABC'
const getLetterFromASCIICode = asciiCode => String.fromCharCode(asciiCode)


const printLetter = letter => {
    randomLetter.innerHTML = letter
    randomLetter.style.color = DEFAULT_LETTER_COLOR
}


const getLetter = async randomNumberURL => {
    let letter

    await fetch(randomNumberURL)
    .then(response => response.json())
    .then(number => getLetterFromASCIICode(number))
    .then(convertedNumber => {letter = convertedNumber})

    return letter
}


// Doesn't include "Ñ"
const changeLetter = async (startLetter, stopLetter) => {
    startLetter = getASCIICodeFromLetter(startLetter)
    stopLetter = getASCIICodeFromLetter(stopLetter)

    let randomNumberURL = "http://www.randomnumberapi.com/api/v1.0/random"
    randomNumberURL += "?min=" + startLetter
    randomNumberURL += "&max=" + stopLetter
    randomNumberURL += "&count=1"

    let newLetter = await getLetter(randomNumberURL)

    printLetter(newLetter)
}


const matchKey = (key) => {
    let keyMatchesRandomLetter = key.toLowerCase() == randomLetter.innerHTML.toLowerCase()
    randomLetter.style.color = keyMatchesRandomLetter ? CORRECT_LETTER : WRONG_LETTER
}


const registerKey = (event) => {
    console.log(`The key pressed is: ${event.key}`) //remove later xd
    matchKey(event.key)
}


const stopTyping = () => {
    clearInterval(changeLetterInterval)
    window.removeEventListener('keydown', registerKey)
}


const startTyping = (startLetter, stopLetter) => {
    changeLetterInterval = setInterval(changeLetter, changeLetterTimeInMiliseconds, startLetter, stopLetter)
    window.addEventListener('keydown', registerKey)
}


function stop() {
    stopTyping()
    timeGapInput.hidden = false
    startButton.hidden = false
    randomLetter.hidden = true
    stopButton.hidden = true
    alert("You have stopped typing")
    scrollTo({top: 0, left: 0, behavior: 'smooth'});
}


function start() {
    if (!setTimeBetweenLetters()) return
    timeGapInput.hidden = true
    startButton.hidden = true
    randomLetter.hidden = false
    stopButton.hidden = false
    startTyping(START_LETTER, STOP_LETTER) 
    alert("You have started typing")
}