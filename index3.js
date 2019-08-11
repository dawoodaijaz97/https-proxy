const https = require('https');
const fs = require('fs');
const http = require("http")
const httpproxy = require("http-proxy")
let Greenlock = require("greenlock-express");
const express = require('express');
app = express()

var cert = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/fullchain.pem", 'utf8')
var key = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/privkey.pem", 'utf8')
var cert2 = fs.readFileSync(__dirname + "/certsFiles/selfsigned.crt", 'utf8')
var key2 = fs.readFileSync(__dirname + "/certsFiles/selfsigned.key", 'utf8')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = false
let options = {
    key: key,
    cert: cert
}

//GET home route
proxy_server = httpproxy.createServer({
    target: "https://localhost:9010",
    secure: false,
    ssl: {
        key: key2,
        cert: cert2
    }
});


proxy_server.listen(443, function() {
    console.log("Proxy server running on port 443")
})
proxy_server.on('proxyRes', function(proxyRes, req, res) {
    console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

proxy_server.on('error', function(err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    })
})
proxy_server.on('open', function(proxySocket) {
    // listen for messages coming FROM the target here
    proxySocket.on('data', hybiParseAndLogMessage);
});



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


https_server = https.createServer(options, app)

https_server.listen(9010, function() {
    console.log("Https simple server running on port 9010")
})