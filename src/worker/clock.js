onmessage = function(event) {
    // either timer or stopwatch
    let type = event.data["type"]
    // count is in seconds, offset already accounted for.
    let begin = event.data["beginning"].getTime()
    // converts duration to milliseconds
    let ending = begin + (event.data["duration"] * 1000)

    if (type === "timer") {
        setInterval(() => {
            // offsetting one second because of the missing one.
            let count = Math.floor((ending - (new Date().getTime() - 1000)) / 1000)
            if (count <= 0) {
                postMessage(0); 
            } else {
                postMessage(count); 
            }
        }, 1000);
    } else {
        setInterval(() => {
            let count = Math.floor((new Date().getTime() - begin) / 1000)
            postMessage(count); 
        }, 1000);
    }
}