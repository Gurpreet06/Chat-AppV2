window.addEventListener('load', () => { checkFileSize() })

/**
 * Check if the form is valid
 * if it is valid: activates the button
 * if it isn't valid: disables the button
 */
async function checkForm() {
    let refFormName = document.getElementById('formName')
    let refFormLast = document.getElementById('formLast')
    let refFormMail = document.getElementById('formMail')
    let refFormPass = document.getElementById('formPass')
    let refConPass = document.getElementById('ConPass')
    let refFormButton = document.getElementById('formButton')

    let validName = refFormName.checkValidity()
    let validLast = refFormLast.checkValidity()
    let validMail = refFormMail.checkValidity()
    let validPass = refFormPass.checkValidity()
    let validConPass = refConPass.checkValidity()

    if (refFormName.value == '') validName = false
    if (refFormLast.value == '') validName = false
    if (refFormMail.value == '') validMail = false
    if (refFormPass.value == '') validPass = false
    if (refConPass.value == '') validConPass = false
    if (refConPass.value != refFormPass.value) validConPass = false

    if (validName && validLast && validMail && validPass && validConPass) {
        refFormButton.removeAttribute('disabled')

        console.log('ok')
    } else {
        refFormButton.setAttribute('disabled', 'true')
    }
}

// Function to check if both password inputs are same or not.
function conPass() {
    let refFormPass = document.getElementById('formPass')
    let refConPass = document.getElementById('ConPass')
    let refSpan = document.getElementById('confirmPass') // Span error

    if (refConPass.value != refFormPass.value) {
        refSpan.style.display = 'block'
    } else {
        refSpan.style.display = 'none'
    }
}


function checkFileSize() {
    let refFormImage = document.getElementById('photoForm')

    refFormImage.onchange = function () {
        if (this.files[0].size > 2097152) {
            alert("File is too big!");
            this.value = "";
        }
    };
}


/**
 * Sends the data to the server
 * with a query of type 'contact'
 */
async function querySignUp(evt) {
    let refFormName = document.getElementById('formName')
    let refFormLast = document.getElementById('formLast')
    let refFormMail = document.getElementById('formMail')
    let refFormPass = document.getElementById('formPass')
    let refConPass = document.getElementById('ConPass')
    let refFormImage = document.getElementById('photoForm')
    let fotobtn = document.getElementById('fotobtn')

    evt.preventDefault(); // Stop page to reload onclick in sumbit button
    let obj = {}

    let a = refFormImage.value.lastIndexOf('\\')
    let fotoValue = refFormImage.value.substring(a + 1)

    if (refFormImage.value == '') {
        obj = {
            type: 'SaveUserData',
            nom: refFormName.value,
            cognom: refFormLast.value,
            mail: refFormMail.value,
            contrasenya: refFormPass.value,
            image: '/images/usrProfilePhoto/userDefault.png',
            id: getRandomId()
        }
    } else {
        obj = {
            type: 'SaveUserData',
            nom: refFormName.value,
            cognom: refFormLast.value,
            mail: refFormMail.value,
            contrasenya: refFormPass.value,
            image: 'images/usrProfilePhoto/' + fotoValue,
            id: getRandomId()
        }
    }

    await hideElement('formButton')
    await showElement('boxSpinner')
    try {
        serverData = await queryServer('/query', obj)
    } catch (err) {
        console.error(err)
    }

    await wait(1000)
    if (refFormImage.value != '') {
        fotobtn.click()
    }

    await hideElement('boxSpinner')

    if (serverData.status == 'ok') {
        console.log('ok')
        refFormName.value = ''
        refFormLast.value = ''
        refFormMail.value = ''
        refFormPass.value = ''
        refConPass.value = ''
        refConPass.value = ''
        refFormImage.value = ''
        checkForm()
        await showElement('boxOk')
        await wait(2000)
        await hideElement('boxOk')
    } else {
        console.log(serverData)
        await showElement('boxError')
        await wait(3000)
        await hideElement('boxError')
    }
    await showElement('formButton')
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

console.log(getRandomId() + randomAlphaId(9))

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