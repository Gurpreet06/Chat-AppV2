const socket = io();
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
    let closeSearchBar = document.getElementById('closeSearchBar')
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
            }
            if (item.firstname.indexOf(val) === -1) {
                SearchUsersVal.innerHTML = `<p>No User Found</p>`
            }
        }

        Searchwrapper.style.display = 'block'
        usrChatList.style.display = 'none'
        if (val !== '' && schWra.value !== '') {
            closeSearchBar.style.display = 'block'
        }
        closeSearchBar.addEventListener('click', () => {
            schWra.value = ''
            Searchwrapper.style.display = 'none'
            usrChatList.style.display = 'block'
            closeSearchBar.style.display = 'none'
        })
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
    <ion-icon name="list-outline" class='ChatOp'></ion-icon>
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
            <textarea id="chat_message" type="text" autocomplete="off" cols="30" rows="10" placeholder="Type message here..."></textarea>
            <div id="sendMsg" class="options__button">
                <div class="dropdown">
                    <div class="dropdown-content">
                        <button class="downlaod" id='' onclick='addEmojiToDiv()'>Emoji</button>
                        <ion-icon name="images-outline" class='ioicon'></ion-icon>
                    </div>
                    <div>
                    <ion-icon name="add-outline" class='showOps'></ion-icon>
                    </div>
                </div>
                <ion-icon name="arrow-up-outline" class='sendChatMsg' onclick="sendMessages(event)"></ion-icon>
            </div>
        </div>
        
        <div id='closeEmojis'>
                <ion-icon name="close-outline" class='closeEmoji' onclick='CloseEmojis()'></ion-icon>
                <div class="Emojis" id="AddEmojis"> </div>
        </div>
    </div>

</div>

<div class="clientDetails">
    <div>
        <div>
            <h4>About</h4>
        </div>
        <div class="clientDetails1">
            <img width="80%" src="{{imgusr}}" style='margin-top: 20px;'>
            <h5>{{UsrName}}</h5>
            <p>{{UserEmail}}</p>
        </div>
    </div>
    <div>
        <div>
            <h4>Media</h4>
        </div>
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

            // Auto expand TextArea
            let AutoTextarea = document.querySelector('#chat_message');
            AutoTextarea.addEventListener('keydown', autosize);
            function autosize() {
                let el = this;
                setTimeout(function () {
                    el.style.cssText = ' padding:0';
                    el.style.cssText = 'height:' + el.scrollHeight + 'px';
                }, 0);
            }
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
    let ranApla = getRandomId() + randomAlphaId(6)
    let obj = {}

    if (chatMessage.value !== '') {
        obj = {
            type: 'sendMessages',
            msgId: ranApla,
            currentUserId: getCookie('usrId'),
            currentUserName: getCookie('usrName'),
            chatUserId: thisPosId,
            chatUserName: chatUsrName.innerHTML,
            message: chatMessage.value,
            time: date + ' ' + n,
            photo: currentUserImg.src
        }
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        socket.emit('chat:message', {
            msgId: ranApla,
            currentUserId: getCookie('usrId'),
            currentUserName: getCookie('usrName'),
            chatUserId: thisPosId,
            chatUserName: chatUsrName.innerHTML,
            message: chatMessage.value,
            time: date + ' ' + n,
            photo: currentUserImg.src
        })
        chatMessage.value = ''
    } else {
        console.log(serverData)
    }

}

let leftChatMsg = `
<div class="message" style='width: 45%;'>
<b>
    <img width="5%" style='margin-right: 15px;' src="{{imgPhoto}}">
    <h5 style='color: black;'>{{UsrName}}</h5>
    <span class="usrInMsg" style='display:none'> <p>Time:  </p> {{igTime}} </span>
</b>
<span>{{igMsg}}</span>
</div>
`

let rightUsrChat = `
<div class="message" style='width: 45%; margin-left: auto;' id='rightCUrrentUsr'>
<b style='display:none;'>
    <img width="5%" style='margin-right: 15px;' src="{{imgPhoto}}">
    <h5>{{UsrName}}</h5>
    <span class="usrInMsg"> <p>Time:  </p> {{igTime}} </span>
</b>
<span>{{igMsg}}</span>
</div>
`

async function getUserChats() {
    let appendChat = document.getElementById('appendChat')
    let html = ''

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
    let template = rightUsrChat
    let leftUsr = leftChatMsg

    if (serverData.status == 'ok') {
        let rst = serverData.result
        for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
            let item = rst[cnt]
            if (item.incoming_msg_id == getCookie('usrId')) {
                html = html + template
                    .replaceAll('{{imgPhoto}}', item.Photo)
                    .replaceAll('{{UsrName}}', item.incoming_user_name)
                    .replaceAll('{{igTime}}', item.Time)
                    .replaceAll('{{igMsg}}', item.msg)
            } else {
                html = html + leftUsr
                    .replaceAll('{{imgPhoto}}', item.Photo)
                    .replaceAll('{{UsrName}}', item.incoming_user_name)
                    .replaceAll('{{igTime}}', item.Time)
                    .replaceAll('{{igMsg}}', item.msg)
            }
            appendChat.innerHTML = html
        }
    } else {
        console.log(serverData)
    }
}

async function getConnectedUsers() {
    let usrChatList = document.getElementById('usrChatList')
    let getConnectUsr = document.getElementById('getConnectUsr')

    let obj = {
        type: 'getConnectedUsers',
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
            getConnectUsr.innerHTML += `  <div class="PersonsGrp">
                                        <img width="15%" src="${item.photo}">
                                        <h5 id='CurrentUser${item.unique_id}' onclick='chatWithUser(this.nextElementSibling.innerHTML,this.innerHTML)'>${item.firstname + ' ' + item.Lastname}</h5>
                                        <p style='display:none;'>${item.unique_id}</p>
                                     </div>`
            if (item.unique_id === getCookie('usrId')) {
                let usr = document.querySelector('#CurrentUser' + item.unique_id)
                usr.innerHTML = `${item.firstname + ' ' + item.Lastname} (Me)`
            }
        }
    } else {
        console.log(serverData)
    }
}


// Create Emojis For Users
function addEmojiToDiv() {
    let userEmojis = ["✌", "😂", "😝", "😁", "😱", "👉", "🙌", "🍻", "🔥", "🌈", "☀", "🎈", "🌹", "💄", "🎀", "⚽", "🎾", "🏁", "😡", "👿", "🐻", "🐶", "🐬", "🐟", "🍀", "👀", "🚗", "🍎", "💝", "💙", "👌", "❤", "😍", "😉", "😓", "😳", "💪", "💩", "🍸", "🔑", "💖", "🌟", "🎉", "🌺", "🎶", "👠", "🏈", "⚾", "🏆", "👽", "💀", "🐵", "🐮", "🐩", "🐎", "💣", "👃", "👂", "🍓", "💘", "💜", "👊", "💋", "😘", "😜", "😵", "🙏", "👋", "🚽", "💃", "💎", "🚀", "🌙", "🎁", "⛄", "🌊", "⛵", "🏀", "🎱", "💰", "👶", "👸", "🐰", "🐷", "🐍", "🐫", "🔫", "👄", "🚲", "🍉", "💛", "💚"]

    let AddEmojis = document.getElementById('AddEmojis')
    let closeEmojis = document.getElementById('closeEmojis')
    closeEmojis.style.display = 'block'
    for (let cnt = 0; cnt < userEmojis.length; cnt = cnt + 1) {
        let EmoJis = userEmojis[cnt]
        AddEmojis.innerHTML += `<span onclick='addEmojiToVal(this.innerHTML)'>${EmoJis}</span>`
    }
}

function addEmojiToVal(EmojiVal) {
    let sendChatMsg = document.getElementById('chat_message')
    sendChatMsg.value += EmojiVal
}

function CloseEmojis() {
    let closeEmojis = document.getElementById('closeEmojis')
    closeEmojis.style.display = 'none'
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

window.addEventListener('load', () => { searchUsers(), createMsgHtml(), getConnectedUsers() })