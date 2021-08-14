

let temp = ` <div class="drawerSide" id="drawerSide">
<!-- Drawer side -->
<div class="wrapper">
    <section class="form signup" style="height: 500px;overflow: auto;">
        <div>
            <header>Your Account Information</header>
        </div>
        <div class="usrAcc">
            <div>
                <p>Name: </p>
                <h5>{{name}}</h5>
            </div>
            <div>
                <p>LastName: </p>
                <h5>{{lastName}}</h5>
            </div>
            <div>
                <p>Email: </p>
                <h5>{{email}}</h5>
            </div>
            <div style='margin-top:25px;'>
                <p>Profile Photo: </p>
                <img src="{{image}}" width="50%" id='currentUserImg'>
            </div>
        </div>
    </section>
</div>
</div>`

let menu = `   <a href='/mainPage.html'> <div>
<h4 class="SocialApp">SocialApp</h4>
</div></a>
<div class="meetBtns">
    <ion-icon name="person-outline"  class="signBtn" style='cursor: pointer;' onclick="setDrawer('UsrInfo', true)"></ion-icon>
    <ion-icon name="log-in-outline" style='font-size: 28px;cursor: pointer;' onclick='logOut()'></ion-icon>
</div>`
let MenuHome = document.getElementById('MenuHome')
MenuHome.innerHTML = menu

async function loadData() {
    let usrData = document.getElementById('UsrInfo')
    let html = ''
    let item = ''
    let serverData = {}


    let obj = {
        type: 'getUsrData',
        usrid: getCookie('id'),
        usrmail: getCookie('identiy')
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }

    //Datos desde html
    let template = temp

    if (serverData.status == 'ok') {
        let rst = serverData.result
        for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
            item = rst[cnt]
            if (item.email === getCookie('identiy')) {
                html = html + template
                    .replaceAll('{{name}}', item.firstname)
                    .replaceAll('{{lastName}}', item.Lastname)
                    .replaceAll('{{image}}', item.photo)
                    .replaceAll('{{email}}', item.email)
                document.cookie = `usrId=${item.unique_id}`
                document.cookie = `usrName=${item.firstname + ' ' + item.Lastname}`

                if (item.unique_id === getCookie('usrId') && item.firstname + ' ' + item.Lastname === getCookie('usrName')) {
                    //Asignar datos
                    usrData.innerHTML = html
                }
            }
        }
    } else {
        console.log(serverData)
    }
}

async function sendBack() {
    let obj = {
        type: 'getUsrData',
        usrid: getCookie('id'),
        usrmail: getCookie('identiy')
    }

    try {
        serverData = await queryServer('/queryusr', obj)
    } catch (err) {
        console.error(err)
    }


    if (serverData.status == 'ok') {
        let rst = serverData.result
        for (let cnt = 0; cnt < rst.length; cnt = cnt + 1) {
            item = rst[cnt]
            if (item.unique_id !== getCookie('usrId') && item.firstname + ' ' + item.Lastname !== getCookie('usrName') || getCookie('usrName') === null && getCookie('usrId') === null) {
                location.href = './index.html'
                console.log('ssds')
            }
        }
    } else {
        console.log(serverData)
    }
}

async function logOut() {
    eraseCookie('identiy', 'usrId', 'id', 'usrName')
    location.reload()
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

window.addEventListener('load', () => { loadData() })