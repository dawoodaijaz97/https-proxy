const https = require('https');
const fs = require('fs');
const http = require("http")
const httpproxy = require("http-proxy")
let Greenlock = require("greenlock-express");
const express = require('express');
app = express()

var cert = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/fullchain.pem", 'utf8')
var key = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/privkey.pem", 'utf8')

let options = {
    key: key,
    cert: cert
}

//GET home route
proxy_server = httpproxy.createServer({
    target: {
        host: "localhost",
        port: 9010
    },
    ssl: {
        key: key,
        cert: cert
    }
});


proxy_server.listen(9000, function() {
    console.log("Proxy server running on port 9000")
})



app.use(function(req, res) {
    console.log("Inside HTTPS Server")
    console.log(JSON.stringify(req.headers.host))
    host = req.hostname
    console.log(host)
    try {
        proxy_server.web(req, res, {
            target: "https://" + req.hostname,
        });
    } catch (e) {
        console.error(e)
    }
});

app.get('/', (req, res) => {
    res.send('Hello World.');
});


http_server = http.createServer(options, app)

http_server.listen(9010, function() {
    console.log("Http simple server running on port 9010")
})