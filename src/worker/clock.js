onmessage = function(event) {
    let type = event.data["type"]
    let count = event.data["duration"]

    if (type === "timer") {
        setInterval(() => {
            count--;
            if (count <= 0) {
                postMessage(0); 
            } else {
                postMessage(count); 
            }
        }, 981);
    } else {
        setInterval(() => {
            count++;
            postMessage(count); 
        }, 981);
    }
}