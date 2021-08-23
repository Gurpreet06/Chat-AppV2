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
            } else {
                Searchwrapper.innerHTML = `<p class='noUsrs'>No User Found</p>`
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

let noChats = `
<div class="messages">
<img src="./images/WebTool/bubble-green.da39d35.svg">
<strong style='margin-top: 20px;'>Be first to send a message</strong>
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
                        <ion-icon name="images-outline" class='ioicon' onclick="ClickBtn()"></ion-icon>
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
        <div>
            <p class='checkMedia' onclick='showMediaDiv()'>Click to see all media in this chat..</p>
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
            photo: currentUserImg.src,
            msgType: 'Message'
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
            photo: currentUserImg.src,
            msgType: 'Message'
        })
        chatMessage.value = ''
        getUserChats()
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
<img src='{{igMedia}}' width='100%' style='display: {{none}}'>
</div>
`

let rightUsrChat = `
<div class="message" style='width: 45%; margin-left: auto;' id='rightCUrrentUsr'>
<b style='display:none;'>
    <img width="5%" style='margin-right: 15px;' src="{{imgPhoto}}">
    <h5>{{UsrName}}</h5>
    <span class="usrInMsg"> <p>Time:  </p> {{igTime}} </span>
</b>
<div class='msgOptions'>
    <span>{{igMsg}} </span>
    <div class="dropdown">
        <div class="dropdown-content" style='left: 34px;'>
            <button class="downlaod" id='{{igId}}' value='{{igMedia}}' onclick='delChat(this.id, this.value)'>Delete Message</button>
            <form action="/downloadUpFile" method="GET" enctype="multipart/form-data" > 
                <div>
                    {{downloadBn}}
                </div>
            </form> 
        </div>
        <div>
         <ion-icon name="ellipsis-vertical-outline" class='showMsgOp'></ion-icon>
        </div>
    </div>
</div>
<img src='{{igMedia}}' width='100%' style='display: {{none}}; margin-top: 20px;'>
</div>
`

socket.on('chat:message', (data) => {
    let appendChat = document.getElementById('appendChat')
    let template = rightUsrChat
    let leftUsr = leftChatMsg
    let html = ''

    console.log(data)
    if (data.chatUserId === thisPosId && data.currentUserId === getCookie('usrId') || data.chatUserId === getCookie('usrId') && data.currentUserId === thisPosId) {
        if (data.currentUserId == getCookie('usrId')) {
            html = html + template
                .replaceAll('{{imgPhoto}}', data.photo)
                .replaceAll('{{UsrName}}', data.currentUserName)
                .replaceAll('{{igTime}}', data.time)
                .replaceAll('{{igMsg}}', data.message)
                .replaceAll('{{none}}', 'none')
                .replaceAll('{{igId}}', data.msgId)
        } else {
            html = html + leftUsr
                .replaceAll('{{imgPhoto}}', data.photo)
                .replaceAll('{{UsrName}}', data.currentUserName)
                .replaceAll('{{igTime}}', data.time)
                .replaceAll('{{igMsg}}', data.message)
                .replaceAll('{{none}}', 'none')
        }
        appendChat.innerHTML += html
        getUserChats()
    }

})

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
        if (rst.length !== 0) {
            for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
                let item = rst[cnt]
                if (item.msg_type === 'Message') {
                    if (item.incoming_msg_id == getCookie('usrId')) {
                        html = html + template
                            .replaceAll('{{imgPhoto}}', item.Photo)
                            .replaceAll('{{UsrName}}', item.incoming_user_name)
                            .replaceAll('{{igTime}}', item.Time)
                            .replaceAll('{{igMsg}}', item.msg)
                            .replaceAll('{{none}}', 'none')
                            .replaceAll('{{igId}}', item.msg_id)
                            .replaceAll('{{downloadBn}}', ``)
                    } else {
                        html = html + leftUsr
                            .replaceAll('{{imgPhoto}}', item.Photo)
                            .replaceAll('{{UsrName}}', item.incoming_user_name)
                            .replaceAll('{{igTime}}', item.Time)
                            .replaceAll('{{igMsg}}', item.msg)
                            .replaceAll('{{none}}', 'none')
                    }
                } else if (item.msg_type === 'Media') {
                    if (item.incoming_msg_id == getCookie('usrId')) {
                        html = html + template
                            .replaceAll('{{imgPhoto}}', item.Photo)
                            .replaceAll('{{UsrName}}', item.incoming_user_name)
                            .replaceAll('{{igTime}}', item.Time)
                            .replaceAll('{{igMsg}}', '')
                            .replaceAll('{{igMedia}}', item.msg)
                            .replaceAll('{{none}}', 'block')
                            .replaceAll('{{igId}}', item.msg_id)
                            .replaceAll('{{downloadBn}}', `<button class='downlaod' onclick='downloadMedia("${item.msg}")'>Download Image</button>`)
                    } else {
                        html = html + leftUsr
                            .replaceAll('{{imgPhoto}}', item.Photo)
                            .replaceAll('{{UsrName}}', item.incoming_user_name)
                            .replaceAll('{{igTime}}', item.Time)
                            .replaceAll('{{igMsg}}', '')
                            .replaceAll('{{igMedia}}', item.msg)
                            .replaceAll('{{none}}', 'block')
                    }
                }

                appendChat.innerHTML = html
            }
        } else {
            appendChat.innerHTML = noChats
        }

    } else {
        console.log(serverData)
    }
}

async function getConnectedUsers() {
    let usrChatList = document.getElementById('usrChatList')
    let getConnectUsr = document.getElementById('getConnectUsr')
    let serverData = {}

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

// Upload Images and Videos
async function ClickBtn() {
    let photoInpt = document.getElementById('photoInpt')
    photoInpt.click()
}

async function checkFile() {
    let inputFile = document.getElementById('photoInpt')
    let UpPgoo = document.getElementById('UpPgoo')
    let upSideDown = document.getElementById('upSideDown')

    if (inputFile.value != '') {
        let fileName = inputFile.value.lastIndexOf('\\')
        let fileLastName = inputFile.value.substring(fileName + 1)
        UpPgoo.innerHTML = `
          <div class="upldFiles">
            <h4 id='currentMedia'>${fileLastName}</h4>
          </div>
        `
    }

    upSideDown.style.display = 'block'
    await wait(500)
    upSideDown.style.transform = 'translate3d(0px, -500px, 0)'
}

async function closeImg() {
    let upSideDown = document.getElementById('upSideDown')

    upSideDown.style.transform = 'translate3d(0px, -1050px, 0)'
    await wait(500)
    upSideDown.style.display = 'none'
}


async function showMediaDiv() {
    getMediaDB()
    let transMedia = document.getElementById('transMedia')

    transMedia.style.display = 'block'
    await wait(500)
    transMedia.style.transform = 'translate3d(0px, -700px, 0)'
}

async function closeMediaDiv() {
    let transMedia = document.getElementById('transMedia')

    transMedia.style.transform = 'translate3d(0px, -2050px, 0)'
    await wait(500)
    transMedia.style.display = 'none'
}

let mediaTemp = ` <div>
<img src="{{imgMedia}}" class="mediaImg">
<h5>{{UsrName}}</h5>
</div>`

async function getMediaDB() {
    let imgExt = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG']
    let getAllMedia = document.getElementById('getAllMedia')
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

    let template = mediaTemp

    if (serverData.status == 'ok') {
        let rst = serverData.result
        if (rst.length !== 0) {
            for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
                let item = rst[cnt]
                let getMediaExt = item.msg
                let MediaIndex = getMediaExt.lastIndexOf('.')
                let numMediaIndex = getMediaExt.substring(MediaIndex)
                for (let cnt = 0; cnt < imgExt.length; cnt = cnt + 1) {
                    let ext = imgExt[cnt]
                    if (numMediaIndex === ext) {
                        html = html + template
                            .replaceAll('{{UsrName}}', item.incoming_user_name)
                            .replaceAll('{{imgMedia}}', item.msg)
                        getAllMedia.innerHTML = html
                    } else {
                        let noMsg = `<p>No media has been shared yet!</p>`
                    }
                }
                getAllMedia.innerHTML = html

            }
        } else {
            getAllMedia.innerHTML = `<p>No media has been shared yet!</p>`
        }

    } else {
        console.log(serverData)
    }
}

async function querySendFile() {
    await hideElement('uploadBtn')
    await showElement('boxSpinner')

    let currentMedia = document.getElementById('currentMedia')
    let chatUsrName = document.getElementById('charUsrName')
    let currentUserImg = document.getElementById('currentUserImg')
    let ranApla = getRandomId() + randomAlphaId(6)
    let serverData = {}

    let obj = {
        type: 'sendMedias',
        msgId: ranApla,
        currentUserId: getCookie('usrId'),
        currentUserName: getCookie('usrName'),
        chatUserId: thisPosId,
        chatUserName: chatUsrName.innerHTML,
        message: 'images/Medias/' + currentMedia.innerHTML,
        time: date + ' ' + n,
        photo: currentUserImg.src,
        msgType: 'Media',
        currentUR: thisURL
    }

    try {
        serverData = queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    socket.emit('chat:media', {
        currentUserId: getCookie('usrId'),
        chatUserId: thisPosId,
        messageTypo: 'Media'
    })

    if (serverData.status === 'ok') {
        socket.emit('chat:media', {
            currentUserId: getCookie('usrId'),
            chatUserId: thisPosId,
            messageTypo: 'Media'
        })
    }
}
socket.on('chat:media', async (data) => {
    if (data.chatUserId === thisPosId && data.currentUserId === getCookie('usrId') || data.chatUserId === getCookie('usrId') && data.currentUserId === thisPosId) {
        getUserChats()
        await wait(1000)
        getUserChats()
        await wait(1000)
        getUserChats()
    }
})

// Delete Messages
async function delChat(fileId, fileName) {
    let obj = {
        type: 'DelMessages',
        msgId: fileId,
        msgName: fileName
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status == 'ok') {
        getUserChats()
        socket.emit('chat:delete', {
            currentUserId: getCookie('usrId'),
            chatUserId: thisPosId,
        })
    } else {
        console.log(serverData)
    }
}

socket.on('chat:delete', async (data) => {
    if (data.chatUserId === thisPosId && data.currentUserId === getCookie('usrId') || data.chatUserId === getCookie('usrId') && data.currentUserId === thisPosId) {
        getUserChats()
    }
})

// Download Media
async function downloadMedia(fileName) {
    let serverData = {}

    let obj = {
        type: 'DownMedia',
        ImgName: fileName,
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    if (serverData.status === 'ok') {
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

function eraseCookie(name, nsename, id, usrName) {
    document.cookie = name + '=; Max-Age=-99999999;';
    document.cookie = nsename + '=; Max-Age=-99999999;';
    document.cookie = id + '=; Max-Age=-99999999;';
    document.cookie = usrName + '=; Max-Age=-99999999;';
}

let upldMedia = `
<form action="/mainPage.html" method="POST" enctype="multipart/form-data" autocomplete="off">
<div class="wrapper" id="upSideDown">
    <ion-icon name="close-outline" class='closeImg' onclick='closeImg()'></ion-icon>
    <div id="FilEnAME">
        <div>File Name: </div>
        <div id="UpPgoo"> </div>
    </div>
    <div class="uplodDiv">
        <div class="field image">
            <input type="file" class="file" name="sampleFile" style="display: none;" accept="image/png, image/gif, image/jpeg" id="photoInpt" required
                onchange="checkFile()">
        </div>
    </div>
    <div class="field button" id="boxButton">
        <input type="submit" id="uploadBtn" onclick='querySendFile()' name="submit" value="Upload Now">
    </div>
    <div id="boxSpinner" class="defDiv elmBoxSpinner">
        <!-- Div - boxSpinner -->
        <div class="defDivFlex elm71">
            <!-- Flex -->
            <div class="defDivFlexChild">
                <!-- Flex child -->
                <div class="defDiv elm73">
                    <!-- Div -->
                    <div class="waitSpinner">
                        <!-- Wait spinner -->
                        <svg viewBox="0 0 50 50">
                            <!-- Spinner main -->
                            <circle cx="25" cy="25" r="20" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="boxOk" class="defDiv elmBoxOk" style="display: none;">
        <!-- Div - boxOk -->
        <div class="defDivFlex elm78">
            <!-- Flex -->
            <div class="defDivFlexChild">
                <!-- Flex child -->
                <div class="defText elm80">
                    <!-- Text -->
                    Data sent properly
                </div>
            </div>
        </div>
    </div>
    <div id="boxError" class="defDiv elmBoxError">
        <!-- Div - boxError -->
        <div class="defDivFlex elm82">
            <!-- Flex -->
            <div class="defDivFlexChild">
                <!-- Flex child -->
                <div class="defText elm84">
                    <!-- Text -->
                    Incorrect Email or Password!
                </div>
            </div>
        </div>
    </div>
</div>
</form>
`

let uploadMedias = document.getElementById('uploadMedias')
uploadMedias.innerHTML = upldMedia

let getMd = `
    <div class="wrapper" id="transMedia">
        <ion-icon name="close-outline" class='closeImg' onclick='closeMediaDiv()'></ion-icon>
        <div id="getAllMedia"> </div>
    </div>
`

let getMedias = document.getElementById('getMedias')
getMedias.innerHTML = getMd


window.addEventListener('load', () => { searchUsers(), createMsgHtml(), getConnectedUsers() })