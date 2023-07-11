onmessage = function (message) {
    if (message.data[0] != null) { //daca lista de produse e diferita de null
        postMessage(["pass", message.data[0]]);
    }
};