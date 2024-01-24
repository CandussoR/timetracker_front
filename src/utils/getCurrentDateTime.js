export default getCurrentDateTime

function getCurrentDateTime() {
    let dt = null
    // This date has an offSet
    const d = new Date()
    // Countering the offset by substracting it's time in milliseconds
    const offset = d.getTimezoneOffset()
    if (offset < 0) {
        dt = new Date(d.getTime() - (offset * 60 * 1000)); 
    } else {
        dt = new Date(d.getTime() + (offset * 60 * 1000)); 
    }

    dt = dt.toJSON()
    const roundedSecond = Math.floor(parseFloat(dt.slice(17,23)))
    const currentDate = dt.slice(0,10)
    const currentTime = dt.slice(11,17) + String(roundedSecond).padStart(2, '0')

    return { currentDate, currentTime }
}