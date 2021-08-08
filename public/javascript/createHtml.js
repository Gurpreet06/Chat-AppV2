async function sendMessages(evt) {
    evt.preventDefault(); // Stop page to reload onclick in sumbit button
    let chatMessage = document.getElementById('chat_message')
    let chatUsrId = document.getElementById('')
    let chatUsrName = document.getElementById('')

    let obj = {
        type: 'sendMessages',
        msgId: getRandomId() + randomAlphaId(6),
        currentUserId: getCookie('usrId'),
        currentUserName: getCookie('usrName'),
        chatUserId: chatUsrId.innerHTML,
        chatUserName: chatUsrName.innerHTML,
        message: chatMessage.value
    }

    try {
        serverData = await queryServer('/query', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        console.log(serverData.result)
    } else {
        console.log(serverData)
    }

}


async function getUserChats() {

    let obj = {
        type: 'getUserChats',
        chatUserId: nextUserId.innerhtml,
        currentUserId: getCookie('usrId'),
    }

    try {
        serverData = await queryServer('/query', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        console.log(serverData.result)
    } else {
        console.log(serverData)
    }
}




/**
 * Hides an element
 * @param {id} id of the element to hide
 */
async function hideElement(id) {
    document.getElementById(id).style.display = 'none'
}

/**
 * Shows an element
 * @param {id} id of the element to show
 */
async function showElement(id) {
    document.getElementById(id).style.display = 'block'
}

/**
 * Queries the server with a 'POST' query
 * @param {url} server URL
 * @param {obj} data to send to the server
 */
async function queryServer(url, obj) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest()
        req.onreadystatechange = (res) => {
            let responseObj = null
            if (req.readyState === 4) {
                try {
                    responseObj = JSON.parse(req.responseText)
                } catch (e) {
                    console.log(e, req.responseText)
                    return reject('Parsing response to JSON')
                }
                if (req.status >= 200 && req.status < 300) {
                    return resolve(responseObj)
                } else if (req.status >= 400) {
                    return reject('Unauthorized')
                } else {
                    return reject(responseObj)
                }
            }
        }
        req.open('POST', url, true)
        req.send(JSON.stringify(obj))
    })
}

/**
 * Wait a while
 * @param {utimerl} time to wait in milliseconds (1000 = 1s)
 */
async function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}

function getRandomId() {
    let multiplier = 100000
    let a = parseInt(Math.floor(Math.random() * multiplier) + 1)
    return a
}

function randomAlphaId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}