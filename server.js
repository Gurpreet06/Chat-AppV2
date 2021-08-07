let express = require('express')
const md5 = require('md5')
const fs = require('fs')
const upload = require('express-fileupload')
const mysql = require('mysql2')

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
}


async function answerQuery(request, response) {
    let data = await getPostData(request)
    let rst = {}

    // Saving user registration data
    if (data.type == 'SaveUserData') {
        rst = { status: 'ok' }
        let dataPs = md5(data.contrasenya)
        dataPs = md5(dataPs)
        let insrtData = `INSERT INTO users(unique_id, firstname, Lastname, email, password, photo) values('${data.id}', '${data.nom}', '${data.cognom}', '${data.mail}',  '${dataPs}', '${data.image}')`
        Connection.query(insrtData, (err, rows) => {
            if (err) throw err
        })
    }

    else {
        rst = { status: 'Ko' }
    }

    response.json(rst)
}

// Upload Servicios
app.use(upload())

// Upload foto while registering
app.post('/index.html', function (req, res) {
    console.log(req.files); // the uploaded file object
    let sampleFile; // Input Name
    sampleFile = req.files.sampleFile;
    let uploadPath = __dirname + '/public/images/usrProfilePhoto/' + sampleFile.name;
    sampleFile.mv(uploadPath)
    res.redirect('/index.html');
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