async function checkForm() {
    let refFormMail = document.getElementById('formMail')
    let refFormPwd = document.getElementById('formPassword')
    let refFormButton = document.getElementById('formButton')

    let validMail = refFormMail.checkValidity()
    let validPwd = refFormPwd.checkValidity()


    if (refFormMail.value == '') validMail = false
    if (refFormPwd.value == '') validPwd = false

    if (validMail && validPwd) {
        refFormButton.removeAttribute('disabled')
    } else {
        refFormButton.setAttribute('disabled', 'true')
    }
}

async function queryLogIn() {
    await hideElement('formButton')
    await showElement('boxSpinner')
    await wait(3000)
    await hideElement('boxSpinner')
    await showElement('boxError')
    await wait(2000)
    await hideElement('boxError')
    await showElement('formButton')
}

async function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
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