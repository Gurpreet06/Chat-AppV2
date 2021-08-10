let express = require('express')
const md5 = require('md5')
const fs = require('fs')
const upload = require('express-fileupload')
const mysql = require('mysql2')
const SocketIO = require('socket.io')

let app = express()
let portHTTP = 8000
let refHTTP = null

let publicFolder = './public'

// connect to mysql dataBase
const Connection = mysql.createConnection({
    host: '',
    user: 'root',
    password: '',
    database: 'chatapp',
    port: 3307
})

// Check if  connection  was succeeded
Connection.connect((err) => {
    if (err) throw err
    console.log('Connection Succeeded.')
})

async function main() {

    app.post('/query', async (request, response) => { await answerQuery(request, response) })
    app.post('/queryusr', async (request, response) => { await answerUsrdata(request, response) })

    app.use(express.static(publicFolder))

    refHTTP = app.listen(portHTTP, () => { console.log(`\nNavigate to: http://localhost:${portHTTP} \n`) })

    const io = SocketIO(refHTTP)

    // Web Sockets
    io.on('connection', (socket) => {
        socket.on('chat:message', (data) => {
            io.sockets.emit('chat:message', data)
        })
    })
}


async function answerQuery(request, response) {
    let data = await getPostData(request)
    let rst = {}

    // Saving user registration data
    if (data.type == 'SaveUserData') {
        rst = { status: 'ok' }
        let dataPs = md5(data.contrasenya)
        let encDt = md5(dataPs)
        let FinalDt = md5(encDt)
        let insrtData = `INSERT INTO users(unique_id, firstname, Lastname, email, password, photo) values('${data.id}', '${data.nom}', '${data.cognom}', '${data.mail}',  '${FinalDt}', '${data.image}')`
        Connection.query(insrtData, (err, rows) => {
            if (err) throw err
        })
    }

    else {
        rst = { status: 'Ko' }
    }

    response.json(rst)
}

// Authentication section
app.use(express.urlencoded());
app.use(express.json());
app.post('/login.html', (req, res) => {
    let username = req.body.user;
    let usrpass = md5(req.body.emaile);
    usrpass = md5(usrpass)
    usrpass = md5(usrpass)

    Connection.query(`SELECT * FROM users WHERE email = '${username}' AND password = '${usrpass}'`, async (error, results, fields) => {
        if (results.length == 0) {
            wait(1000)
            console.log('Incorrect Username or Password!')
            rst = { status: 'ko' }
        } else {
            res.setHeader('Set-Cookie', [`id=${usrpass}`, `identiy=${username}`]);
            rst = { status: 'ok' }
            console.log(results)
            await wait(1400)
            res.redirect('/mainPage.html');
        }
    })
})

// Showing user details when user logged in 
async function answerUsrdata(request, response) {
    let data = await getPostData(request)

    if (data.type == 'getUsrData') {
        let getData = `SELECT * FROM users where email ='${data.usrmail}' AND password = '${data.usrid}'`

        Connection.query(getData, (err, rows) => {
            if (err) {
                response.json({ status: 'ko', result: 'Database error' })
                console.log(err)
            } else {
                response.json({ status: 'ok', result: rows })
            }
        })
    }

    else if (data.type === 'searchUsers') {
        let getData = `SELECT * FROM users`

        Connection.query(getData, (err, rows) => {
            if (err) {
                response.json({ status: 'ko', result: 'Database error' })
                console.log(err)
            } else {
                response.json({ status: 'ok', result: rows })
            }
        })
    }

    else if (data.type === 'sendMessages') {
        let sendData = `INSERT INTO messages(msg_id, incoming_msg_id, incoming_user_name, outgoing_user_name,outgoing_msg_id,msg,Time,Photo) values('${data.msgId}', '${data.currentUserId}', '${data.currentUserName}','${data.chatUserName}', '${data.chatUserId}', '${data.message}', '${data.time}', '${data.photo}')`
        Connection.query(sendData, (err, rows) => {
            if (err) {
                response.json({ status: 'ko', result: 'Database error' })
                console.log(err)
            } else {
                response.json({ status: 'ok', result: rows })
            }
        })
    }

    else if (data.type === 'getUserChats') {
        let getData = `SELECT * FROM messages where incoming_msg_id ='${data.currentUserId}' AND outgoing_msg_id = '${data.chatUserId}' OR  outgoing_msg_id ='${data.currentUserId}' AND incoming_msg_id = '${data.chatUserId}' order by id`

        Connection.query(getData, (err, rows) => {
            if (err) {
                response.json({ status: 'ko', result: 'Database error' })
                console.log(err)
            } else {
                response.json({ status: 'ok', result: rows })
            }
        })
    }

    else if (data.type === 'userChat') {
        let getData = `SELECT * FROM users where unique_id = '${data.chatUserId}'`

        Connection.query(getData, (err, rows) => {
            if (err) {
                response.json({ status: 'ko', result: 'Database error' })
                console.log(err)
            } else {
                response.json({ status: 'ok', result: rows })
            }
        })
    }

    else if (data.type === 'getConnectedUsers') {
        let getData = `SELECT * FROM messages where incoming_msg_id ='${data.currentUserId}' AND incoming_user_name = '${data.currentUserName}' OR  outgoing_msg_id ='${data.currentUserId}' AND outgoing_msg_id = '${data.currentUserName}'`

        Connection.query(getData, (err, rows) => {
            if (err) {
                response.json({ status: 'ko', result: 'Database error' })
                console.log(err)
            } else {
                response.json({ status: 'ok', result: rows })
            }
        })
    }
}

// Upload Servicios
app.use(upload())

// Upload foto while registering
app.post('/register.html', function (req, res) {
    console.log(req.files); // the uploaded file object
    let sampleFile; // Input Name
    sampleFile = req.files.sampleFile;
    let uploadPath = __dirname + '/public/images/usrProfilePhoto/' + sampleFile.name;
    sampleFile.mv(uploadPath)
    res.redirect('/register.html');
});


main()

async function getPostData(request) {
    return new Promise(async (resolve, reject) => {
        let body = '',
            error = null

        request.on('data', (data) => { body = body + data.toString() })
        request.on('close', () => { /* TODO - Client closed connection, destroy everything! */ })
        request.on('error', (err) => { error = 'Error getting data' })
        request.on('end', async () => {
            if (error !== null) {
                console.log('Error getting data from post: ', error)
                return reject(error)
            } else {
                try {
                    return resolve(JSON.parse(body))
                } catch (e) {
                    console.log('Error parsing data from post: ', error)
                    return reject(e)
                }

            }
        })
    })
}

async function wait(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve() }, time)
    })
}