async function setDrawer(id, show, event) {
    let refBody = document.getElementsByTagName('body')[0]
    let refDrawer = document.getElementById(id)

    if (typeof event == 'undefined' || (event.target && event.target.getAttribute('id') == id)) {
        if (show) {
            refBody.style.overflow = 'hidden'
            refDrawer.style.display = 'flex'
            await promiseWaitUntilPropertyValue(refDrawer, 'display', 'flex')
            refDrawer.style.opacity = '1'
            refDrawer.querySelector('.drawerSide').style.transform = 'translate3d(0px, 0, 0)'
        } else {
            refDrawer.style.opacity = '0'
            refDrawer.querySelector('.drawerSide').style.transform = 'translate3d(-250px, 0, 0)'
            await promiseWait(300)
            refBody.style.overflow = 'initial'
            refDrawer.style.display = 'none'
        }
    }
}


async function promiseWait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}
async function promiseWaitUntilPropertyValue(ref, property, value) {
    let style = window.getComputedStyle(ref)
    let now = style.getPropertyValue(property)
    if (now != value) {
        await promiseWait(1)
        await promiseWaitUntilPropertyValue(ref, property, value)
    }
}