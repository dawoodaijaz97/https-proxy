const https = require('https');
const fs = require('fs');
const http = require("http")
const httpproxy = require("http-proxy")
let Greenlock = require("greenlock-express");
app = require("./app")

var cert = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/fullchain.pem", 'utf8')
var key = fs.readFileSync("/etc/letsencrypt/live/instance2mymachines.xyz/privkey.pem", 'utf8')

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
        key: key,
        cert: cert
    }
}).listen(443, function() {
    console.log("Proxy Running : 443")
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


https_server = https.createServer(options, app)

https_server.listen(9010, function() {
    console.log("Https simple server running on port 9010")
})