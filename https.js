const https = require('https');
const fs = require('fs');
const http = require("http")
const express = require('express');
app = express()

var cert = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/fullchain.pem", 'utf8')
var key = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/privkey.pem", 'utf8')
var cert2 = fs.readFileSync(__dirname + "/certsFiles/selfsigned.crt", 'utf8')
var key2 = fs.readFileSync(__dirname + "/certsFiles/selfsigned.key", 'utf8')

let options = {
    key: key2,
    cert: cert2
}



app.use(function(req, res, next) {
    console.log("Inside HTTPS Server")
    console.log(JSON.stringify(req.headers.host))
    next()
});

app.get('/', (req, res) => {
    res.send('Hello World.');
});


https_server = https.createServer(options, app)

https_server.listen(9010, function() {
    console.log("Https simple server running on port 9010")
})