let thisURL = document.URL
let thisIndex = thisURL.lastIndexOf('userId=')
let thisPosId = thisURL.substring(thisIndex + 7)
var today = new Date();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var n = month[today.getMonth()];
var date = today.getDate();


let seachrBarTemp = ` <div class="searchInfo">
    <div class='searchRst'>
         <img src='{{img}}' width="11%">
        <h5 class="usrName" onclick='chatWithUser(this.nextElementSibling.innerHTML, this.innerHTML)'>{{name}}</h5>
        <p style='display:none;'>{{caseId}}</p>
    </div>
    <div>
        <button class='sendMsgUsr' onclick='chatWithUser(this.nextElementSibling.innerHTML, this.nextElementSibling.nextElementSibling.innerHTML)'>Send Message</button>
        <p style='display:none;'>{{caseId}}</p>
        <p style='display:none;'>{{name}}</p>
    </div>
</div>`

async function searchUsers(val) {
    let SearchUsersVal = document.getElementById('Searchwrapper')
    let schWra = document.getElementById('SearchUsersVal')
    let usrChatList = document.getElementById('usrChatList')
    let html = ''

    let obj = {
        type: 'searchUsers',
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    let template = seachrBarTemp

    if (serverData.status == 'ok') {
        let rst = serverData.result
        for (cnt = 0; cnt < rst.length; cnt = cnt + 1) {
            let item = rst[cnt]
            if (item.firstname.indexOf(val) !== -1 || item.Lastname.indexOf(val) !== -1) {
                html = html + template
                    .replaceAll(/{{name}}/g, item.firstname + ' ' + item.Lastname)
                    .replaceAll(/{{img}}/g, item.photo)
                    .replaceAll(/{{caseId}}/g, item.unique_id)
            } else if (item.firstname.indexOf(val) === -1) {
                SearchUsersVal.innerHTML = `<p class='noFileType'>No User Found</p>`
            }
        }

        Searchwrapper.style.display = 'block'
        usrChatList.style.display = 'none'
        Searchwrapper.innerHTML = html
        if (val === '' || schWra.value === '') {
            Searchwrapper.style.display = 'none'
            usrChatList.style.display = 'block'
        }
    } else {
        console.log(serverData)
    }
}

async function chatWithUser(userID, userName) {
    var x = document.URL
    var url = window.location.toString();
    window.location = url.replace(x, `?userName=${userName}&userId=${userID}`)
}


let nousrSlec = `
<div class="messages">
<img src="./images/WebTool/bubble-green.da39d35.svg">
<strong>Select a Conversation</strong>
<p>Try selecting a conversation or searching for someone specific.</p>
</div>
`

let chatHtml = `        <div class="usrChat">
<div class="usrDetail">
    <h5 style='font-size: 28px;' id='charUsrName'>{{UsrName}}</h5>
</div>
<div>
    <ion-icon name="list-outline"></ion-icon>
</div>
</div>
<div class="usrMsad">
<div class="usrMsad1">
    <div class="main__right">
        <div class="messagesUsr" id='meetMsgs'>
            <div class="showMsg" id='appendChat'> </div>
        </div>
    </div>
    <div>
        <div class="main__message_container">
            <input id="chat_message" type="text" autocomplete="off" placeholder="Type message here...">
            <div id="sendMsg" class="options__button">
                <ion-icon name="send-outline" style='margin:0; cursor:pointer;' onclick="sendMessages(event)"></ion-icon>
            </div>
        </div>
    </div>

</div>

<div class="clientDetails">
    <div>
        <h4>About</h4>
    </div>
    <div class="clientDetails1">
        <img width="80%" src="{{imgusr}}">
        <h5>{{UsrName}}</h5>
        <p>{{UserEmail}}</p>
    </div>
</div>
</div>`

async function createMsgHtml() {
    let userChatIndex = document.getElementById('userChatIndex')
    let html = ''

    let obj = {
        type: 'userChat',
        chatUserId: thisPosId
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    let temp = chatHtml
    if (serverData.status == 'ok') {
        if (serverData.result.length === 0) {
            userChatIndex.innerHTML = nousrSlec
        } else if (serverData.result[0].unique_id === thisPosId) {
            html = html + temp
                .replaceAll(/{{UsrName}}/g, serverData.result[0].firstname + ' ' + serverData.result[0].Lastname)
                .replaceAll(/{{UserEmail}}/g, serverData.result[0].email)
                .replaceAll(/{{imgusr}}/g, serverData.result[0].photo)

            userChatIndex.innerHTML = html
            getUserChats()
        }


    } else {
        console.log(serverData)
    }

}

async function sendMessages(evt) {
    evt.preventDefault(); // Stop page to reload onclick in sumbit button
    let chatMessage = document.getElementById('chat_message')
    let chatUsrName = document.getElementById('charUsrName')
    let currentUserImg = document.getElementById('currentUserImg')

    let obj = {
        type: 'sendMessages',
        msgId: getRandomId() + randomAlphaId(6),
        currentUserId: getCookie('usrId'),
        currentUserName: getCookie('usrName'),
        chatUserId: thisPosId,
        chatUserName: chatUsrName.innerHTML,
        message: chatMessage.value,
        time: date + ' ' + n,
        photo: currentUserImg.src
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        chatMessage.value = ''
        getUserChats()
    } else {
        console.log(serverData)
    }

}


async function getUserChats() {
    let appendChat = document.getElementById('appendChat')

    let obj = {
        type: 'getUserChats',
        chatUserId: thisPosId,
        currentUserId: getCookie('usrId'),
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        let rst = serverData.result
        for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
            let item = rst[cnt]
            appendChat.innerHTML += `  <div class="message">
            <b>
                <img width="5%" style='margin-right: 15px;' src="${item.Photo}">
                <h5 style='color: black;'>${item.incoming_user_name}</h5>
                <span class="usrInMsg"> <p>Time:  </p> ${item.Time} </span>
            </b>
            <span>${item.msg}</span>
        </div>`
        }
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

window.addEventListener('load', () => { searchUsers(), createMsgHtml() })